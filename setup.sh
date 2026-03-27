#!/bin/bash

echo "Installing system dependencies for Devil OSINT..."

# Detect OS
if [ -f /etc/debian_version ]; then
    # Kali/Ubuntu
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip git clang
elif [ -d /data/data/com.termux ]; then
    # Termux
    pkg update
    pkg install -y python git clang
else
    echo "Unknown OS. Please install python3 and pip manually."
fi

echo "Installing Python libraries..."
pip3 install holehe socialscan instaloader colorama

echo "Setup complete. Run 'python3 devil.py' to start."
