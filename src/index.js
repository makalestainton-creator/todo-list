import "./styles.css";
import { todos } from "./todos.js";
import { toggleMenu } from "./dom.js";

toggleMenu();

class Todo  {
  constructor(obj) {
    this.title = obj.title;
    this.desciption = obj.description;
    this.dueDate = obj.dueDate;
    this.priority = obj.priority;
    this.notes = obj.notes;
    this.project = obj.project;
  }
};

const todo1 = new Todo({
  title: "Buy groceries",
  description: "Get weekly groceries from the supermarket",
  dueDate: "2026-03-30",
  priority: "low",
  notes: "Don't forget the milk and eggs",
  project: "Personal",
});

console.table(todo1);


const personalProjects = [];
const workProjects = [];
