🌿 Plant Disease Detection

Welcome! This is a pet project of mine that brings together deep learning and web development to help detect plant diseases from leaf images. On one side, there’s a Flask-powered API that hosts a PyTorch model, and on the other, a React frontend where you can upload a photo of a leaf and instantly see what’s going on.

I built this project because I’m fascinated by how AI can support agriculture and make life easier for farmers and hobbyist gardeners alike. If you’ve ever wondered whether that weird spot on your tomato leaf is serious, this tool is for you.

🌱 Why This Project Exists
Instant Feedback: **Upload a picture of a leaf, and get a diagnosis in seconds.**

Hands-On Learning: Combines a simple Flask API with a React UI—perfect for anyone learning full-stack development.

Open to Contributions: Want to add more plant types? Improve the UI? Jump in! This repo is meant to be a springboard for creative ideas.

🖼️ What You’ll See
1. Home Page (React)
A clean, modern interface where you can drag & drop—or browse for—a photo of your plant leaf.

2. Backend Endpoint (Flask)
Receives the uploaded image, runs it through a pre-trained PyTorch model, and returns a JSON response like:

    {
      "disease": "Tomato Early Blight",
      "confidence": 0.92
    }
   
3. Results
Right after you hit “Submit,” the UI displays the predicted disease name along with a confidence score. No more guessing!

**Tip: Try taking a clear, well-lit photo of a single leaf for the best accuracy.**

🔨 How to Get This Running Locally
Ready to see it in action? Here’s how you can set everything up on your machine. I’ve tried to make these steps as straightforward as possible—no surprise Easter eggs, I promise.

1. Clone the Repository
  Open a terminal and run:
      git clone https://github.com/SayanRoy001/Plant-Disease-Detection.git
      cd Plant-Disease-Detection

2. Backend Setup (Flask + PyTorch)
   a. Navigate into the backend folder
                    **  cd backend**
   b. Create a virtual environment (keeps your Python dependencies isolated)
                      **python -m venv venv(on windows Powershell)
                      .\venv\Scripts\Activate.ps1**
          After activation, your prompt should start with (venv).

   c. Install the Python dependencies
                     **pip install --upgrade pip
                     pip install -r requirements.txt**

   d. Start the Flask server
                      **python main.py**
                  * Serving Flask app "main"
                  * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)

3. Frontend Setup (React)
    Open a new terminal (keep the Flask server running in its own window).The next steps are:

   a. Navigate to the frontend folder
                  **  cd ../frontend**
   
   b. Install Node.js & npm
        After installing, verify with:
                   ** node --version
                    npm --version**
   
   c. Install React dependencies
                 **   npm install**

   d. Start the React dev server
                    **npm start**
              Your default browser should pop open at http://localhost:3000/.

🧪 **Testing It Out**
1. Once both servers are running, open your browser to http://localhost:3000/.

2. You’ll see a simple interface Labelled "Predict the Disease". Select any diseased plant image.

3. Click Submit, and within a second or two, you’ll see:

4. The predicted disease name (e.g. Apple Early blight).
   The confidence score (e.g. 0.97).


