from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
from models.waste_classifier import classify_image_from_bytes

app = Flask(__name__)
CORS(app)

@app.route("/api/classify", methods=["POST"])
def classify():
    data = request.get_json(force=True)
    image_data = data.get("image", None)
    if not image_data:
        return jsonify({"error": "No image provided"}), 400

    header, encoded = image_data.split(",", 1)
    image_bytes = base64.b64decode(encoded)
    result = classify_image_from_bytes(image_bytes)
    return jsonify(result)

@app.route("/api/locations", methods=["GET"])
def locations():
    return jsonify([
        {"name": "Central Recycling Hub", "type": "recycling", "lat": 40.71, "lng": -74.00, "rating": 4.5},
        {"name": "E-Waste Center", "type": "ewaste", "lat": 40.75, "lng": -73.99, "rating": 4.2},
    ])

@app.route("/api/carbon", methods=["GET"])
def carbon():
    return jsonify({
        "today": 2.4,
        "monthly": 78,
        "reduction": -12
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
