#!/bin/bash

PORT=${1:-3000}

echo "🔍 Checking for processes on port $PORT..."

# Find process ID using the port
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
  echo "✅ Port $PORT is free"
  exit 0
fi

echo "⚠️  Found process $PID using port $PORT"
echo "🔪 Killing process..."

# Kill the process
kill -9 $PID 2>/dev/null

# Wait a moment for the port to be released
sleep 1

# Verify the port is free
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "❌ Failed to free port $PORT"
  exit 1
else
  echo "✅ Port $PORT is now free"
  exit 0
fi