import os
import requests
import base64
from PIL import Image
from io import BytesIO
import json
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

def classify_image_from_bytes(image_bytes):
    """
    Classify waste image from bytes using OpenRouter's Grok model
    """
    try:
        # Convert bytes to PIL Image
        image = Image.open(BytesIO(image_bytes))

        # Resize image to optimize for API call
        image_resized = image.resize((400, 300))

        # Convert to base64
        buffered = BytesIO()
        image_resized.save(buffered, format="PNG")
        base64_img = base64.b64encode(buffered.getvalue()).decode()
        img_data_uri = f"data:image/png;base64,{base64_img}"

        # Get API key
        api_key = os.getenv("OPEN_ROUTER_API_KEY")
        if not api_key:
            print("ERROR: OPEN_ROUTER_API_KEY not found in environment variables")
            return {
                "category": "Error",
                "bin": "Configuration Error",
                "tip": "Please set up your OpenRouter API key in .env file",
                "confidence": 0,
                "points": 0,
                "reuse_ideas": "Check your API key configuration"
            }

        print(f"Using API key: {api_key[:10]}...")  # Debug log

        # Make API call to OpenRouter with Grok Vision model
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "x-ai/grok-4-fast:free",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Analyze this waste image and provide a JSON response with the following exact structure:
                                {
                                    "category": "exact waste category (Paper, Plastic, Organic, Glass, Metal, E-waste, Hazardous)",
                                    "bin": "which bin to dispose in",
                                    "tip": "disposal or recycling tip",
                                    "confidence": 85,
                                    "points": 15,
                                    "reuse_ideas": "creative reuse suggestions"
                                }

                                Be specific and accurate. Only respond with the JSON object, no additional text."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": img_data_uri}
                            }
                        ],
                    }
                ]
            }
        )

        print(f"API Response Status: {response.status_code}")  # Debug log

        if response.status_code == 200:
            result = response.json()
            print(f"API Response: {result}")  # Debug log

            content = result['choices'][0]['message']['content']
            print(f"Content received: {content}")  # Debug log

            # Try to parse JSON from the response
            try:
                # Extract JSON from response (in case there's extra text)
                start = content.find('{')
                end = content.rfind('}') + 1
                if start != -1 and end != 0:
                    json_str = content[start:end]
                    classification_data = json.loads(json_str)

                    # Validate required fields
                    required_fields = ['category', 'bin', 'tip', 'confidence', 'points', 'reuse_ideas']
                    for field in required_fields:
                        if field not in classification_data:
                            classification_data[field] = "Not specified"

                    return classification_data
                else:
                    # Fallback if JSON parsing fails
                    print("Could not find JSON structure in response")
                    return {
                        "category": "Unknown",
                        "bin": "General Waste",
                        "tip": "Please try again with a clearer image",
                        "confidence": 50,
                        "points": 5,
                        "reuse_ideas": "Consider consulting local waste management guidelines"
                    }
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                # Fallback response
                return {
                    "category": "Unknown",
                    "bin": "General Waste", 
                    "tip": content[:200] if content else "Classification failed",
                    "confidence": 50,
                    "points": 5,
                    "reuse_ideas": "Consider reusing or repurposing this item"
                }
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return {
                "category": "Error",
                "bin": "API Error",
                "tip": f"API call failed with status {response.status_code}",
                "confidence": 0,
                "points": 0,
                "reuse_ideas": "Please try again later"
            }

    except Exception as e:
        print(f"Classification exception: {str(e)}")
        return {
            "category": "Error",
            "bin": "System Error",
            "tip": f"Classification failed: {str(e)}",
            "confidence": 0,
            "points": 0,
            "reuse_ideas": "Please check your setup and try again"
        }

# Test function to verify the setup
def test_classification():
    """Test function to verify API connectivity"""
    # Create a small test image
    test_img = Image.new('RGB', (100, 100), color='red')
    buffered = BytesIO()
    test_img.save(buffered, format="PNG")
    image_bytes = buffered.getvalue()

    result = classify_image_from_bytes(image_bytes)
    print(f"Test result: {result}")
    return result

if __name__ == "__main__":
    # Run test when file is executed directly
    test_classification()
