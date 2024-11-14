import subprocess
import os
import sys
import webbrowser
from time import sleep

def is_windows():
    return sys.platform.startswith('win')

def run_frontend():
    os.chdir('frontend')
    if is_windows():
        return subprocess.Popen('npm start', shell=True)
    return subprocess.Popen(['npm', 'start'])

def run_backend():
    os.chdir('backend')
    if is_windows():
        return subprocess.Popen('python -m uvicorn app:app --reload --port 8000', shell=True)
    return subprocess.Popen(['uvicorn', 'app:app', '--reload', '--port', '8000'])

def main():
    # Store the root directory
    root_dir = os.getcwd()
    
    print("Starting Face Recognition Attendance System...")
    print("\n1. Starting Backend Server...")
    
    # Start backend
    backend_process = run_backend()
    
    # Return to root directory
    os.chdir(root_dir)
    
    print("2. Starting Frontend Server...")
    # Start frontend
    frontend_process = run_frontend()
    
    print("\nStarting browsers...")
    # Wait a bit for servers to start
    sleep(5)
    
    # Open browser windows
    try:
        webbrowser.open('http://localhost:3000')  # Frontend
        webbrowser.open('http://localhost:8000/docs')  # Backend docs
    except Exception as e:
        print(f"Failed to open browser: {e}")
    
    print("\n✨ Face Recognition Attendance System is running!")
    print("\n📱 Frontend: http://localhost:3000")
    print("🔧 Backend: http://localhost:8000")
    print("\nPress Ctrl+C to stop all servers...")
    
    try:
        # Keep the script running
        while True:
            sleep(1)
    except KeyboardInterrupt:
        print("\n\nShutting down servers...")
        # Kill processes
        if is_windows():
            subprocess.run('taskkill /F /T /PID {}'.format(frontend_process.pid), shell=True)
            subprocess.run('taskkill /F /T /PID {}'.format(backend_process.pid), shell=True)
        else:
            frontend_process.terminate()
            backend_process.terminate()
        print("Servers stopped successfully!")

if __name__ == "__main__":
    main() 