// Tab switching between sections
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".tab-content").forEach(tab =>
      tab.classList.remove("active")
    );
    document.querySelectorAll(".nav-item").forEach(item =>
      item.classList.remove("active")
    );

    const tabId = e.currentTarget.dataset.tab;
    document.getElementById(tabId).classList.add("active");
    e.currentTarget.classList.add("active");
    
    // Special handling for map tab
    if (tabId === 'map') {
        // Wait for the tab to be visible then initialize map
        setTimeout(() => {
            if (typeof initMap === 'function') {
                initMap();
            }
        }, 300); // Increased delay to ensure tab is visible
    }
  });
});

// Add this function to force map refresh
function refreshMap() {
    if (map) {
        setTimeout(() => {
            map.invalidateSize(true);
            map.setView([40.7128, -74.0060], 13);
        }, 100);
    }
}