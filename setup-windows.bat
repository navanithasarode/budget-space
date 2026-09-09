@echo off
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.
echo Done. Run frontend with: cd frontend ^&^& npm run dev
echo Backend needs MongoDB and backend\.env before running.
pause
