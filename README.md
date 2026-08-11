# Thiranex Virtual Internship — Task 1

## HTML5 Semantic Structure and Accessibility

This project is a multi-page personal portfolio created using semantic HTML5
and accessibility-focused development practices.

## Pages

- `index.html` — Home page
- `about.html` — Profile, education, and career goal
- `projects.html` — Project information
- `contact.html` — Accessible, keyboard-navigable contact form
- `thank-you.html` — Form submission demonstration page

## Task Requirements Covered

- Semantic HTML5 elements:
  - `header`
  - `nav`
  - `main`
  - `section`
  - `article`
  - `aside`
  - `footer`
  - `address`
- Logical heading hierarchy
- Skip-to-content link
- Descriptive page titles and SEO meta descriptions
- `lang` attribute on every page
- Accessible navigation using `aria-label`
- Active page identification with `aria-current`
- Accessible form labels
- `fieldset` and `legend`
- Required-field instructions
- Helpful `aria-describedby` text
- Keyboard-accessible native HTML controls
- Safe external links using `rel="noopener noreferrer"`
- Descriptive link text
- Responsive viewport meta tag

## Task 2 Update

The `task2/` folder now contains the Task 2 portfolio implementation, including:

- Responsive CSS with CSS Grid/Flex layout and mobile-first design.
- Dark/light theme support with a persistent toggle.
- Updated page visuals, accessible headings, and improved spacing.
- A PowerShell preview helper at `task2/scripts/preview.ps1`.
- `task2/README.md` with project summary and preview instructions.

## Run in VS Code

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Open `index.html`.
4. Right-click the file and select **Open with Live Server**.
5. Use the navigation links to test all pages.
6. Press the `Tab` key repeatedly to test keyboard navigation.

## Personalize Before Submission

Use VS Code search and replace (`Ctrl + Shift + H`) to update:

- `Bruce`
- `YOUR-EMAIL@example.com`
- `YOUR-USERNAME`
- `YOUR-LINKEDIN`
- Institution, skills, and project details if required

## Accessibility Testing

In Google Chrome:

1. Open the project with Live Server.
2. Press `F12`.
3. Open the **Lighthouse** tab.
4. Select:
   - Accessibility
   - SEO
   - Best Practices
5. Choose Desktop or Mobile.
6. Click **Analyze page load**.
7. Correct any issue reported before submission.

Also test:

- Every page opens correctly.
- Every link works.
- The complete website can be navigated using only the keyboard.
- Each form field has a visible label.
- Required form fields prevent empty submission.
- Browser zoom at 200% does not hide content.

## Suggested GitHub Repository Name

`thiranex-task-1-semantic-portfolio`

## GitHub Submission Steps

1. Create a new public GitHub repository.
2. Upload all project files.
3. Open repository **Settings**.
4. Select **Pages**.
5. Under deployment source, choose the `main` branch and `/root`.
6. Save and wait for the live URL.
7. Submit the GitHub repository URL or GitHub Pages URL in the portal.

## Suggested Commit Message

```text
Complete Thiranex Task 1 semantic accessible portfolio
```

## Declaration

This portfolio was created as part of the Thiranex Virtual Internship Task 1.
