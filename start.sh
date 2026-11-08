#!/usr/bin/env bash

# CosmicArchive - Unified Launcher
# Starts both FastAPI Backend (port 8001) and Next.js Frontend (port 3000)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo ""
echo -e "\033[1;36m===================================================================\033[0m"
echo -e "\033[1;36m       🛸 COSMICARCHIVE // UNIFIED RUNNER (FastAPI + Next.js)       \033[0m"
echo -e "\033[1;36m===================================================================\033[0m"
echo -e "\033[0;32m   [✓] Web Dashboard:       \033[1;32mhttp://localhost:3000\033[0m"
echo -e "\033[0;34m   [✓] API Gateway:         \033[1;34mhttp://localhost:8001/docs\033[0m"
echo -e "\033[0;33m   [!] Presiona Ctrl+C para detener ambos servicios simultáneamente.\033[0m"
echo -e "\033[1;36m===================================================================\033[0m"
echo ""

# Function to cleanly terminate background jobs on exit
cleanup() {
    echo ""
    echo -e "\033[0;31m[CosmicArchive] Apagando servidores...\033[0m"
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend
(
    cd "$ROOT_DIR/backend"
    export PYTHONPATH=.
    ./venv/bin/python run.py
) &
BACKEND_PID=$!

# Wait 1 second for backend socket to initialize
sleep 1

# 2. Start Frontend
(
    cd "$ROOT_DIR/frontend"
    npm run dev
) &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
