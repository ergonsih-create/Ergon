#!/usr/bin/env bash
echo "========================================================"
echo "GRAM-DISHA (Project ERGON) — Smart India Hackathon 2026"
echo "Starting Unified System: FastAPI Backend + Express Gateway"
echo "========================================================"
echo ""

# 1. Verify / Seed Database
echo "[1/3] Checking and seeding database..."
cd backend && python3 seed_data.py && cd ..

# 2. Launch FastAPI in background
echo "[2/3] Launching FastAPI Backend on http://127.0.0.1:8055..."
cd backend && python3 -m uvicorn app.main:app --port 8055 --host 127.0.0.1 &
FASTAPI_PID=$!
cd ..

# 3. Wait for FastAPI to initialize
sleep 3

# 4. Verify Frontend Dependencies
echo "[3/3] Checking Node.js environment..."
if ! command -v npm &> /dev/null; then
    echo ""
    echo "[WARNING] Node.js/npm is not detected in your PATH."
    echo "Backend is already running at: http://127.0.0.1:8055/docs"
    echo "To start the frontend, please install Node.js (LTS), then run:"
    echo "  npm install && npm run dev"
    echo ""
    wait $FASTAPI_PID
    exit 0
fi

if [ ! -d "node_modules" ]; then
    echo "[INFO] node_modules not found. Running npm install..."
    npm install
fi

# 5. Launch Express Gateway & Vite Frontend
echo "Launching Frontend Gateway on http://localhost:3000..."
echo ""
echo "========================================================"
echo " App URL:     http://localhost:3000"
echo " Swagger Docs: http://127.0.0.1:8055/docs"
echo " Health:       http://127.0.0.1:8055/health"
echo "========================================================"
echo ""

trap "kill $FASTAPI_PID" EXIT
npm run dev
