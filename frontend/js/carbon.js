const API_BASE = "http://127.0.0.1:5000";

async function loadCarbon() {
  let res = await fetch(`${API_BASE}/api/carbon`);
  let data = await res.json();

  document.getElementById("dailyCarbon").textContent = data.today;
  document.getElementById("monthlyCarbon").textContent = data.monthly;
  document.getElementById("reductionCarbon").textContent = data.reduction;
}

document.addEventListener("DOMContentLoaded", loadCarbon);
