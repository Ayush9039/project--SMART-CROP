import requests
import json
import base64

def test_image_detection():
    print("🔍 Testing Image Detection API...")
    
    # Create a simple test image (1x1 pixel PNG)
    # This is just to test the API endpoint
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf5\xd7\xd4\xf2\x00\x00\x00\x00IEND\xaeB`\x82'
    
    try:
        files = {'file': ('test.png', test_image_data, 'image/png')}
        response = requests.post('http://localhost:5000/analyze', files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Image Detection API working!")
            print("Response structure:")
            print(json.dumps(data, indent=2))
            
            # Check if we have the expected fields
            result = data.get('result', {})
            expected_fields = ['is_healthy', 'disease_name', 'confidence', 'symptoms', 'treatment', 'prevention']
            
            print("\nField Analysis:")
            for field in expected_fields:
                if field in result:
                    print(f"✅ {field}: {result[field]}")
                else:
                    print(f"❌ {field}: Missing")
                    
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_image_detection()
