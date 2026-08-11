# Task 2 Portfolio

This folder contains the Task 2 version of the internship portfolio project.

## What is included

- `index.html` — home page with introduction, skills, featured projects, and learning summary.
- `about.html` — profile, education, strengths, and goals.
- `projects.html` — detailed project descriptions for Agrinex Weather and Army Convoys Pulse.
- `contact.html` — accessible contact form with validation and message flow.
- `thank-you.html` — submission confirmation page.
- `styles.css` — mobile-first responsive styling with CSS Grid/Flex, card layouts, and dark/light theme variables.
- `scripts/theme-toggle.js` — theme toggle that persists the user's preference using `localStorage`.
- `scripts/preview.ps1` — PowerShell helper script to run a local preview server and open the browser.
- `README_PREVIEW.md` — local preview instructions for Python and PowerShell.

## Highlights

- Mobile-first responsive design with layout adjustments at `720px` and `900px`.
- Modern CSS styling using custom properties and subtle transitions.
- Dark mode support with a theme toggle button.
- Improved accessibility and focus styling.

## Preview locally

Open PowerShell in this folder and run:

```powershell
.\scripts\preview.ps1
```

Or use Python directly:

```powershell
python -m http.server 8000
start http://localhost:8000
```
