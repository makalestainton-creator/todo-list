import "./general.css";
import "./new-task-modal.css";
import editIcon from "./icons/edit.svg";
import personalIcon from "./icons/personal-projects.svg";
import workIcon from "./icons/work-projects.svg";
import healthIcon from "./icons/health.svg";
import learningIcon from "./icons/learning.svg";
import completedIcon from "./icons/done.svg";
import { toggleMenu, overlay } from "./menu.js";
import dayjs from "dayjs";

export const tasksContainer = document.getElementById("tasks-container");
const newTaskButtons = document.querySelectorAll(".js-new-task-button");
const newTaskModal = document.getElementById("new-task-modal");
const closeTaskModalBtn = newTaskModal.querySelector(".js-close");
const taskSummaryCloser = document.querySelector(".close-right-sidebar");
const taskSummary = document.querySelector(".js-right-sidebar");
const taskEssentials = taskSummary.querySelector(".task-essentials");

class Todo {
  constructor(todoDetails) {
    this.title = todoDetails.title;
    this.description = todoDetails.description;
    this.dueDate = todoDetails.dueDate;
    this.priority = todoDetails.priority;
    this.notes = todoDetails.notes;
    this.project = todoDetails.project;
    this.completed = false;
  }
}

export const todos = JSON.parse(localStorage.getItem("todos")) || [
  {
    title: "Buy groceries",
    description: "Get weekly groceries from the supermarket",
    dueDate: "2026-03-30",
    priority: "low",
    notes: "Don't forget the milk and eggs",
    project: "Personal",
    completed: false,
  },
  {
    title: "Finish project report",
    description: "Complete the quarterly report for the team",
    dueDate: "2026-04-01",
    priority: "high",
    notes: "Include charts from last month's data",
    project: "Work",
    completed: false,
  },
  {
    title: "Doctor appointment",
    description: "Annual checkup at the clinic",
    dueDate: "2026-04-05",
    priority: "medium",
    notes: "Bring insurance card",
    project: "Health",
    completed: false,
  },
  {
    title: "Fix login bug",
    description: "Users are unable to reset their password",
    dueDate: "2026-03-29",
    priority: "high",
    notes: "Reported by 3 users, check auth middleware",
    project: "Work",
    completed: false,
  },
  {
    title: "Read JavaScript book",
    description: "Continue reading You Don't Know JS",
    dueDate: "2026-04-10",
    priority: "low",
    notes: "Currently on chapter 4",
    project: "Learning",
    completed: false,
  },
];

todos.map((todoDetails) => {
  return new Todo(todoDetails);
});

toggleMenu();
renderTasks();
applyPriorityStyles();
addProjectSVG();

const firstTask = tasksContainer.querySelector(".js-task");
renderTaskSummary(firstTask);
applyEssentialsSVG();
applySummaryStyles();

toggleTaskSummary();

function saveToStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

let activeFilter = "all";

function renderTasks(tasklist = todos) {
  tasksContainer.innerHTML = tasklist
    .map((todo, index) => {
      const formattedDueDate = dayjs(todo.dueDate).format("DD MMMM YYYY");
      const realIndex = todos.indexOf(todo);
      return ` <div class="task js-task" data-index="${realIndex}">
      <div class="start">
        <input type="checkbox" class="js-completed" ${todo.completed ? "checked" : ""}  />
        <p class="title">${todo.title}</p>
      </div>
      <p class="description">${todo.description}</p>
      <p class="due-date">${formattedDueDate}</p>
      <div class="end">
        <p class="priority js-priority">${todo.priority}</p>
        <p class="project">
          <span class="project-svg"></span>
          ${todo.project}
        </p>
      </div>
    </div>
  `;
    })
    .join("");
}

function markAsCompleted(index) {
  const todo = todos[index];

  todo.completed = true;

  document.querySelector(".completed").classList.add("completed-visible");

  applyEssentialsSVG();
  applySummaryStyles();
}

tasksContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("js-completed")) {
    const index = Number(
      e.target.closest(".js-task").getAttribute("data-index"),
    );
    todos[index].completed = e.target.checked;
    saveToStorage();
    renderTaskSummary(e.target.closest(".js-task"));
    applyEssentialsSVG();
    applySummaryStyles();
  }
});

function getFilteredTasks(filter) {
  const today = dayjs().format("YYYY-MM-DD");

  if (filter === "today") {
    return todos.filter((todo) => {
      return todo.dueDate === today;
    });
  } else if (filter === "upcoming") {
    return todos.filter((todo) => {
      return dayjs(todo.dueDate).isAfter(today);
    });
  } else if (filter === "Personal") {
    return todos.filter((todo) => {
      return todo.project === "Personal";
    });
  } else if (filter === "Work") {
    return todos.filter((todo) => {
      return todo.project === "Work";
    });
  } else if (filter === "Learning") {
    return todos.filter((todo) => {
      return todo.project === "Learning";
    });
  } else if (filter === "Health") {
    return todos.filter((todo) => {
      return todo.project === "Health";
    });
  } else if (filter === "Completed") {
    return todos.filter((todo) => {
      return todo.completed === true;
    });
  }
  return todos;
}

function applyFilter(filter) {
  activeFilter = filter;
  const filtered = getFilteredTasks(filter);
  renderTasks(filtered);
  applyPriorityStyles();
  addProjectSVG();
  toggleTaskSummary();

  const firstTask = tasksContainer.querySelector(".js-task");
  if (firstTask) {
    renderTaskSummary(firstTask);
    applyEssentialsSVG();
    applySummaryStyles();
  } else {
    taskEssentials.innerHTML = `<p>No tasks for this filter.</p>`;
  }
}

function activateButton(activeBtn) {
  const buttons = document.querySelectorAll(".left-sidebar button");

  buttons.forEach((btn) => btn.classList.remove("filter-active"));
  activeBtn.classList.add("filter-active");
}

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activateButton(btn);
    applyFilter(btn.getAttribute("data-filter"));
    document.querySelector(".filter-title").textContent =
      `${btn.getAttribute("data-filter")}`;
  });
});

document.querySelectorAll(".project-filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    activateButton(btn);
    applyFilter(btn.textContent.trim());
    document.querySelector(".filter-title").textContent =
      `${btn.textContent.trim()}`;
  });
});

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    applyFilter(activeFilter); // restore current filter when search is cleared
    return;
  }

  const filtered = getFilteredTasks(activeFilter).filter((todo) =>
    todo.title.toLowerCase().includes(query),
  );

  renderTasks(filtered);
  applyPriorityStyles();
  addProjectSVG();
  toggleTaskSummary();

  const firstTask = tasksContainer.querySelector(".js-task");
  if (firstTask) {
    renderTaskSummary(firstTask);
    applyEssentialsSVG();
    applySummaryStyles();
  } else {
    taskEssentials.innerHTML = `<p>No matching tasks.</p>`;
  }
});

export function applyPriorityStyles() {
  const tasks = tasksContainer.querySelectorAll(".js-task");

  tasks.forEach((task) => {
    const taskPriority = task.querySelector(".js-priority");

    if (taskPriority.textContent === "low") {
      taskPriority.classList.add("low-priority");
    } else if (taskPriority.textContent === "medium") {
      taskPriority.classList.add("medium-priority");
    } else if (taskPriority.textContent === "high") {
      taskPriority.classList.add("high-priority");
    }
  });
}

function applySummaryStyles() {
  const taskPriority = taskEssentials.querySelector(".js-prior");

  if (taskPriority.textContent === "low") {
    taskPriority.classList.add("low-priority");
  } else if (taskPriority.textContent === "medium") {
    taskPriority.classList.add("medium-priority");
  } else if (taskPriority.textContent === "high") {
    taskPriority.classList.add("high-priority");
  }
}

function addProjectSVG() {
  const tasks = tasksContainer.querySelectorAll(".js-task");
  tasks.forEach((task) => {
    const project = task.querySelector(".project");
    const iconSpan = task.querySelector(".project-svg");

    if (project.textContent.trim() === "Personal") {
      iconSpan.innerHTML = `<img src="${personalIcon}" />`;
    } else if (project.textContent.trim() === "Work") {
      iconSpan.innerHTML = `<img src="${workIcon}" />`;
    } else if (project.textContent.trim() === "Health") {
      iconSpan.innerHTML = `<img src="${healthIcon}" />`;
    } else if (project.textContent.trim() === "Learning") {
      iconSpan.innerHTML = `<img src="${learningIcon}" />`;
    }
  });
}

function renderTaskSummary(taskElement) {
  const taskIndex = Number(taskElement.getAttribute("data-index"));

  todos.forEach((todo, todoIndex) => {
    if (todoIndex === taskIndex) {
      const formattedDueDate = dayjs(todo.dueDate).format("DD MMMM YYYY");
      taskEssentials.innerHTML = `
        <div class="task-title">
          
          <button class="edit-task" data-task-index="${taskIndex}">
          <h3>${todo.title}</h3>
            <img src="${editIcon}" />
          </button> 
          ${
            todo.completed
              ? `
          <p class="completed completed-visible">
            <img src="${completedIcon}"/>
            Completed
          </p>`
              : `
          <p class="completed">
            <img src="${completedIcon}"/>
            Completed
          </p>`
          }         
        </div>
        <p class="description">${todo.description}</p>
        <div class="subtasks">
          <h3>Subtasks</h3>
          <p class="subtask">None</p>
        </div>
        <div class="due-date">
          <p>Due date</p>
          <p>${formattedDueDate}</p>
        </div>
        <div class="priority js-priority">
          <p>Priority</p>
          <p class="js-prior">${todo.priority}</p>
        </div>
        <div class="project-container">
          <p class="project">Project</p>
          <p class="project-name">
            <span class="project-svg"></span>
            ${todo.project}
          </p>
        </div>
        <h4>notes</h4>
        <div class="notes">
          ${
            todo.notes ? `${todo.notes}` : "No notes for this task"
          }
        </div>
        <button class="delete-task" data-task-index="${taskIndex}">Delete Task</button>
      `;
    }
  });
  attachEditListeber();
  attachDeleteListener();
}

function applyEssentialsSVG() {
  const projectName = taskEssentials
    .querySelector(".project-name")
    .textContent.trim();
  const iconContainer = taskEssentials.querySelector(".project-svg");

  if (projectName === "Personal") {
    iconContainer.innerHTML = `<img src="${personalIcon}" />`;
  } else if (projectName === "Work") {
    iconContainer.innerHTML = `<img src="${workIcon}" />`;
  } else if (projectName === "Health") {
    iconContainer.innerHTML = `<img src="${healthIcon}" />`;
  } else if (projectName === "Learning") {
    iconContainer.innerHTML = `<img src="${learningIcon}" />`;
  }
}

function activateTaskContainer(activeElement) {
  const tasks = tasksContainer.querySelectorAll(".js-task");

  tasks.forEach((task) => {
    task.classList.remove("task-active");
  });
  activeElement.classList.add("task-active");
}

function toggleTaskSummary() {
  const tasks = tasksContainer.querySelectorAll(".js-task");

  tasks.forEach((task) => {
    task.addEventListener("click", (e) => {
      activateTaskContainer(task);
      renderTaskSummary(task);
      taskSummary.classList.add("right-sidebar-visible");

      const taskPriority = taskEssentials.querySelector(".js-prior");

      if (taskPriority.textContent === "low") {
        taskPriority.classList.add("low-priority");
      } else if (taskPriority.textContent === "medium") {
        taskPriority.classList.add("medium-priority");
      } else if (taskPriority.textContent === "high") {
        taskPriority.classList.add("high-priority");
      }

      applyEssentialsSVG();
      taskSummaryCloser.classList.add("close-right-sidebar-active");
    });
  });

  taskSummaryCloser.addEventListener("click", () => {
    taskSummary.classList.remove("right-sidebar-visible");
    taskSummaryCloser.classList.remove("close-right-sidebar-active");
  });
}

newTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openNewTaskDialogue();
  });
});

closeTaskModalBtn.addEventListener("click", () => {
  closeNewTaskDialogue();
});

let formMode = "add";
let editIndex = null;
function openNewTaskDialogue() {
  formMode = "add";
  editIndex = null;
  newTaskModal.reset();

  overlay.classList.add("overlay-active");
  newTaskModal.classList.add("new-task-modal-active");
}

function openEditDialogue(index) {
  formMode = "edit";
  editIndex = index;

  const todo = todos[index];
  document.getElementById("title").value = todo.title;
  document.getElementById("description").value = todo.description;
  document.getElementById("project").value = todo.project;
  document.getElementById("notes").value = todo.notes;
  document.getElementById("date").value = todo.dueDate;
  document.querySelector(
    `input[name="priority"][value="${todo.priority}"]`,
  ).checked = true;

  overlay.classList.add("overlay-active");
  newTaskModal.classList.add("new-task-modal-active");
}

newTaskModal.addEventListener("submit", (e) => {
  e.preventDefault();

  if (formMode === "add") {
    addNewTask();
  } else if (formMode === "edit") {
    saveEditedTask(editIndex);
  }
});

function getFormValues() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("date").value;
  const priority = document.querySelector(
    'input[name="priority"]:checked',
  )?.value;
  const notes = document.getElementById("notes").value;
  const project = document.getElementById("project").value;

  return { title, description, dueDate, priority, notes, project };
}

function validateFormValues({ title, description, dueDate }) {
  if (!title || !description || !dueDate) {
    alert("Nope");
    return false;
  }
  return true;
}

function saveEditedTask(index) {
  const values = getFormValues();
  if (!validateFormValues(values)) return;

  todos[index] = new Todo(values);

  saveToStorage();
  renderTasks();
  applyPriorityStyles();
  addProjectSVG();
  toggleTaskSummary();

  const updatedTask = tasksContainer.querySelector(`[data-index="${index}"]`);
  renderTaskSummary(updatedTask);
  applyEssentialsSVG();
  applySummaryStyles();
  closeNewTaskDialogue();
}

function closeNewTaskDialogue() {
  overlay.classList.remove("overlay-active");

  newTaskModal.classList.remove("new-task-modal-active");
}

function addNewTask() {
  const values = getFormValues();
  if (!validateFormValues(values)) return;

  todos.push(new Todo(values));

  saveToStorage();
  renderTasks();
  applyPriorityStyles();
  toggleTaskSummary();
  closeNewTaskDialogue();
}

function attachDeleteListener() {
  const deleteBtn = taskEssentials.querySelector(".delete-task");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", () => {
    const index = Number(deleteBtn.getAttribute("data-task-index"));
    todos.splice(index, 1);

    renderTasks();
    applyPriorityStyles();
    addProjectSVG();
    toggleTaskSummary();

    const nextIndex = index < todos.length ? index : todos.length - 1;
    const nextTask = tasksContainer.querySelector(
      `[data-index="${nextIndex}"]`,
    );

    if (nextTask) {
      renderTaskSummary(nextTask);
      applyEssentialsSVG();
      applySummaryStyles();
      attachDeleteListener();
    } else {
      taskEssentials.innerHTML = `<p>No tasks yet.</p>`;
    }
  });
}

function attachEditListeber() {
  const editBtn = taskEssentials.querySelector(".edit-task");
  if (!editBtn) return;

  editBtn.addEventListener("click", () => {
    const index = Number(editBtn.getAttribute("data-task-index"));
    openEditDialogue(index);
  });
}

const personalProjects = [];
const workProjects = [];
const healthProjects = [];
const learningProjects = [];
