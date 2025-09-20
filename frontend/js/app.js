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
  });
});
