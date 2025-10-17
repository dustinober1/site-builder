#!/bin/bash

# E-Learning Site Builder - Installation & Setup Guide
# This script helps verify dependencies and set up the project

echo "========================================"
echo "E-Learning Site Builder - Setup Helper"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking dependencies..."
echo ""

if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js found: $VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    echo "  Install from: https://nodejs.org/ (version 16 or higher)"
    exit 1
fi

if command -v npm &> /dev/null; then
    VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm found: $VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

echo ""
echo "========================================"
echo "Setup Options"
echo "========================================"
echo ""
echo "1) Install dependencies only"
echo "2) Install dependencies and start servers"
echo "3) Start existing servers"
echo "4) Clean and reset"
echo ""

read -p "Select option (1-4): " option

case $option in
    1)
        echo ""
        echo "Installing backend dependencies..."
        cd backend
        npm install
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Backend installed"
        else
            echo -e "${RED}✗${NC} Backend installation failed"
            exit 1
        fi
        
        cd ../frontend
        echo "Installing frontend dependencies..."
        npm install
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Frontend installed"
            echo ""
            echo -e "${GREEN}Setup Complete!${NC}"
            echo ""
            echo "Next steps:"
            echo "1. cd backend && npm start"
            echo "2. In another terminal: cd frontend && npm start"
        else
            echo -e "${RED}✗${NC} Frontend installation failed"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo "Installing and starting servers..."
        
        echo "Installing backend..."
        cd backend
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}✗${NC} Backend installation failed"
            exit 1
        fi
        
        cd ../frontend
        echo "Installing frontend..."
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}✗${NC} Frontend installation failed"
            exit 1
        fi
        
        cd ..
        echo ""
        echo -e "${GREEN}✓${NC} Both installed successfully"
        echo ""
        echo "Starting servers..."
        echo "This will open in 2 separate terminal sessions"
        echo ""
        
        # Try to open in separate terminals
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $(pwd)/backend && npm start; exec bash"
            sleep 2
            gnome-terminal -- bash -c "cd $(pwd)/frontend && REACT_APP_API_URL=http://localhost:5000 npm start; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $(pwd)/backend && npm start" &
            sleep 2
            xterm -e "cd $(pwd)/frontend && REACT_APP_API_URL=http://localhost:5000 npm start" &
        else
            echo -e "${YELLOW}⚠${NC} Cannot auto-open terminals on this system"
            echo ""
            echo "Start manually in separate terminals:"
            echo ""
            echo "Terminal 1:"
            echo "  cd backend && npm start"
            echo ""
            echo "Terminal 2:"
            echo "  cd frontend && REACT_APP_API_URL=http://localhost:5000 npm start"
        fi
        
        echo ""
        echo -e "${GREEN}✓${NC} Setup complete!"
        echo ""
        echo "Access at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:5000"
        ;;
    
    3)
        echo ""
        echo "Starting existing servers..."
        echo "This requires 2 separate terminal sessions"
        echo ""
        echo "Terminal 1:"
        echo "  cd backend && npm start"
        echo ""
        echo "Terminal 2:"
        echo "  cd frontend && REACT_APP_API_URL=http://localhost:5000 npm start"
        ;;
    
    4)
        echo ""
        echo "This will delete node_modules and reinstall everything"
        read -p "Continue? (y/N): " confirm
        if [[ $confirm == "y" || $confirm == "Y" ]]; then
            echo "Cleaning backend..."
            cd backend
            rm -rf node_modules
            npm install
            
            cd ../frontend
            echo "Cleaning frontend..."
            rm -rf node_modules
            npm install
            
            echo -e "${GREEN}✓${NC} Reset complete"
        fi
        ;;
    
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "For detailed information, see:"
echo "  - README.md (main documentation)"
echo "  - GETTING_STARTED.md (5-minute tutorial)"
echo "  - ACCESSIBILITY.md (508 compliance details)"
echo ""
