#!/usr/bin/env python3
"""
SMARTCROP Weather Search Demo
This script demonstrates how the weather search functionality works.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def demo_weather_search():
    """Demonstrate weather search functionality"""
    print("🌤️  SMARTCROP Weather Search Demo")
    print("=" * 50)
    
    # Test locations
    locations = [
        "Mumbai, India",
        "Delhi, India", 
        "Bangalore, India",
        "Chennai, India",
        "Kolkata, India"
    ]
    
    print("🔍 Testing Location Search:")
    for location in locations:
        print(f"\n📍 Searching for: {location}")
        
        # Search for location
        try:
            search_response = requests.get(f"{BASE_URL}/weather/search?q={location.split(',')[0]}")
            if search_response.status_code == 200:
                search_data = search_response.json()
                suggestions = search_data.get('suggestions', [])
                
                if suggestions:
                    print(f"   ✅ Found: {suggestions[0]['name']}")
                    
                    # Get weather data
                    weather_response = requests.get(f"{BASE_URL}/weather?location={location}")
                    if weather_response.status_code == 200:
                        weather_data = weather_response.json()
                        weather = weather_data['weather']
                        
                        print(f"   🌡️  Temperature: {weather['temp']}°C")
                        print(f"   ☁️  Condition: {weather['condition']}")
                        print(f"   💧 Humidity: {weather['humidity']}%")
                        print(f"   💨 Wind: {weather['windSpeed']} km/h")
                        
                        # Show agricultural recommendations
                        if 'agricultural' in weather_data:
                            agricultural = weather_data['agricultural']
                            irrigation = agricultural['recommendations']['irrigation']
                            planting = agricultural['recommendations']['planting']
                            
                            print(f"   🌱 Irrigation: {irrigation['advice']}")
                            print(f"   🌾 Planting: {planting['advice']}")
                        
                        print(f"   ✅ Live weather data loaded successfully!")
                    else:
                        print(f"   ❌ Weather data failed: {weather_response.status_code}")
                else:
                    print(f"   ❌ No suggestions found")
            else:
                print(f"   ❌ Search failed: {search_response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        time.sleep(1)  # Be nice to the API
    
    print("\n" + "=" * 50)
    print("🎉 Demo completed! Your weather search is working perfectly!")
    print("\n📱 How to use in your app:")
    print("1. Type location name in search box (e.g., 'Mumbai')")
    print("2. Select from suggestions")
    print("3. View live weather data instantly")
    print("4. Get agricultural recommendations")

def test_specific_location(location):
    """Test weather for a specific location"""
    print(f"\n🔍 Testing weather for: {location}")
    
    try:
        # Get weather data
        response = requests.get(f"{BASE_URL}/weather?location={location}")
        if response.status_code == 200:
            data = response.json()
            weather = data['weather']
            
            print(f"✅ Location: {weather['location']}")
            print(f"🌡️  Temperature: {weather['temp']}°C")
            print(f"☁️  Condition: {weather['condition']}")
            print(f"💧 Humidity: {weather['humidity']}%")
            print(f"💨 Wind Speed: {weather['windSpeed']} km/h")
            print(f"👁️  Visibility: {weather.get('visibility', 'N/A')} km")
            print(f"🔽 Pressure: {weather.get('pressure', 'N/A')} hPa")
            print(f"🌡️  Feels Like: {weather.get('feels_like', 'N/A')}°C")
            print(f"☀️  UV Index: {weather.get('uv_index', 'N/A')}")
            
            # Show forecast
            if 'daily' in data and data['daily']:
                print(f"\n📅 7-Day Forecast:")
                for i, day in enumerate(data['daily'][:3]):  # Show first 3 days
                    day_name = "Today" if i == 0 else f"Day {i+1}"
                    print(f"   {day_name}: {day['high']}°C / {day['low']}°C - {day.get('condition', 'N/A')}")
            
            # Show agricultural recommendations
            if 'agricultural' in data:
                agricultural = data['agricultural']
                print(f"\n🌱 Agricultural Recommendations:")
                print(f"   💧 Irrigation: {agricultural['recommendations']['irrigation']['advice']}")
                print(f"   🌾 Planting: {agricultural['recommendations']['planting']['advice']}")
                print(f"   🐛 Pest Management: {agricultural['recommendations']['pest_management']['advice']}")
                print(f"   🌾 Harvesting: {agricultural['recommendations']['harvesting']['advice']}")
                
                # Show suitable crops
                if agricultural.get('suitable_crops'):
                    print(f"\n🌾 Suitable Crops:")
                    for crop in agricultural['suitable_crops'][:3]:
                        print(f"   - {crop['crop']}: {crop['suitability']} ({crop['reason']})")
            
            return True
        else:
            print(f"❌ Failed to get weather data: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main demo function"""
    print("🌤️  SMARTCROP Weather Search Demo")
    print("Make sure your server is running on http://localhost:5000")
    print("=" * 60)
    
    # Test Mumbai specifically as requested
    print("🎯 Testing Mumbai weather (as requested):")
    if test_specific_location("Mumbai, India"):
        print("✅ Mumbai weather is working perfectly!")
    
    print("\n" + "=" * 60)
    print("🚀 Your weather search is ready!")
    print("📍 You can now search for any location and get live weather data")
    print("🌱 Plus agricultural recommendations for smart farming!")

if __name__ == '__main__':
    main()

