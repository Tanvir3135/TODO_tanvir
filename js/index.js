import Task from './classes/Task.js';
import Todos from './classes/Todos.js';

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const backendUrl = 'http://localhost:3001';
const todos = new Todos(backendUrl);
taskInput.disabled = true;

taskInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    const taskText = taskInput.value.trim();
    if (taskText) {
      const response = await saveTask(taskText);
      if (response.ok) {
        const task = await response.json();
        renderTask(task);
        taskInput.value = '';
      } else {
        console.error('Failed to save task');
      }
    }
  }
});

taskList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('bi-trash')) {
    const listItem = event.target.closest('li');
    const id = listItem.getAttribute('data-key');
    const deletedId = await todos.removeTask(id);
    if (deletedId) {
      listItem.remove();
    }
  }
});

async function getTasks() {
  const tasks = await todos.getTasks();
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task));
  taskInput.disabled = false;
}

function renderTask(task) {
  const listItem = document.createElement('li');
  listItem.classList.add('list-group-item');
  listItem.setAttribute('data-key', task.getId());
  renderSpan(listItem, task.getText());
  renderLink(listItem, task.getId());
  taskList.appendChild(listItem);
}

function saveTask(description) {
  return fetch(`${backendUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
}

function renderSpan(listItem, text) {
  const span = document.createElement('span');
  span.textContent = text;
  listItem.appendChild(span);
}

function renderLink(listItem, id) {
  const link = document.createElement('a');
  link.href = '#';
  link.classList.add('float-right');
  const icon = document.createElement('i');
  icon.classList.add('bi', 'bi-trash');
  link.appendChild(icon);
  listItem.appendChild(link);
}

getTasks();