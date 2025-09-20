const API_BASE = "http://127.0.0.1:5000";

async function classifyWaste() {
  let res = await fetch(`${API_BASE}/api/classify`, { method: "POST" });
  let data = await res.json();

  document.getElementById("classificationResult").innerHTML = `
    <div class="waste-result">
      <div class="result-icon">${data.icon}</div>
      <h3>${data.type}</h3>
      <p><strong>Bin:</strong> ${data.bin}</p>
      <p><strong>Tip:</strong> ${data.tip}</p>
      <p><strong>Confidence:</strong> ${data.confidence}</p>
      <p><strong>Points:</strong> +${data.points}</p>
    </div>
  `;
}

document.getElementById("captureBtn").addEventListener("click", classifyWaste);
