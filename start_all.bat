@echo off
setlocal
title GRAM-DISHA Unified Launcher

echo ========================================================
echo GRAM-DISHA (Project ERGON) - Smart India Hackathon 2026
echo Starting Unified System
echo ========================================================
echo.

REM ========================================================
REM 1. Check project directory
REM ========================================================
cd /d "%~dp0"

REM ========================================================
REM 2. Verify Python
REM ========================================================
echo [1/5] Checking Python...
python --version
if errorlevel 1 (
    echo [ERROR] Python is not available in PATH.
    pause
    exit /b 1
)

REM ========================================================
REM 3. Seed database
REM ========================================================
echo.
echo [2/5] Checking and seeding database...

cd /d "%~dp0backend"
set PYTHONPATH=%~dp0backend
python seed_data.py

if errorlevel 1 (
    echo.
    echo [ERROR] Database seeding failed.
    pause
    exit /b 1
)

cd /d "%~dp0"

REM ========================================================
REM 4. Check whether FastAPI is already running
REM ========================================================
echo.
echo [3/5] Checking FastAPI port 8055...

netstat -ano | findstr ":8055" >nul

if errorlevel 1 (
    echo FastAPI is not running.
    echo Starting FastAPI Backend on http://127.0.0.1:8055...

    start "GRAM-DISHA FastAPI Backend" cmd /k "cd /d "%~dp0backend" && set PYTHONPATH=%~dp0backend && python -m uvicorn app.main:app --port 8055 --host 127.0.0.1"

    echo Waiting for FastAPI to initialize...
    timeout /t 4 /nobreak >nul
) else (
    echo FastAPI is already running on port 8055.
    echo Reusing existing FastAPI instance.
)

REM ========================================================
REM 5. Check Node.js and launch frontend
REM ========================================================
echo.
echo [4/5] Checking Node.js...

node --version
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not available.
    echo Please restart PowerShell/Windows and try again.
    pause
    exit /b 1
)

echo.
echo npm version:
npm.cmd --version

if not exist "node_modules\" (
    echo.
    echo [INFO] node_modules not found.
    echo Running npm install...
    call npm.cmd install

    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

REM ========================================================
REM 6. Start frontend
REM ========================================================
echo.
echo [5/5] Starting Frontend Gateway + Vite...
echo.
echo ========================================================
echo  GRAM-DISHA SYSTEM READY
echo ========================================================
echo.
echo  Frontend:     http://localhost:3000
echo  Swagger:      http://127.0.0.1:8055/docs
echo  Health:       http://127.0.0.1:8055/health
echo.
echo ========================================================
echo.

call npm.cmd run dev

endlocal