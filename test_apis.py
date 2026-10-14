import requests
import json

# Test the APIs
base_url = "http://localhost:5000"

def test_weather_api():
    print("Testing Weather API...")
    try:
        response = requests.get(f"{base_url}/weather?location=Mumbai, India")
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather API working!")
            print(f"Location: {data['weather']['location']}")
            print(f"Temperature: {data['weather']['temp']}°C")
            print(f"Condition: {data['weather']['condition']}")
        else:
            print(f"❌ Weather API failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Weather API error: {e}")

def test_weather_search_api():
    print("\nTesting Weather Search API...")
    try:
        response = requests.get(f"{base_url}/weather/search?q=Mumbai")
        if response.status_code == 200:
            data = response.json()
            print("✅ Weather Search API working!")
            print(f"Found {len(data['suggestions'])} suggestions")
        else:
            print(f"❌ Weather Search API failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Weather Search API error: {e}")

def test_image_detection_api():
    print("\nTesting Image Detection API...")
    try:
        # Test with a dummy file (this will fail but we can see if the endpoint exists)
        files = {'file': ('test.jpg', b'fake image data', 'image/jpeg')}
        response = requests.post(f"{base_url}/analyze", files=files)
        print(f"Image Detection API response: {response.status_code}")
        if response.status_code == 400:
            print("✅ Image Detection API endpoint exists (expected error for fake data)")
        else:
            print(f"Response: {response.text[:100]}...")
    except Exception as e:
        print(f"❌ Image Detection API error: {e}")

def test_static_files():
    print("\nTesting Static Files...")
    try:
        response = requests.get(f"{base_url}/index.html")
        if response.status_code == 200:
            print("✅ Static files serving working!")
        else:
            print(f"❌ Static files failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Static files error: {e}")

if __name__ == "__main__":
    print("🚀 Testing SMARTCROP APIs...")
    print("=" * 50)
    
    test_weather_api()
    test_weather_search_api()
    test_image_detection_api()
    test_static_files()
    
    print("\n" + "=" * 50)
    print("✅ API testing completed!")
