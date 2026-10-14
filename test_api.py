#!/usr/bin/env python3
"""
SMARTCROP API Test Script
Tests all API endpoints to ensure they're working correctly.
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check - Status: {data['status']}")
            print(f"   Service: {data['service']}")
            print(f"   APIs: {data['apis']}")
            return True
        else:
            print(f"❌ Health Check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check error: {e}")
        return False

def test_weather():
    """Test weather endpoint"""
    print("\n🌤️  Testing Weather API...")
    try:
        response = requests.get(f"{BASE_URL}/weather?location=Delhi,India")
        if response.status_code == 200:
            data = response.json()
            weather = data['weather']
            print(f"✅ Weather API - Location: {weather['location']}")
            print(f"   Temperature: {weather['temp']}°C")
            print(f"   Condition: {weather['condition']}")
            print(f"   Humidity: {weather['humidity']}%")
            print(f"   Wind Speed: {weather['windSpeed']} km/h")
            
            # Show agricultural recommendations
            if 'agricultural' in data:
                agricultural = data['agricultural']
                print(f"\n🌱 Agricultural Recommendations:")
                print(f"   Irrigation: {agricultural['recommendations']['irrigation']['advice']}")
                print(f"   Planting: {agricultural['recommendations']['planting']['advice']}")
                print(f"   Pest Management: {agricultural['recommendations']['pest_management']['advice']}")
                print(f"   Harvesting: {agricultural['recommendations']['harvesting']['advice']}")
            
            return True
        else:
            print(f"❌ Weather API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Weather API error: {e}")
        return False

def test_weather_search():
    """Test weather location search"""
    print("\n🔍 Testing Weather Search...")
    try:
        response = requests.get(f"{BASE_URL}/weather/search?q=Delhi")
        if response.status_code == 200:
            data = response.json()
            suggestions = data['suggestions']
            print(f"✅ Weather Search - Found {len(suggestions)} suggestions:")
            for suggestion in suggestions[:3]:  # Show first 3
                print(f"   - {suggestion['name']}")
            return True
        else:
            print(f"❌ Weather Search failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Weather Search error: {e}")
        return False

def test_agricultural_weather():
    """Test agricultural weather endpoint"""
    print("\n🌾 Testing Agricultural Weather...")
    try:
        response = requests.get(f"{BASE_URL}/weather/agricultural?location=Delhi,India")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Agricultural Weather API")
            print(f"   Current Temperature: {data['current_conditions']['temperature']}°C")
            print(f"   Current Humidity: {data['current_conditions']['humidity']}%")
            print(f"   Forecast Avg Temp: {data['forecast_summary']['avg_temperature']}°C")
            print(f"   Total Rainfall: {data['forecast_summary']['total_rainfall']}mm")
            
            # Show suitable crops
            crops = data['suitable_crops']
            if crops:
                print(f"\n🌱 Suitable Crops:")
                for crop in crops[:2]:  # Show first 2
                    print(f"   - {crop['crop']}: {crop['suitability']} ({crop['reason']})")
            
            # Show weather alerts
            alerts = data['weather_alerts']
            if alerts:
                print(f"\n🚨 Weather Alerts:")
                for alert in alerts:
                    print(f"   - {alert['icon']} {alert['message']}")
            
            return True
        else:
            print(f"❌ Agricultural Weather failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Agricultural Weather error: {e}")
        return False

def test_ai_chat():
    """Test AI chat endpoint"""
    print("\n🤖 Testing AI Chat...")
    try:
        payload = {"message": "What are the best crops to grow in winter?"}
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        if response.status_code == 200:
            data = response.json()
            reply = data['reply']
            print(f"✅ AI Chat - Response received ({len(reply)} characters)")
            print(f"   Preview: {reply[:100]}...")
            return True
        else:
            print(f"❌ AI Chat failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ AI Chat error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🌤️  SMARTCROP API Test Suite")
    print("=" * 50)
    
    tests = [
        test_health,
        test_weather,
        test_weather_search,
        test_agricultural_weather,
        test_ai_chat
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your SMARTCROP API is working perfectly!")
        print("\n🚀 Your API is ready to use with the frontend!")
        print("📍 Available endpoints:")
        print("   - GET  /weather?location=Delhi,India")
        print("   - GET  /weather/search?q=Delhi")
        print("   - GET  /weather/agricultural?location=Delhi,India")
        print("   - POST /chat (AI Assistant)")
        print("   - POST /analyze (Image Disease Detection)")
        print("   - GET  /health")
    else:
        print("⚠️  Some tests failed. Please check your API configuration.")

if __name__ == '__main__':
    main()

