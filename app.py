from flask import Flask, request, jsonify, send_from_directory
import os, json, logging
from werkzeug.utils import secure_filename
from datetime import datetime
from PIL import Image
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')

BASE_DIR = os.getcwd()
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

GEMINI_API_KEY = os.getenv("AIzaSyB7GqxPkUH3ZJ7Fx5VPZpSuca7WJhA9n_E", "")
WEATHER_API_KEY = os.getenv("5f628576db904bd5a6173624252009", "")

API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

logging.basicConfig(level=logging.INFO)

# ===== ROUTES =====
@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:page>")
def serve_page(page):
    if not os.path.splitext(page)[1]:
        page += ".html"
    file_path = os.path.join(BASE_DIR, page)
    if os.path.exists(file_path):
        return send_from_directory(BASE_DIR, page)
    return "404 - Page Not Found", 404

# ===== CHATBOT =====
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    import re
    lang = "Hindi" if re.search(r'[\u0900-\u097F]', user_message) else "English"
    prompt = f"You are SMARTCROP AI Assistant. Reply in {lang}. User Question: {user_message}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "topK": 40, "topP": 0.95, "maxOutputTokens": 1024},
    }

    try:
        r = requests.post(API_URL, json=payload)
        data = r.json()
        reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "⚠️ No reply")
    except Exception as e:
        reply = f"❌ API Error: {e}"

    return jsonify({"reply": reply})

# ===== WEATHER =====
@app.route("/weather")
def weather():
    location = request.args.get("location")
    if not location:
        return jsonify({"error": "Location required"}), 400
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={location}&aqi=no"
        r = requests.get(url)
        data = r.json()
        if "error" in data:
            return jsonify({"error": "Invalid location"}), 400

        weather_data = {
            "location": f"{data['location']['name']}, {data['location']['region']}, {data['location']['country']}",
            "temp": data['current']['temp_c'],
            "condition": data['current']['condition']['text'],
            "icon": data['current']['condition']['icon'],
            "humidity": data['current']['humidity'],
            "windSpeed": data['current']['wind_kph'],
        }
        return jsonify({"weather": weather_data})
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ===== IMAGE DETECTION =====
@app.route("/analyze", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    image_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(image_path)

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-pro-vision")
        img = Image.open(image_path)
        prompt = "Analyze this agricultural image and return JSON with plant name, health, confidence, care tips."
        response = model.generate_content([prompt, img])
        text = response.text

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()

        try:
            result = json.loads(text)
        except:
            result = {"error": "AI did not return valid JSON", "raw": text}

        return jsonify(result)
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "timestamp": str(datetime.now())})

if __name__ == "__main__":
    print("🚀 SMARTCROP running at http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
