document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const locationSearch = document.getElementById('locationSearch');
    const searchBtn = document.getElementById('searchBtn');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const clearBtn = document.getElementById('clearBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const recentSearches = document.getElementById('recentSearches');
    const recentItems = document.getElementById('recentItems');
    
    // Weather display elements
    const currentTemp = document.querySelector('.temperature');
    const currentCondition = document.querySelector('.condition');
    const currentLocation = document.querySelector('.location');
    const weatherIcon = document.querySelector('.weather-icon i');
    const humidityEl = document.querySelector('.humidity-value');
    const windSpeedEl = document.querySelector('.wind-value');
    const rainChanceEl = document.querySelector('.rain-value');
    const pressureEl = document.querySelector('.pressure-value');
    const visibilityEl = document.querySelector('.visibility-value');
    const uvIndexEl = document.querySelector('.uv-value');
    const forecastGrid = document.querySelector('.forecast-grid');
    const agriculturalRecs = document.querySelector('.recommendations-grid');
    const cropsGrid = document.querySelector('.crops-grid');

    // Load recent searches from localStorage
    let recentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    
    // Update recent searches display
    function updateRecentSearches() {
        if (!recentItems) return;
        
        recentItems.innerHTML = recentLocations.map(location => `
            <div class="recent-item" data-location="${location}">
                <i class="fas fa-search"></i>
                <span>${location}</span>
            </div>
        `).join('');
        
        // Add click event to recent items
        document.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const location = item.getAttribute('data-location');
                locationSearch.value = location;
                searchWeather(location);
            });
        });
    }
    
    // Save location to recent searches
    function saveToRecent(location) {
        if (!location) return;
        
        // Remove if already exists
        recentLocations = recentLocations.filter(loc => loc.toLowerCase() !== location.toLowerCase());
        
        // Add to beginning
        recentLocations.unshift(location);
        
        // Keep only last 5 searches
        if (recentLocations.length > 5) {
            recentLocations.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('recentLocations', JSON.stringify(recentLocations));
        
        // Update display
        updateRecentSearches();
    }
    
    // Search for weather by location
    async function searchWeather(location) {
        if (!location) return;
        
        try {
            // Show loading state
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Call the API
            const response = await fetch(`/weather?location=${encodeURIComponent(location)}`);
            
            if (!response.ok) {
                throw new Error('Location not found');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Update UI with weather data
            updateWeatherUI(data);
            
            // Save to recent searches
            saveToRecent(location);
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            alert('Failed to fetch weather data. Please try again.');
        } finally {
            // Reset button state
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>Search</span>';
        }
    }
    
    // Update UI with weather data
    function updateWeatherUI(data) {
        if (!data.weather) return;
        
        const { weather, hourly, daily, agricultural } = data;
        
        // Update current weather
        currentTemp.textContent = `${Math.round(weather.temp)}°C`;
        currentCondition.textContent = weather.condition;
        currentLocation.textContent = weather.location;
        
        // Update weather icon
        updateWeatherIcon(weatherIcon, weather.condition, weather.icon);
        
        // Update weather details
        if (humidityEl) humidityEl.textContent = `${weather.humidity}%`;
        if (windSpeedEl) windSpeedEl.textContent = `${weather.windSpeed} km/h`;
        if (rainChanceEl) rainChanceEl.textContent = `${weather.rainfall} mm`;
        if (pressureEl) pressureEl.textContent = `${weather.pressure} hPa`;
        if (visibilityEl) visibilityEl.textContent = `${weather.visibility} km`;
        if (uvIndexEl) uvIndexEl.textContent = weather.uv_index;
        
        // Update hourly forecast
        updateHourlyForecast(hourly);
        
        // Update daily forecast
        updateDailyForecast(daily);
        
        // Update agricultural recommendations
        updateAgriculturalRecommendations(agricultural);
    }
    
    // Update weather icon based on condition
    function updateWeatherIcon(iconElement, condition, iconUrl) {
        if (!iconElement) return;
        
        // Map weather conditions to Font Awesome icons
        const iconMap = {
            'clear': 'sun',
            'sunny': 'sun',
            'partly cloudy': 'cloud-sun',
            'cloudy': 'cloud',
            'overcast': 'cloud',
            'mist': 'smog',
            'fog': 'smog',
            'drizzle': 'cloud-rain',
            'rain': 'cloud-rain',
            'thunder': 'bolt',
            'snow': 'snowflake',
            'sleet': 'cloud-meatball',
            'hail': 'cloud-meatball',
            'thunderstorm': 'bolt',
            'tornado': 'wind',
            'dust': 'wind',
            'sand': 'wind',
            'ash': 'wind',
            'squall': 'wind',
            'smoke': 'smog'
        };
        
        // Find matching icon
        const conditionLower = condition.toLowerCase();
        let iconClass = 'sun';
        
        for (const [key, value] of Object.entries(iconMap)) {
            if (conditionLower.includes(key)) {
                iconClass = value;
                break;
            }
        }
        
        // Update icon
        iconElement.className = `fas fa-${iconClass}`;
    }
    
    // Update hourly forecast
    function updateHourlyForecast(hourlyData) {
        if (!forecastGrid || !hourlyData) return;
        
        // Clear existing content
        forecastGrid.innerHTML = '';
        
        // Add next 6 hours
        const now = new Date();
        const currentHour = now.getHours();
        
        for (let i = 0; i < 6; i++) {
            const hourIndex = (currentHour + i) % 24;
            const hour = hourlyData[hourIndex] || hourlyData[0]; // Fallback to first hour if not enough data
            
            const hourElement = document.createElement('div');
            hourElement.className = 'forecast-hour';
            hourElement.innerHTML = `
                <div class="hour">${hour.time}</div>
                <div class="hour-icon">
                    <i class="fas fa-${hour.temp > 25 ? 'sun' : 'cloud'}"></i>
                </div>
                <div class="hour-temp">${Math.round(hour.temp)}°</div>
                <div class="hour-humidity">${hour.humidity}%</div>
            `;
            
            forecastGrid.appendChild(hourElement);
        }
    }
    
    // Update daily forecast
    function updateDailyForecast(dailyData) {
        if (!forecastGrid || !dailyData) return;
        
        // Clear existing content
        forecastGrid.innerHTML = '';
        
        // Add next 7 days
        dailyData.slice(0, 7).forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            
            const date = new Date(day.day);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            dayElement.innerHTML = `
                <div class="day-name">${dayName}</div>
                <div class="day-icon">
                    <i class="fas fa-${day.condition.toLowerCase().includes('rain') ? 'cloud-rain' : 'sun'}"></i>
                </div>
                <div class="day-temp">
                    <span class="high">${Math.round(day.high)}°</span>
                    <span class="low">${Math.round(day.low)}°</span>
                </div>
                <div class="day-rain">
                    <i class="fas fa-tint"></i> ${day.rain_chance}%
                </div>
            `;
            
            forecastGrid.appendChild(dayElement);
        });
    }
    
    // Update agricultural recommendations
    function updateAgriculturalRecommendations(agricultural) {
        if (!agriculturalRecs || !agricultural) return;
        
        // Clear existing content
        agriculturalRecs.innerHTML = '';
        
        // Add agricultural recommendations
        const recommendations = [
            {
                icon: 'tint',
                title: 'Irrigation',
                text: agricultural.irrigation_advice || 'Water your crops as needed based on soil moisture.'
            },
            {
                icon: 'seedling',
                title: 'Planting',
                text: agricultural.planting_advice || 'Good conditions for planting most crops.'
            },
            {
                icon: 'bug',
                title: 'Pest Control',
                text: agricultural.pest_advice || 'Monitor for pests and diseases.'
            },
            {
                icon: 'tractor',
                title: 'Harvesting',
                text: agricultural.harvesting_advice || 'Harvest when crops are ready.'
            }
        ];
        
        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-card weather-rec';
            card.innerHTML = `
                <div class="rec-header">
                    <div class="rec-icon">
                        <i class="fas fa-${rec.icon}"></i>
                    </div>
                    <h3>${rec.title}</h3>
                </div>
                <p>${rec.text}</p>
            `;
            
            agriculturalRecs.appendChild(card);
        });
    }
    
    // Event Listeners
    if (searchBtn && locationSearch) {
        searchBtn.addEventListener('click', () => {
            const location = locationSearch.value.trim();
            if (location) {
                searchWeather(location);
            }
        });
        
        locationSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const location = locationSearch.value.trim();
                if (location) {
                    searchWeather(location);
                }
            }
        });
    }
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        searchWeather(`${latitude},${longitude}`);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert('Unable to retrieve your location. Please enter it manually.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            locationSearch.value = '';
            clearBtn.style.display = 'none';
            searchSuggestions.style.display = 'none';
        });
    }
    
    // Show/hide clear button based on input
    if (locationSearch) {
        locationSearch.addEventListener('input', () => {
            clearBtn.style.display = locationSearch.value ? 'block' : 'none';
        });
    }
    
    // Initialize recent searches
    updateRecentSearches();
    
    // Load default location (e.g., Delhi) on page load
    searchWeather('Delhi, India');
});
