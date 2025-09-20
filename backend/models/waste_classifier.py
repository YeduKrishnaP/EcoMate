from dotenv import load_dotenv
import os
import requests
import base64
from PIL import Image
from io import BytesIO
import json




with Image.open("C:/Users/pyedu/Desktop/EcoLife/Garbage Classfn Datasets/garbage-classfn by asdasdasasdas/Garbage classification/Garbage classification/metal/metal16.jpg") as img:
    img_resized = img.resize((400, 300))
    buffered = BytesIO()
    img_resized.save(buffered, format="PNG")
    base64_img = base64.b64encode(buffered.getvalue()).decode()
img_data_uri = f"data:image/png;base64,{base64_img}"







print(os.getenv("OPEN_ROUTER_API_KEY"))
OPEN_ROUTER_API_KEY = "Bearer " +  os.getenv("OPEN_ROUTER_API_KEY")
load_dotenv()  # loads variables from .env file in current directory


response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": OPEN_ROUTER_API_KEY,
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "x-ai/grok-4-fast:free",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Classify this waste image and give potential reuse ideas"
          },
          {
            "type": "image_url",
            "image_url": {"url": img_data_uri}
          }
        ]
      }
    ],
    
  })
)

print(response.json())





# api_key = os.getenv("PERPLEXITY_API_KEY")
# url = "https://api.perplexity.ai/chat/completions"
# headers = {
#     "Accept": "application/json",
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {api_key}"
# }

# body = {
#     "model": "sonar",
#     "stream": False,
#     "messages": [
#         {"role": "user", "content": [
#             {"type": "text", "text": "Classify this waste image and give potentiala reuse ideas"},
#             {"type": "image_url", "image_url": {"url": img_data_uri}}
#         ]}
#     ]
# }

# response = requests.post(url, headers=headers, json=body)
# print(response.json())