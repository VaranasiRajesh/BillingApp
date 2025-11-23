@echo off
echo === Installing Dependencies ===
echo.
npm install
echo.
echo === Installation Complete ===
echo.
echo Next steps:
echo 1. Optimize images (run: .\optimize-images.ps1)
echo 2. Build APK (run: eas build --platform android --profile production)
echo.
pause
