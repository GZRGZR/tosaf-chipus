@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or not in PATH.
  echo Install Git or use GitHub Desktop once, then run this file again.
  pause
  exit /b 1
)

echo Updating Tosaf Chipus from GitHub...
git pull --ff-only origin main
if errorlevel 1 (
  echo.
  echo Update failed. Check the message above.
  pause
  exit /b 1
)

echo.
echo Update completed.
echo Now open chrome://extensions and click "Reload" for the extension.
pause
