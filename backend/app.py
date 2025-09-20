from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Waste classification
@app.route("/api/classify", methods=["POST"])
def classify():
    waste_types = [
        {"type": "Paper", "bin": "Blue Recycling", "tip": "Remove staples", "icon": "📄", "points": 5},
        {"type": "Plastic", "bin": "Yellow Recycling", "tip": "Clean containers", "icon": "🥤", "points": 8},
        {"type": "Organic", "bin": "Green Compost", "tip": "Great for composting!", "icon": "🍌", "points": 3},
    ]
    result = random.choice(waste_types)
    confidence = f"{random.randint(80, 99)}%"
    return jsonify({**result, "confidence": confidence})

# Eco map
@app.route("/api/locations", methods=["GET"])
def locations():
    return jsonify([
        {"name": "Central Recycling Hub", "type": "recycling", "lat": 40.71, "lng": -74.00, "rating": 4.5},
        {"name": "E-Waste Center", "type": "ewaste", "lat": 40.75, "lng": -73.99, "rating": 4.2},
    ])

# Carbon tracker
@app.route("/api/carbon", methods=["GET"])
def carbon():
    return jsonify({
        "today": 2.4,
        "monthly": 78,
        "reduction": "-12%"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
