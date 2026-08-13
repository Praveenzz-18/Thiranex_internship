# Task 3 — To‑Do App (Task 3 deliverable)

This folder now contains the Task 3 To‑Do application implemented as an interactive, client‑side web app that demonstrates DOM manipulation, event handling, state management, and data persistence.

Open the To‑Do app in your browser:

- `todo.html` — full To‑Do application UI and interaction.

Other important files:

- `scripts/todo.js` — application logic: full CRUD (Create, Read, Update, Delete), localStorage persistence, filtering (All / Active / Completed), inline editing, import/export, and drag‑and‑drop reordering.
- `styles.css` — styles and UI polish for the To‑Do page (animations, responsive layout, accessible focus states).
- `scripts/theme-toggle.js` — theme toggle that persists the user's preference using `localStorage`.
- `scripts/preview.ps1` — PowerShell helper script to run a local preview server and open the browser.

Key features implemented (Task 3 requirements):

- Full CRUD: add, list, edit (inline), toggle complete, delete tasks.
- Persistence: tasks are saved to `localStorage` under key `todo.tasks.v1` and retained across reloads.
- Filtering: All, Active, Completed with accessible `aria-pressed` states.
- Dynamic DOM and delegated event handlers used for performance and simplicity.
- Advanced UX: optional due dates, overdue highlighting, empty‑state messaging, entry animations.
- Import/Export: download and upload tasks as JSON (`tasks.json`).
- Reordering: drag‑and‑drop to reorder tasks; order is persisted.
- Accessibility: focus styles, keyboard editing (Enter to save), and ARIA attributes where appropriate.

How to preview locally

PowerShell:

```powershell
.\scripts\preview.ps1
```

Or with Python:

```powershell
python -m http.server 8000
start http://localhost:8000/todo.html
```

Usage notes

- Add a new task using the input at the top; optionally choose a due date before submitting.
- Double‑click a task label to edit inline, press Enter or click away to save.
- Use the filter buttons to switch views and the "Clear completed" button to remove completed tasks.
- Use "Export" to download your tasks and "Import" to load tasks from a previously exported JSON file.
- Drag tasks to reorder them; the order is saved automatically.

If you'd like additional features (priority, reminders, keyboard shortcuts, or integration with a backend), tell me which one to add next.
