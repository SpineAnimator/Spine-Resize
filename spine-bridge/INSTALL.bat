@echo off
setlocal
cd /d "%~dp0"
if not exist "%~dp0SpineMaskInstaller.exe" (
  echo SpineMaskInstaller.exe is missing from this package.
  pause
  exit /b 1
)
start "" "%~dp0SpineMaskInstaller.exe"
