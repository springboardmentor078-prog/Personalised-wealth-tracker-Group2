"""
Simple test to verify the backend can run
Run this with: python test_minimal.py
"""

print("=" * 50)
print("Backend Environment Test")
print("=" * 50)
print()

# Test 1: Python version
import sys
print(f"✓ Python version: {sys.version}")
print()

# Test 2: Check required packages
required_packages = [
    'fastapi',
    'uvicorn',
    'pydantic',
    'pydantic_settings'
]

print("Checking required packages:")
for package in required_packages:
    try:
        module = __import__(package)
        version = getattr(module, '__version__', 'unknown')
        print(f"  ✓ {package}: {version}")
    except ImportError:
        print(f"  ✗ {package}: NOT INSTALLED")
print()

# Test 3: Try to import the app
print("Testing app import:")
try:
    import os
    os.environ['SECRET_KEY'] = 'test-key-for-import-test'
    os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
    
    from app.main import app
    print("  ✓ App imported successfully!")
    print()
    
    # Test 4: List available routes
    print("Available routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"  • {route.path}")
    print()
    
    print("=" * 50)
    print("✓ ALL TESTS PASSED!")
    print("=" * 50)
    print()
    print("To start the server, run:")
    print("  uvicorn app.main:app --reload")
    print()
    print("Or use the startup script:")
    print("  Windows: start-windows.bat")
    print("  Mac/Linux: ./start-mac-linux.sh")
    
except Exception as e:
    print(f"  ✗ Error importing app: {e}")
    print()
    print("Troubleshooting steps:")
    print("1. Make sure you're in the backend directory")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Create .env file: cp .env.example .env")
    print("4. Check STARTUP_GUIDE.md for detailed help")
