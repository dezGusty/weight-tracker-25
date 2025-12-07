#!/bin/bash
set -e

# 1. Variables
SERVICE_NAME="weight-tracker"
APP_DIR="/opt/weight-tracker"
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$REPO_DIR/wt_backend_api"
FRONTEND_DIR="$REPO_DIR/wt_frontend"

# Verify directories exist
if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: wt_backend_api or wt_frontend directory not found in $REPO_DIR"
    echo "Please run this script from within the repository."
    exit 1
fi

# 3. Build Frontend
echo "Building Frontend..."
cd $FRONTEND_DIR
npm install
npm run build -- --configuration production

# 4. Prepare Backend wwwroot
# Copy Angular build output to Backend's wwwroot
# Note: Angular 17+ usually builds to dist/frontend/browser
echo "Copying Frontend to Backend..."
if [ -d "$BACKEND_DIR/wwwroot" ]; then
    rm -rf $BACKEND_DIR/wwwroot
fi
mkdir -p $BACKEND_DIR/wwwroot
cp -r $FRONTEND_DIR/dist/frontend/browser/* $BACKEND_DIR/wwwroot/

# 5. Publish Backend
echo "Publishing Backend..."
# Stop service before overwriting files
sudo systemctl stop $SERVICE_NAME || true

sudo mkdir -p $APP_DIR
sudo dotnet publish $BACKEND_DIR/WeightTrackerAPI.csproj -c Release -o $APP_DIR

# Also check that a db file for sqlite exists (weighttracker.db), if not create an empty DB for the service to use.
if [ ! -f "$APP_DIR/weighttracker.db" ]; then
    echo "Creating empty SQLite database file..."
		touch $APP_DIR/weighttracker.db
		# Also set the write permissions for the file
    chmod 666 $APP_DIR/weighttracker.db
    sqlite3 $APP_DIR/weighttracker.db "VACUUM;"
fi

# 6. Restart Service
echo "Restarting Service..."
sudo systemctl start $SERVICE_NAME
sudo systemctl status $SERVICE_NAME --no-pager