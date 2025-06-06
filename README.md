🌿 Plant Disease Detection

Welcome! This is a pet project of mine that brings together deep learning and web development to help detect plant diseases from leaf images. On one side, there’s a Flask-powered API that hosts a PyTorch model, and on the other, a React frontend where you can upload a photo of a leaf and instantly see what’s going on.

I built this project because I’m fascinated by how AI can support agriculture and make life easier for farmers and hobbyist gardeners alike. If you’ve ever wondered whether that weird spot on your tomato leaf is serious, this tool is for you.

🌱 Why This Project Exists
Instant Feedback: **Upload a picture of a leaf, and get a diagnosis in seconds.**

Hands-On Learning: Combines a simple Flask API with a React UI—perfect for anyone learning full-stack development.

Open to Contributions: Want to add more plant types? Improve the UI? Jump in! This repo is meant to be a springboard for creative ideas.

🖼️ What You’ll See
Home Page (React)
A clean, modern interface where you can drag & drop—or browse for—a photo of your plant leaf.

Backend Endpoint (Flask)
Receives the uploaded image, runs it through a pre-trained PyTorch model, and returns a JSON response like:

json
Copy
Edit
{
  "disease": "Tomato Early Blight",
  "confidence": 0.92
}
Results
Right after you hit “Submit,” the UI displays the predicted disease name along with a confidence score. No more guessing!

Pro tip: Try taking a clear, well-lit photo of a single leaf for the best accuracy.

🔨 How to Get This Running Locally
Ready to see it in action? Here’s how you can set everything up on your machine. I’ve tried to make these steps as straightforward as possible—no surprise Easter eggs, I promise.

1. Clone the Repository
Open a terminal and run:

bash
Copy
Edit
git clone https://github.com/SayanRoy001/Plant-Disease-Detection.git
cd Plant-Disease-Detection
This will download the code to a folder called Plant-Disease-Detection.

2. Backend Setup (Flask + PyTorch)
Navigate into the backend folder

bash
Copy
Edit
cd backend
Create a virtual environment (keeps your Python dependencies isolated)

On Windows (PowerShell):

powershell
Copy
Edit
python -m venv venv
.\venv\Scripts\Activate.ps1
On Windows (Git Bash):

bash
Copy
Edit
python -m venv venv
source venv/Scripts/activate
On macOS / Linux:

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
After activation, your prompt should start with (venv).

Install the Python dependencies

bash
Copy
Edit
pip install --upgrade pip
pip install -r requirements.txt
This pulls in Flask, PyTorch, and any other packages listed in requirements.txt.

Start the Flask server

bash
Copy
Edit
python main.py
You should see something like:

csharp
Copy
Edit
* Serving Flask app "main"
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
Leave this terminal open—your API is now live at http://127.0.0.1:5000/.

Quick sanity check
If you have a /ping route (optional), test it:

bash
Copy
Edit
curl http://127.0.0.1:5000/ping
You might get back:

json
Copy
Edit
{"status":"OK"}
3. Frontend Setup (React)
Open a new terminal (keep the Flask server running in its own window), and follow these steps:

Navigate to the frontend folder

bash
Copy
Edit
cd ../frontend
Install Node.js & npm
If you don’t already have them, download Node.js (which includes npm) from nodejs.org. During installation, make sure to check “Add to PATH.”
After installing, verify with:

bash
Copy
Edit
node --version
npm --version
Install React dependencies

bash
Copy
Edit
npm install
This pulls in React, Axios (for HTTP requests), and any other JavaScript packages you’ll need.

Set up the proxy (avoids CORS headaches)
In frontend/package.json, you should see a line like:

json
Copy
Edit
"proxy": "http://127.0.0.1:5000",
If it’s not there, add it under the top-level keys. With that in place, any requests to /predict from your React code will automatically forward to the Flask API.

Start the React dev server

bash
Copy
Edit
npm start
Your default browser should pop open at http://localhost:3000/. If it doesn’t, just navigate there manually.

🧪 Testing It Out
Once both servers are running, open your browser to http://localhost:3000/.

You’ll see a simple form (or drag/drop area). Pick a clear leaf image.

Click Submit, and within a second or two, you’ll see:

The predicted disease name (e.g. Apple Scab).

The confidence score (e.g. 0.89).

Behind the scenes, React sent the image to Flask’s /predict endpoint, the PyTorch model did its magic, and the result was sent back as JSON. It’s pretty neat to watch the console logs in Flask as requests come in.

