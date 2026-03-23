@echo off
echo Starting TempChat Development Suite...

:: Start Backend
echo Starting Backend Server...
start "TempChat Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
echo Starting Frontend Client...
start "TempChat Frontend" cmd /k "cd frontend && npm run dev"

echo Done! Both servers are starting in separate windows.
pause
