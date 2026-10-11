@echo off
REM Install Spine Resize Bridge native messaging host for Chrome (Windows)

set MANIFEST_DIR=%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts
set MANIFEST_FILE=%MANIFEST_DIR%\spinebridge.json
set HOST_PATH=%~dp0spinebridge.py

echo Installing Spine Resize Bridge native messaging host...

if not exist "%MANIFEST_DIR%" mkdir "%MANIFEST_DIR%"

echo ^{
echo   "name": "spinebridge",
echo   "description": "Spine Resize Bridge native messaging host",
echo   "path": "%HOST_PATH%",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://*"
echo   ]
echo ^} > "%MANIFEST_FILE%"

echo ✅ Native messaging host installed at: %MANIFEST_FILE%
echo ✅ Host executable: %HOST_PATH%
echo.
echo Now you need to:
echo 1. Install the Chrome extension from spine-resize-bridge.zip
echo 2. Go to chrome://extensions → Developer mode → Load unpacked
echo 3. Select the spine-bridge folder
echo 4. Restart Chrome
echo 5. Make sure Spine is running with a project open
pause
