<#
Simple preview helper for Windows PowerShell.
It will open a new PowerShell window that runs a Python HTTP server on port 8000 (if Python is available)
and then open the default browser at http://localhost:8000.
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectRoot.Path

function Start-ServerWithPython($pythonCmd){
    $serverCommand = "$pythonCmd -m http.server 8000"
    Start-Process powershell -ArgumentList "-NoExit","-Command","$serverCommand"
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:8000"
}

if (Get-Command python -ErrorAction SilentlyContinue){
    Start-ServerWithPython "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue){
    Start-ServerWithPython "py"
} else {
    Write-Host "Python not found. Install Python 3 or run: npm install -g http-server; http-server -p 8000"
}
