document.addEventListener("DOMContentLoaded", () => {
  const worksContainer = document.getElementById("works-container");
  const searchInput = document.getElementById("search-input");
  const countDisplay = document.getElementById("count-display");
  const themeToggle = document.getElementById("theme-toggle");

  let searchQuery = "";

  // Theme Management
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = `
        <span id="theme-icon">☀️</span>
        <span id="theme-text">Mode Terang</span>
      `;
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.innerHTML = `
        <span id="theme-icon">🌙</span>
        <span id="theme-text">Mode Malam</span>
      `;
    }
  }

  const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  applyTheme(initialDark);

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextDark = !isDark;
    localStorage.setItem("portfolio-theme", nextDark ? "dark" : "light");
    applyTheme(nextDark);
  });

  // Get class badge modifier
  function getClassModifier(gradeStr) {
    const clean = (gradeStr || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `class-tag ${clean}`;
  }

  // Render list of projects
  function renderList() {
    const query = searchQuery.toLowerCase().trim();
    const filtered = studentProjects.filter((item) => {
      return (
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.grade.toLowerCase().includes(query)
      );
    });

    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} karya`;
    }

    if (filtered.length === 0) {
      worksContainer.innerHTML = `
        <div class="empty-box">
          <span>🧐</span>
          <p>Karya dengan kata kunci "${escapeHtml(searchQuery)}" belum ketemu nih</p>
        </div>
      `;
      return;
    }

    worksContainer.innerHTML = filtered
      .map((item, idx) => {
        const numStr = String(idx + 1).padStart(2, "0");
        const classBadge = getClassModifier(item.grade);

        return `
          <div class="work-item-row">
            <div class="item-left">
              <span class="item-num">${numStr}</span>
              <span class="student-name">${escapeHtml(item.name)}</span>
            </div>

            <div class="item-right">
              <span class="${classBadge}">${escapeHtml(item.grade)}</span>
              <a href="${encodeURI(item.url)}" target="_blank" rel="noopener noreferrer" class="open-btn">
                <span>Buka</span>
                <span class="open-icon">🚀</span>
              </a>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Realtime instant search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderList();
  });

  // Initial render
  renderList();
});
