const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("left-sidebar");
const overlay = document.getElementById("overlay");
const closeMenuButton = document.getElementById("close-menu");

function closeMenu() {
  sidebar.classList.remove("open");
  closeMenuButton.classList.remove("close-menu-active");
  overlay.classList.remove("overlay-active");
}

export function toggleMenu() {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("overlay-active");
    closeMenuButton.classList.toggle("close-menu-active");
  });
  closeMenuButton.addEventListener("click", () => {
    closeMenu();
  });
  document.addEventListener("click", (e) => {
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  });
}
