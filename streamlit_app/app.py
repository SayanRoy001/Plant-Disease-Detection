import os
import io
import json
import torch
import timm
from PIL import Image
import streamlit as st
import torchvision.transforms as transforms
from dotenv import load_dotenv
import requests

load_dotenv()

st.set_page_config(page_title="Plant Disease Detection", layout="wide")

# -----------------------------
# Theming / lightweight styling
# -----------------------------
st.markdown(
    """
    <style>
    /* Center title a bit nicer and tweak font sizes */
    .main > div {padding-top: 1rem;}
    h1, h2, h3 { font-family: 'Segoe UI', sans-serif; }
    .prob-row {display:flex; align-items:center; gap:.5rem;}
    .prob-label {flex:0 0 220px; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .small-note {font-size:0.75rem; color:#666;}
    </style>
    """,
    unsafe_allow_html=True
)


THIS_FILE_DIR = os.path.abspath(os.path.dirname(__file__))
REPO_ROOT = os.path.abspath(os.path.join(THIS_FILE_DIR, ".."))
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")

MODEL_PATH = os.getenv("MODEL_PATH") or os.path.join(BACKEND_DIR, "plant_disease_model.pth")
CLASS_INDEX_PATH = os.getenv("CLASS_INDEX_PATH") or os.path.join(BACKEND_DIR, "class_indices.json")
MODEL_DOWNLOAD_URL = os.getenv("MODEL_DOWNLOAD_URL")  # optional: direct URL to .pth

def ensure_model_file():
    """If the model file is missing and a MODEL_DOWNLOAD_URL is provided, attempt to download it.

    This lets you deploy without committing a large weight file (can keep it in a release, S3, etc.).
    """
    if os.path.isfile(MODEL_PATH):
        return
    if not MODEL_DOWNLOAD_URL:
        return
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    try:
        with requests.get(MODEL_DOWNLOAD_URL, stream=True, timeout=300) as r:
            r.raise_for_status()
            total = int(r.headers.get('content-length', 0))
            chunk_size = 8192
            downloaded = 0
            tmp_path = MODEL_PATH + '.download'
            with open(tmp_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
            os.replace(tmp_path, MODEL_PATH)
    except Exception as e:
        # If download fails we silently continue; load_model will raise a clearer error.
        print(f"[WARN] Model download failed: {e}")

@st.cache_resource(show_spinner=True)
def load_model():
    ensure_model_file()
    if not os.path.isfile(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at '{MODEL_PATH}'.\n"
            f"Checked backend directory: {BACKEND_DIR}\n"
            "If you are running Streamlit from inside 'streamlit_app', the path is now automatically resolved one level up. "
            "If your model is elsewhere set MODEL_PATH env var."
        )
    model = timm.create_model('convmixer_1024_20_ks9_p14.in1k', pretrained=True, num_classes=38)
    try:
        state_dict = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
    except Exception as e:  # Capture UnpicklingError or others
        # Collect diagnostics
        try:
            file_size = os.path.getsize(MODEL_PATH)
        except OSError:
            file_size = -1
        head_snippet = ""
        try:
            with open(MODEL_PATH, 'rb') as f:
                raw_head = f.read(512)
                # Attempt decode for heuristics
                head_snippet = raw_head.decode(errors='ignore')
        except Exception:
            pass
        hints = []
        if file_size != -1 and file_size < 50_000:
            hints.append("Model file is unexpectedly small (<50KB) → likely a Git LFS pointer or failed download.")
        if 'git-lfs.github.com' in head_snippet:
            hints.append("Detected Git LFS pointer text. The real weights were not pulled. Run 'git lfs install' then 'git lfs pull'.")
        if '<html' in head_snippet.lower():
            hints.append("File begins with HTML → downloaded an error/consent page instead of the .pth (common with Google Drive links without direct access).")
        if 'DriveDownload' in head_snippet or 'download_warning' in head_snippet:
            hints.append("Google Drive warning page captured. Use a direct 'uc?export=download&id=FILE_ID' link or supply MODEL_DOWNLOAD_URL already in raw form.")
        hints.append("Confirm the file was saved with torch.save(model.state_dict(), 'plant_disease_model.pth') and not a full model with custom classes.")
        diagnostic_msg = "\n\n".join(hints)
        raise RuntimeError(
            f"Failed to load model state_dict: {e}\n"
            f"File size: {file_size} bytes\n"
            f"First 200 chars: {head_snippet[:200]!r}\n"
            f"Hints:\n{diagnostic_msg}"
        ) from e
    # If the file was accidentally saved as a whole model object
    if not isinstance(state_dict, dict):
        # Attempt to treat it as an already-built model
        try:
            loaded_model = state_dict
            loaded_model.eval()
            return loaded_model
        except Exception:
            raise TypeError("Loaded object is not a state_dict dict. Re-save using torch.save(model.state_dict(), '...pth').")
    model.load_state_dict(state_dict, strict=False)
    model.eval()
    model.to(torch.device('cpu'))
    return model

@st.cache_resource
def load_class_indices():
    if not os.path.isfile(CLASS_INDEX_PATH):
        raise FileNotFoundError(
            f"Class index file not found at '{CLASS_INDEX_PATH}'. Set CLASS_INDEX_PATH env var if located elsewhere."
        )
    with open(CLASS_INDEX_PATH, 'r') as f:
        ci = json.load(f)
    return {int(k): v for k, v in ci.items()}

def preprocess_image(img, target_size=(256, 256)):
    img = img.convert('RGB').resize(target_size)
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])
    tensor_img = transform(img).unsqueeze(0)
    return tensor_img

def predict(model, tensor_img):
    with torch.no_grad():
        outputs = model(tensor_img)
    idx = outputs.argmax(dim=1).item()
    return idx

import google.generativeai as genai
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
GENAI_MODEL = os.getenv("GENAI_MODEL", "gemini-1.5-flash")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

def get_disease_details(disease_name: str):
    if not GENAI_API_KEY:
        return "(GENAI_API_KEY not set)"
    try:
        model = genai.GenerativeModel(GENAI_MODEL)
        prompt = f"""
        You are a plant pathology assistant. Write a concise, structured note for the disease: {disease_name}.
        Use EXACT section headings with colons so the client can parse them:
        What it is:
        Causes:
        Symptoms:
        Effects on the plant:
        Treatment Plan:
        Prevention Methods:
        Keep sentences simple and to the point.
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error: {e}"

st.title("🌿 Plant Disease Detection (Streamlit)")
st.markdown(
    """
**Upload a clear plant leaf image** to get a **model prediction** plus optional **AI‑generated, structured guidance**.

The model was trained (fine‑tuned) on the public **Kaggle PlantVillage dataset** (38 classes). Results are illustrative and **not a substitute for professional agronomic diagnosis**.
    """
)

# Sidebar / About section
with st.sidebar:
    st.header("About")
    st.write(
        """
        This app performs image classification of plant leaf diseases using a ConvMixer
        architecture (timm: `convmixer_1024_20_ks9_p14.in1k`). It predicts one of 38
        classes derived from the Kaggle PlantVillage dataset.

        After prediction you can optionally request concise management & prevention
        notes generated by a Gemini model (if an API key is configured).
        """
    )
    st.markdown("**Dataset**: Kaggle PlantVillage (curated & augmented).")
    st.markdown("**Model File**: `plant_disease_model.pth`")
    st.markdown("**Disclaimer**: For educational use; always confirm with experts.")
    st.markdown("---")
    st.markdown("Made with ❤️ by Sayan.")

col1, col2 = st.columns([1,1])

with col1:
    st.subheader("1. Upload & Predict")
    uploaded = st.file_uploader("Choose a leaf image", type=["jpg", "jpeg", "png"], help="JPEG or PNG; clear focus on the leaf")
    show_info = st.checkbox("Generate AI disease details (Gemini)", value=True, help="Requires GENAI_API_KEY")
    topk = st.slider("Show Top-K Predictions", min_value=1, max_value=5, value=3)
    predict_btn = st.button("🔍 Run Prediction", type="primary")

with col2:
    st.subheader("2. Results")
    results_placeholder = st.empty()
    probs_placeholder = st.empty()
    info_placeholder = st.empty()

with st.spinner("Loading model..."):
    model = load_model()
    class_labels = load_class_indices()

def compute_topk(outputs, k=3):
    probs = torch.softmax(outputs, dim=1)
    top_probs, top_indices = probs.topk(k)
    return [(int(i), float(p)) for p, i in zip(top_probs[0], top_indices[0])]

if predict_btn:
    if not uploaded:
        results_placeholder.warning("Please upload an image first.")
    else:
        image = Image.open(io.BytesIO(uploaded.read()))
        with results_placeholder.container():
            st.image(image, caption="Uploaded Image", use_column_width=True)
        tensor_img = preprocess_image(image)
        with torch.no_grad():
            outputs = model(tensor_img)
        probs_list = compute_topk(outputs, k=topk)
        primary_idx = probs_list[0][0]
        primary_label = class_labels[primary_idx]
        primary_prob = probs_list[0][1]
        results_placeholder.success(f"Primary Prediction: {primary_label} ({primary_prob*100:.2f}%)")

        # Display Top-K probability bars
        with probs_placeholder.container():
            st.markdown("#### Top Predictions")
            for cls_idx, p in probs_list:
                cls_name = class_labels[cls_idx]
                col_a, col_b = st.columns([0.45,0.55])
                with col_a:
                    st.write(f"{cls_name}")
                with col_b:
                    st.progress(min(1.0, max(0.0, p)), text=f"{p*100:.2f}%")
            st.caption("Probabilities are softmax outputs from the model.")

        if show_info:
            with info_placeholder.container():
                with st.spinner("Generating disease information..."):
                    details = get_disease_details(primary_label.replace('__', ' ').replace('_', ' '))
                st.markdown("#### Disease Information")
                st.write(details)
                st.markdown("<div class='small-note'>AI content may contain inaccuracies. Verify before acting.</div>", unsafe_allow_html=True)

st.caption("Model: convmixer_1024_20_ks9_p14.in1k | Powered by PyTorch & TIMM")
