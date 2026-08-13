const STORAGE_KEY = 'todo.tasks.v1';

let tasks = [];
let filter = 'all';

const form = document.getElementById('new-task-form');
const input = document.getElementById('new-task-input');
const newDue = document.getElementById('new-task-due');
const list = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-completed');
const countEl = document.getElementById('task-count');
const exportBtn = document.getElementById('export-tasks');
const importBtn = document.getElementById('import-tasks');
const importFile = document.getElementById('import-file');

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch (e) { return dateStr }
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
}

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('role', 'listitem');
    li.dataset.id = task.id;
    li.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-toggle';
    checkbox.checked = task.completed;
    checkbox.dataset.action = 'toggle';

    const label = document.createElement('span');
    label.className = 'task-label';
    label.textContent = task.text;
    label.tabIndex = 0;
    label.setAttribute('role', 'textbox');
    label.dataset.action = 'edit';
    if (task.completed) label.classList.add('completed');

    const del = document.createElement('button');
    del.className = 'task-delete btn';
    del.textContent = 'Delete';
    del.dataset.action = 'delete';

    // meta area (due date / chips)
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    if (task.due) {
        const dueChip = document.createElement('span');
        dueChip.className = 'due-chip';
        dueChip.textContent = formatDate(task.due);
        if (isOverdue(task.due) && !task.completed) dueChip.classList.add('priority-high');
        meta.appendChild(dueChip);
    }

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(meta);
    li.appendChild(del);
    // play entry animation
    li.classList.add('enter');
    li.addEventListener('animationend', () => li.classList.remove('enter'), { once: true });

    // Drag events
    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        // after drag ends, persist order from DOM
        persistOrderFromDOM();
    });
    return li;
}

function render() {
    list.innerHTML = '';
    const visible = tasks.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });
    if (visible.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty-state';
        empty.textContent = tasks.length === 0 ? 'No tasks yet — add your first task!' : 'No tasks in this view.';
        list.appendChild(empty);
    } else {
        visible.forEach(t => list.appendChild(createTaskElement(t)));
    }
    updateCount();
}

function updateCount() {
    const remaining = tasks.filter(t => !t.completed).length;
    countEl.textContent = `${remaining} task(s) remaining`;
}

function addTask(text) {
    const due = newDue && newDue.value ? newDue.value : null;
    const task = { id: String(Date.now()) + Math.random().toString(36).slice(2), text: text.trim(), completed: false, due };
    if (!task.text) return;
    tasks.unshift(task);
    saveTasks();
    render();
}

function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    saveTasks();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(x => x.id !== id);
    saveTasks();
    render();
}

function editTask(id, newText) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.text = newText.trim() || t.text;
    saveTasks();
    render();
}

// Event handlers
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    addTask(text);
    input.value = '';
    if (newDue) newDue.value = '';
    input.focus();
});

// Delegate clicks in the list
list.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (action === 'toggle') {
        toggleTask(id);
    } else if (action === 'delete') {
        deleteTask(id);
    }
});

// Double click to edit (inline)
list.addEventListener('dblclick', (e) => {
    const el = e.target.closest('.task-label');
    if (!el) return;
    const li = el.closest('li');
    const id = li.dataset.id;

    el.contentEditable = 'true';
    el.focus();

    // place cursor at end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
});

// Save edits on blur or Enter
list.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('task-label')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    }
});

list.addEventListener('focusout', (e) => {
    if (e.target.classList && e.target.classList.contains('task-label')) {
        const li = e.target.closest('li');
        const id = li.dataset.id;
        const newText = e.target.textContent;
        e.target.contentEditable = 'false';
        editTask(id, newText);
    }
}, true);

// Filters
document.querySelector('.filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filter = btn.dataset.filter;
    filters.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    render();
});

clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
});

// Persist order helper
function persistOrderFromDOM() {
    const ids = [...list.querySelectorAll('.task-item')].map(li => li.dataset.id);
    tasks = ids.map(id => tasks.find(t => t.id === id)).filter(Boolean);
    saveTasks();
}

// Drag over to reorder
list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (!dragging) return;
    const after = getDragAfterElement(list, e.clientY);
    if (after == null) {
        list.appendChild(dragging);
    } else {
        list.insertBefore(dragging, after);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

// Export / Import
exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const txt = await file.text();
        const data = JSON.parse(txt);
        if (!Array.isArray(data)) throw new Error('Invalid file');
        // normalize imported tasks
        tasks = data.map(d => ({ id: d.id || String(Date.now()) + Math.random().toString(36).slice(2), text: d.text || '', completed: !!d.completed, due: d.due || null }));
        saveTasks();
        render();
    } catch (err) {
        alert('Failed to import tasks: ' + err.message);
    } finally {
        importFile.value = '';
    }
});

// Init
loadTasks();
render();
