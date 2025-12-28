#!/bin/bash

# Check if .env exists in server
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env from example..."
    cp server/.env.example server/.env
    echo "⚠️  Please update server/.env with your OpenAI API Key!"
fi

# Install dependencies if not present (simple check)
if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install --legacy-peer-deps && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "Starting Backend..."
cd server && npm run dev &
SERVER_PID=$!

echo "Starting Frontend..."
cd client && npm run dev &
CLIENT_PID=$!

trap "kill $SERVER_PID $CLIENT_PID" EXIT

wait
