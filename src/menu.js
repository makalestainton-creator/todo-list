// import { tasksContainer } from "./index.js";
// import { todos } from "./index.js";
// import editIcon from "./icons/edit.svg";
// import { applyPriorityStyles } from "./index.js";

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("left-sidebar");
export const overlay = document.getElementById("overlay");
const closeMenuButton = document.getElementById("close-menu");
// export const tasks = document.querySelectorAll(".js-task");
// const taskSummary = document.querySelector(".js-right-sidebar");
// const taskEssentials = taskSummary.querySelector(".task-essentials");
// const taskSummaryCloser = document.querySelector(".close-right-sidebar");

function closeMenu() {
  sidebar.classList.remove("open");
  closeMenuButton.classList.remove("close-menu-active");
}

export function toggleMenu() {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    closeMenuButton.classList.toggle("close-menu-active");
  });

  closeMenuButton.addEventListener("click", () => {
    closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });
}
