[![GitHub](https://img.shields.io/badge/GitHub-EcoMate-green)](https://github.com/YeduKrishnaP/EcoMate)
[![Python](https://img.shields.io/badge/Python-3.7+-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-Web%20Framework-red)](https://flask.palletsprojects.com/)
[![AI Powered](https://img.shields.io/badge/AI-OpenRouter%20Grok-purple)](https://openrouter.ai/)

EcoMate is a comprehensive environmental sustainability platform designed to help users track their environmental impact, classify waste, discover eco-friendly locations, and engage with a community-driven marketplace for sustainable living. The platform features AI-powered waste classification, carbon footprint tracking, gamification elements, and an interactive map system.

## ✨ Features

### 🔍 **AI-Powered Waste Classification**
- **Smart Photo Recognition**: Take photos or upload images to identify waste types
- **Disposal Guidance**: Get specific recommendations for proper disposal
- **Recycling Tips**: Learn how to recycle different materials correctly
- **Reuse Ideas**: Creative suggestions for repurposing items

### 🌍 **Carbon Footprint Calculator**
- **Transportation Tracking**: Calculate emissions from various vehicle types
- **Real-time Calculations**: Hardcoded emission factors for accurate results
- **Visual Analytics**: Interactive charts and progress tracking
- **Personalized Tips**: Custom recommendations based on your habits

### 🗺️ **Interactive Eco Map**
- **Location Discovery**: Find recycling centers, e-waste facilities, and green spaces
- **GPS Integration**: Locate nearby environmental facilities
- **Facility Details**: Hours, contact info, and user ratings
- **Custom Markers**: Different icons for various facility types

### 🎮 **Gamification System**
- **Points & Levels**: Earn rewards for environmental actions
- **Achievement System**: Unlock badges for sustainable behavior
- **Challenges**: Weekly and monthly environmental goals
- **Community Features**: Leaderboards and social sharing

### 💚 **Community Marketplace**
- **Item Sharing**: Exchange sustainable products with community
- **Local Connections**: Find eco-friendly items near you
- **Waste Reduction**: Give items a second life through sharing

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenRouter API key for AI features
- Internet connection for map services

  ## 🌟 Screenshots

### Waste Classification

![Waste Classifier 1](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/garbage_classifier%201.png)

![Waste Classifier 2](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/garbage_classifier%202.png)

![Waste Classifier 3](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/garbage_classifier%203.png)

![Waste Classifier 4](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/garbage_classifier%204.png)

### Carbon Calculator
![Carbon Calculator](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/carbon_footprint_tracker.png)

### Interactive Map
![Interactive Map](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/community_events_map.png)

### Community Marketplace!!!
![Community Hub]([<img width="953" height="479" alt="image" src="https://github.com/user-attachments/assets/171efb45-fc42-4227-bd08-c272ffd4788c" />](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/community_marketplace.png))

### Profile Dashboard for the Serious xP
![Profile Dashboard for the warriors]([<img width="955" height="476" alt="image" src="https://github.com/user-attachments/assets/cd4d4ade-f8bf-46ec-9d7c-42e98012663d" />](https://github.com/YeduKrishnaP/EcoMate/blob/main/images/eco_warrior_profile.png))


### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YeduKrishnaP/EcoMate.git
   cd EcoMate
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   OPEN_ROUTER_API_KEY=your_openrouter_api_key_here
   ```

5. **Run the backend server**
   ```bash
   python app.py
   ```
   Server runs on `http://127.0.0.1:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Serve the application**
   ```bash
   python -m http.server 8000
   ```

3. **Access the application**
   
   Open your browser and visit: `http://localhost:8000`

## 📁 Project Structure

```
EcoMate/
│
|
├── backend/
│   ├── app.py                     # Main Flask application
│   ├── models/
│   │   ├── waste_classifier.py    # AI waste classification logic
│   │   └── carbon_footprint_backend.py  # Carbon calculation with AI
│   ├── data/
│   │   ├── collection_points.json # Recycling location data
│   │   └── waste_data.json       # Waste classification database
├── frontend/
│   ├── index.html               # Main application page
│   ├── map.html                 # Interactive map page
│   ├── css/
│   │   └── style.css           # Main stylesheet with design system
│   └── js/
│       ├── app.js              # Tab navigation and initialization
│       ├── classify.js         # Waste classification functionality
│       ├── carbon.js           # Carbon footprint calculator
│       ├── map.js              # Interactive map features
│       ├── gamification.js     # Points and achievement system
│       ├── progress.js         # Progress tracking utilities
│       └── config.js           # Configuration constants
|── .env                      # Environment variables (create this with the openrouter key as env variable)
|
|── requirements.txt   
└── README.md                   # This file
```

## 🛠️ Technology Stack

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS Grid & Flexbox, Design System
- **Maps**: Leaflet.js for interactive mapping
- **Icons**: Font Awesome 6
- **APIs**: Camera API, Geolocation API, Fetch API

### Backend
- **Framework**: Flask (Python)
- **AI Integration**: OpenRouter API with Grok models
- **HTTP Client**: Requests library
- **Environment**: python-dotenv for configuration
- **CORS**: Flask-CORS for cross-origin requests

### External Services
- **AI Models**: OpenRouter (Grok-4-fast) for waste classification
- **Maps**: OpenStreetMap via Leaflet
- **Icons**: Font Awesome CDN

## 🎯 Key Features Explained

### AI Waste Classification
The platform uses advanced computer vision models through OpenRouter's API to:
- Identify waste materials from photos
- Provide disposal and recycling guidance
- Suggest creative reuse options
- Award points for sustainable actions

### Carbon Footprint Tracking
Real-time calculation system that:
- Uses scientifically-backed emission factors
- Tracks transportation-related emissions
- Provides visual progress indicators
- Offers personalized reduction strategies

### Interactive Mapping
Comprehensive location system featuring:
- Real-time GPS integration
- Custom markers for different facility types
- Detailed facility information and reviews
- Route planning for eco-friendly destinations

### Gamification Elements
Engaging user experience through:
- Point-based reward system
- Achievement badges and milestones
- Weekly environmental challenges
- Community leaderboards and social features
  

## 🔧 API Endpoints

### Waste Classification
```http
POST /api/classify
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "category": "Plastic",
  "bin": "Yellow Recycling",
  "tip": "Clean container before recycling",
  "confidence": 95,
  "points": 10,
  "reuse_ideas": "Use as plant pot or storage container"
}
```

### Eco Locations
```http
GET /api/locations
```

**Response:**
```json
[
  {
    "name": "Central Recycling Hub",
    "type": "recycling",
    "lat": 40.7128,
    "lng": -74.0060,
    "rating": 4.5,
    "hours": "Mon-Fri 8AM-6PM"
  }
]
```

### Carbon Footprint
```http
POST /api/carbon-footprint
Content-Type: application/json

{
  "vehicleType": "car",
  "fuelType": "petrol",
  "distance": 25,
  "frequency": "daily"
}
```



## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added gamification system
- **v1.2.0** - Enhanced AI classification accuracy
- **v1.3.0** - Interactive map improvements

---

<div align="center">
  <p><strong>🌍 Making environmental sustainability accessible to everyone</strong></p>
  <p>Built with ❤️ for a greener future</p>
</div>
