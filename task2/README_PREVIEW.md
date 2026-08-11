Local preview instructions

Quick preview using Python (recommended if Python 3 is installed):

1. Open PowerShell and change to the project folder containing the site files (example path shown):

```powershell
cd d:/Projects/Thirnex_internship/thiranex_task1_portfolio/thiranex_task1_portfolio
```

2. Start a simple HTTP server on port 8000:

```powershell
python -m http.server 8000
# or if your system uses the py launcher:
py -m http.server 8000
```

3. Open the site in your browser:

```powershell
start http://localhost:8000
```

Alternative: use the included PowerShell helper script `scripts/preview.ps1` which will try to open a new terminal running the server and launch your browser.

Run the helper script:

```powershell
cd d:/Projects/Thirnex_internship/thiranex_task1_portfolio/thiranex_task1_portfolio
.\scripts\preview.ps1
```

Node/npm option (if you prefer):

```powershell
npm install -g http-server
http-server -p 8000
```

Stop the server by closing the terminal window or pressing Ctrl+C in the terminal where the server is running.
