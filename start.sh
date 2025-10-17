#!/bin/bash

# E-Learning Site Builder - Quick Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting E-Learning Site Builder..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node -v)"
echo ""

# Start backend
echo "Starting backend server..."
cd backend
npm install > /dev/null 2>&1
npm start &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm install > /dev/null 2>&1
REACT_APP_API_URL=http://localhost:5000 npm start &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 All services are running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📖 Docs:     Check GETTING_STARTED.md"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
