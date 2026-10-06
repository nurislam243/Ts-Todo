interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const list = document.querySelector<HTMLUListElement>("#list");

const form = document.querySelector<HTMLFormElement>("#new-task-form");

const input = document.querySelector<HTMLInputElement>("#new-task-title");

// Load Tasks

let tasks: Task[] = loadTasks();

// Load From LocalStorage

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem("tasks");

  if (!savedTasks) {
    return [];
  }

  return JSON.parse(savedTasks);
}

// Save Tasks

function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = input?.value.trim();

  if (!title) return;

  const task: Task = {
    id: crypto.randomUUID(),

    title: title,

    completed: false,

    createdAt: new Date(),
  };

  tasks.push(task);

  saveTasks();

  addListItem(task);

  input.value = "";
});

// Add Task To DOM

function addListItem(task: Task): void {
  if (!list) return;

  const li = document.createElement("li");

  li.className = "task-item";

  li.dataset.id = task.id;

  // Task Title

  const span = document.createElement("span");

  span.className = "task-title";

  span.textContent = task.title;

  if (task.completed) {
    span.classList.add("completed");
  }

  // Complete / Uncomplete

  span.addEventListener("click", () => {
    task.completed = !task.completed;

    span.classList.toggle("completed", task.completed);

    saveTasks();
  });

  // Delete Button

  const deleteButton = document.createElement("button");

  deleteButton.textContent = "Delete";

  deleteButton.className = "delete-btn";

  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  li.appendChild(span);

  li.appendChild(deleteButton);

  list.appendChild(li);
}

// Delete Task

function deleteTask(id: string): void {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();

  const taskElement = document.querySelector(`[data-id="${id}"]`);

  taskElement?.remove();
}

// Render Saved Tasks

function renderTasks(): void {
  tasks.forEach((task) => {
    addListItem(task);
  });
}

// Initial Render

renderTasks();
