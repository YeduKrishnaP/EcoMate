const API_BASE = "http://127.0.0.1:5000";

async function loadMap() {
  let res = await fetch(`${API_BASE}/api/locations`);
  let data = await res.json();

  const container = document.getElementById("locationList");
  container.innerHTML = data.map(loc => `
    <div class="location-card">
      <h4>${loc.name}</h4>
      <p>Type: ${loc.type}</p>
      <p>Rating: ${loc.rating}⭐</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", loadMap);
