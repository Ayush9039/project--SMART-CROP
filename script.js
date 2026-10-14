// Header Banners: auto-rotation + dots navigation (supports multiple banners)
function initHeaderBanner(banner) {
    const slides = Array.from(banner.querySelectorAll('.banner-slide'));
    if (!slides.length) return;
    const dots = Array.from(banner.querySelectorAll('.banner-dot'));
    let index = 0;
    let timerId = null;

    function setActive(i) {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        if (dots.length) {
            dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
        }
        index = i;
    }

// Build a unified sidebar menu across all pages so items never go missing
function buildUnifiedSidebarMenu() {
    const nav = document.querySelector('#sidebar .nav-menu');
    if (!nav) return;
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    // Base items (without Image Detection)
    const items = [
        { href: 'index.html', icon: 'fa-home', label: 'Home' },
        { href: 'market.html', icon: 'fa-chart-line', label: 'Market' },
        { href: 'fertilizers.html', icon: 'fa-flask', label: 'Fertilizers' },
        // Image Detection will be conditionally added for index only
        { href: 'learning.html', icon: 'fa-graduation-cap', label: 'Learning' },
        { href: 'sensors.html', icon: 'fa-microchip', label: 'Sensors' },
        { href: 'weather.html', icon: 'fa-cloud-sun', label: 'Weather' },
        { href: 'ai-assistant.html', icon: 'fa-robot', label: 'AI Assistant' },
        { href: 'faqs.html', icon: 'fa-question-circle', label: 'FAQs' },
        { href: 'contact.html', icon: 'fa-envelope', label: 'Contact Us' },
        { href: 'login.html', icon: 'fa-sign-in-alt', label: 'Sign In / Login' }
    ];
    // Do NOT include Image Detection in the sidebar (kept accessible via content buttons on pages)
    const html = items.map(it => {
        const isActive = current === it.href.toLowerCase();
        return `<a href="${it.href}" class="nav-item${isActive ? ' active' : ''}">\n                <i class="fas ${it.icon}"></i> ${it.label}\n            </a>`;
    }).join('\n');
    nav.innerHTML = html;
}

    function next() {
        const i = (index + 1) % slides.length;
        setActive(i);
    }

    function startAuto() {
        stopAuto();
        timerId = setInterval(next, 4000);
    }

    function stopAuto() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    if (dots.length) {
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                setActive(i);
                startAuto();
            });
        });
    }

    banner.addEventListener('mouseenter', stopAuto);
    banner.addEventListener('mouseleave', startAuto);

    setActive(0);
    startAuto();
}

document.addEventListener('DOMContentLoaded', function() {
    const banners = Array.from(document.querySelectorAll('.header-banner'));
    banners.forEach(initHeaderBanner);
});

// Language Toggle (index-focused)
const translations = {
  en: {
    '#sidebar .nav-menu a[href="index.html"]': 'Home',
    '#sidebar .nav-menu a[href="market.html"]': 'Market',
    '#sidebar .nav-menu a[href="fertilizers.html"]': 'Fertilizers',
    '#sidebar .nav-menu a[href="image-detection.html"]': 'Image Detection',
    '#sidebar .nav-menu a[href="learning.html"]': 'Learning',
    '#sidebar .nav-menu a[href="sensors.html"]': 'Sensors',
    '#sidebar .nav-menu a[href="weather.html"]': 'Weather',
    '#sidebar .nav-menu a[href="faqs.html"]': 'FAQs',
    '#sidebar .nav-menu a[href="contact.html"]': 'Contact Us',
    '#sidebar .nav-menu a[href="login.html"]': 'Sign In / Login',

    '.hero-text h1': 'Smart Technology for Smart Farming',
    '.hero-text p': 'Revolutionizing agriculture with cutting-edge IoT sensors, AI-powered insights, and data-driven solutions to maximize crop yield and minimize resource consumption.',
    '.hero .btn.btn-primary': 'Get Started',
    '.hero .btn.btn-secondary': 'Learn More',

    '#fertilizer h2': 'Fertilizer Recommendations',
    '#fertilizer .section-description': 'Balanced crop nutrition with clear split doses, timings and good soil practices. Prefer soil testing for accurate doses.',
    '#fertilizer .rec-content h3:nth-of-type(1)': 'Wheat (per acre)',
    '#fertilizer .rec-content h3:nth-of-type(2)': 'Rice (per acre)',
    '#fertilizer .rec-content h3:nth-of-type(3)': 'Vegetables (generic per acre)',
    '#fertilizer .rec-cta a': 'Open Full Fertilizer Guide',

    '#about h2': 'New Approaches for Farming Technology',
    '#about .section-description': 'Discover innovative solutions that are transforming modern agriculture through technology integration and data-driven decision making.',

    '#pesticide h2': 'Pesticide Recommendations',
    '#pesticide .section-description': 'IPM first: prevention, correct ID, label-dose, PHI. Protect pollinators and follow safety.',
    '#pesticide .rec-content h3:nth-of-type(1)': 'Insect Management',
    '#pesticide .rec-content h3:nth-of-type(2)': 'Fungal Diseases',
    '#pesticide .rec-content h3:nth-of-type(3)': 'Safety & IPM',
    '#pesticide .rec-cta a': 'Open Full Pesticide Guide'
  },
  hi: {
    '#sidebar .nav-menu a[href="index.html"]': 'होम',
    '#sidebar .nav-menu a[href="market.html"]': 'मार्केट',
    '#sidebar .nav-menu a[href="fertilizers.html"]': 'उर्वरक',
    '#sidebar .nav-menu a[href="image-detection.html"]': 'इमेज डिटेक्शन',
    '#sidebar .nav-menu a[href="learning.html"]': 'लर्निंग',
    '#sidebar .nav-menu a[href="sensors.html"]': 'सेंसर',
    '#sidebar .nav-menu a[href="weather.html"]': 'मौसम',
    '#sidebar .nav-menu a[href="faqs.html"]': 'सवाल-जवाब (FAQs)',
    '#sidebar .nav-menu a[href="contact.html"]': 'संपर्क',
    '#sidebar .nav-menu a[href="login.html"]': 'साइन इन / लॉगिन',

    '.hero-text h1': 'स्मार्ट खेती के लिए स्मार्ट टेक्नोलॉजी',
    '.hero-text p': 'आधुनिक IoT सेंसर, एआई इनसाइट्स और डेटा‑ड्रिवन समाधानों के साथ खेती में बदलाव — अधिक पैदावार और कम संसाधन उपयोग।',
    '.hero .btn.btn-primary': 'शुरू करें',
    '.hero .btn.btn-secondary': 'और जानें',

    '#fertilizer h2': 'उर्वरक सिफारिशें',
    '#fertilizer .section-description': 'संतुलित पोषण, स्पष्ट स्प्लिट‑डोज़, समय और अच्छी मिट्टी प्रथाएँ। सही मात्रा के लिए मिट्टी परीक्षण करें।',
    '#fertilizer .rec-content h3:nth-of-type(1)': 'गेहूं (प्रति एकड़)',
    '#fertilizer .rec-content h3:nth-of-type(2)': 'धान (प्रति एकड़)',
    '#fertilizer .rec-content h3:nth-of-type(3)': 'सब्जियाँ (सामान्य प्रति एकड़)',
    '#fertilizer .rec-cta a': 'पूरी उर्वरक गाइड खोलें',

    '#about h2': 'खेती की नई तकनीकें',
    '#about .section-description': 'टेक्नोलॉजी और डेटा‑आधारित फैसलों से आधुनिक कृषि में बदलाव जानें।',

    '#pesticide h2': 'कीटनाशी सिफारिशें',
    '#pesticide .section-description': 'आईपीएम पहले: रोकथाम, सही पहचान, लेबल‑डोज़, PHI. परागणकों को सुरक्षित रखें और सुरक्षा का पालन करें।',
    '#pesticide .rec-content h3:nth-of-type(1)': 'कीट प्रबंधन',
    '#pesticide .rec-content h3:nth-of-type(2)': 'फफूंद रोग',
    '#pesticide .rec-content h3:nth-of-type(3)': 'सुरक्षा और आईपीएम',
    '#pesticide .rec-cta a': 'पूरी कीटनाशी गाइड खोलें'
  }
};

function applyLanguage(lang) {
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.innerHTML = lang === 'hi' ? '<i class="fas fa-globe"></i> हिन्दी' : '<i class="fas fa-globe"></i> English';
  }
  const map = translations[lang];
  if (!map) return;
  Object.keys(map).forEach(sel => {
    try {
      const el = document.querySelector(sel);
      if (!el) return;
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        const icon = el.querySelector('i');
        const text = map[sel];
        if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + text));
        } else {
          el.textContent = text;
        }
      } else {
        el.textContent = map[sel];
      }
    } catch (_) {}
  });
}

function toggleLanguage() {
  const current = localStorage.getItem('lang') || 'en';
  const next = current === 'en' ? 'hi' : 'en';
  localStorage.setItem('lang', next);
  applyLanguage(next);
}

// Sidebar toggle (global)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main-content');
    if (!sidebar || !main) return;
    const collapsed = sidebar.classList.toggle('collapsed');
    if (collapsed) {
        main.classList.add('sidebar-collapsed');
    } else {
        main.classList.remove('sidebar-collapsed');
    }
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add global hamburger button (always visible)
function ensureGlobalMenuButton() {
    if (!document.querySelector('.global-menu-btn')) {
        const btn = document.createElement('button');
        btn.className = 'global-menu-btn';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        btn.addEventListener('click', toggleSidebar);
        document.body.appendChild(btn);
    }
}

// Handle responsive design
document.addEventListener('DOMContentLoaded', function() {
    ensureGlobalMenuButton();
    // Collapse sidebar by default
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main-content');
    if (sidebar && main && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        main.classList.add('sidebar-collapsed');
    }
    // 1) Build a unified sidebar menu across all pages
    buildUnifiedSidebarMenu();

    // 2) Initialize language from storage (default en)
    const savedLang = localStorage.getItem('lang') || 'en';
    applyLanguage(savedLang);
});

// Close sidebar when clicking outside (if open)
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const btn = document.querySelector('.global-menu-btn');
    if (!sidebar) return;
    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedButton = btn && (btn === e.target || btn.contains(e.target));
    if (!sidebar.classList.contains('collapsed') && !clickedInsideSidebar && !clickedButton) {
        toggleSidebar();
    }
});

// Add loading animation for better UX
function showLoading(element) {
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation to cards
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card, .approach-cards .card, .price-card, .market-card, .knowledge-card, .sensor-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Form validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generic form handler
function handleFormSubmit(formId, successMessage = 'Form submitted successfully!') {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#d1d5db';
                }
                
                if (field.type === 'email' && field.value && !validateEmail(field.value)) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.backgroundColor = '#10b981';
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            }
        });
    }
}

// Initialize form handlers
document.addEventListener('DOMContentLoaded', function() {
    handleFormSubmit('contactForm');
    handleFormSubmit('signinForm');
    handleFormSubmit('signupForm');
});

// Weather data simulation (in a real app, this would fetch from an API)
function simulateWeatherData() {
    return {
        current: {
            temperature: Math.floor(Math.random() * 15) + 20,
            condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 30) + 50,
            windSpeed: Math.floor(Math.random() * 20) + 5
        }
    };
}

// Price data simulation (in a real app, this would fetch from an API)
function simulateMarketData() {
    const crops = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Corn', 'Sugarcane'];
    const states = ['Punjab', 'Haryana', 'Gujarat', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'];
    
    return crops.map(crop => ({
        name: crop,
        state: states[Math.floor(Math.random() * states.length)],
        price: Math.floor(Math.random() * 3000) + 1500,
        change: (Math.random() * 20 - 10).toFixed(1)
    }));
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update weather data if on weather page
    if (document.querySelector('.current-weather')) {
        // Weather API integration
        const weatherBtn = document.getElementById('get-weather-btn');
        const locationInput = document.getElementById('weather-location');
        const errorSpan = document.getElementById('weather-error');
        const weatherMain = document.querySelector('.weather-main');
        const weatherInfo = weatherMain ? weatherMain.querySelector('.weather-info') : null;
        const weatherIconDiv = weatherMain ? weatherMain.querySelector('.weather-icon') : null;
        const weatherDetails = document.querySelector('.weather-details');

        function updateWeatherUI(data) {
            if (!data.weather) return;
            // Update main info
            if (weatherInfo) {
                weatherInfo.querySelector('.temperature').textContent = `${data.weather.temp}°C`;
                weatherInfo.querySelector('.condition').textContent = data.weather.condition;
                weatherInfo.querySelector('.location').textContent = data.weather.location;
            }
            // Update icon
            if (weatherIconDiv) {
                weatherIconDiv.innerHTML = `<img src="${data.weather.icon}" alt="icon" style="height:48px;">`;
            }
            // Update details
            if (weatherDetails) {
                weatherDetails.innerHTML = `
                    <div class="detail-item"><i class="fas fa-tint"></i><span>Humidity</span><strong>${data.weather.humidity}%</strong></div>
                    <div class="detail-item"><i class="fas fa-wind"></i><span>Wind Speed</span><strong>${data.weather.windSpeed} km/h</strong></div>
                    <div class="detail-item"><i class="fas fa-cloud-rain"></i><span>Rainfall</span><strong>${data.weather.rainfall} mm</strong></div>
                `;
            }
        }

        if (weatherBtn && locationInput) {
            weatherBtn.addEventListener('click', function() {
                const location = locationInput.value.trim();
                errorSpan.textContent = '';
                if (!location) {
                    errorSpan.textContent = 'Please enter a location.';
                    return;
                }
                weatherBtn.disabled = true;
                weatherBtn.textContent = 'Loading...';
                fetch(`/weather?location=${encodeURIComponent(location)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            errorSpan.textContent = data.error;
                        } else {
                            updateWeatherUI(data);
                        }
                    })
                    .catch(() => {
                        errorSpan.textContent = 'Failed to fetch weather.';
                    })
                    .finally(() => {
                        weatherBtn.disabled = false;
                        weatherBtn.textContent = 'Get Weather';
                    });
            });
        }
    }
    // Update market data if on market page
    if (document.querySelector('.price-cards')) {
        // Market data would be updated here
    }
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}

// Performance optimization - lazy loading images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==================== WEATHER FUNCTIONALITY ====================

// Weather data handling
let recentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');

// Update recent searches display
function updateRecentSearches() {
    const recentItems = document.getElementById('recentItems');
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
            const locationSearch = document.getElementById('locationSearch');
            if (locationSearch) {
                locationSearch.value = location;
                searchWeather(location);
            }
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
    
    const searchBtn = document.getElementById('searchBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    try {
        // Show loading state
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
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
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = 'Failed to fetch weather data. Please try again.';
            errorElement.style.display = 'block';
        }
    } finally {
        // Reset button state
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>Search</span>';
        }
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    if (!data.weather) return;
    
    const { weather, hourly, daily, agricultural } = data;
    
    // Update current weather
    const currentTemp = document.querySelector('.temperature');
    const currentCondition = document.querySelector('.condition');
    const currentLocation = document.querySelector('.location');
    const weatherIcon = document.querySelector('.weather-icon i');
    
    if (currentTemp) currentTemp.textContent = `${Math.round(weather.temp)}°C`;
    if (currentCondition) currentCondition.textContent = weather.condition;
    if (currentLocation) currentLocation.textContent = weather.location;
    
    // Update weather icon
    if (weatherIcon) updateWeatherIcon(weatherIcon, weather.condition, weather.icon);
    
    // Update weather details
    const humidityEl = document.querySelector('.humidity-value');
    const windSpeedEl = document.querySelector('.wind-value');
    const rainChanceEl = document.querySelector('.rain-value');
    const pressureEl = document.querySelector('.pressure-value');
    const visibilityEl = document.querySelector('.visibility-value');
    const uvIndexEl = document.querySelector('.uv-value');
    
    if (humidityEl) humidityEl.textContent = `${weather.humidity}%`;
    if (windSpeedEl) windSpeedEl.textContent = `${weather.windSpeed} km/h`;
    if (rainChanceEl) rainChanceEl.textContent = `${weather.rainfall} mm`;
    if (pressureEl) pressureEl.textContent = `${weather.pressure} hPa`;
    if (visibilityEl) visibilityEl.textContent = `${weather.visibility} km`;
    if (uvIndexEl) uvIndexEl.textContent = weather.uv_index;
    
    // Update hourly forecast
    if (hourly) updateHourlyForecast(hourly);
    
    // Update daily forecast
    if (daily) updateDailyForecast(daily);
    
    // Update agricultural recommendations
    if (agricultural) updateAgriculturalRecommendations(agricultural);
}

// Update weather icon based on condition
function updateWeatherIcon(iconElement, condition, iconUrl) {
    if (!iconElement || !condition) return;
    
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
    const forecastGrid = document.querySelector('.forecast-grid');
    if (!forecastGrid) return;
    
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
    const forecastGrid = document.querySelector('.forecast-grid');
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
    const agriculturalRecs = document.querySelector('.recommendations-grid');
    if (!agriculturalRecs) return;
    
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

// Initialize weather functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on weather page
    if (!document.querySelector('.current-weather')) return;
    
    // Initialize event listeners
    const searchBtn = document.getElementById('searchBtn');
    const locationSearch = document.getElementById('locationSearch');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    // Load recent searches
    updateRecentSearches();
    
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
            if (locationSearch) locationSearch.value = '';
            clearBtn.style.display = 'none';
            const searchSuggestions = document.getElementById('searchSuggestions');
            if (searchSuggestions) searchSuggestions.style.display = 'none';
        });
    }
    
    // Show/hide clear button based on input
    if (locationSearch) {
        locationSearch.addEventListener('input', () => {
            if (clearBtn) clearBtn.style.display = locationSearch.value ? 'block' : 'none';
        });
    }
    
    // Load default location (e.g., Delhi) on page load
    searchWeather('Delhi, India');
});

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    initImageRotation();
});

// Image rotation functionality for showcase
function initImageRotation() {
    const rotatingImages = document.querySelectorAll('.rotating-image');
    
    rotatingImages.forEach(img => {
        const imageList = img.getAttribute('data-images').split(',');
        let currentIndex = 0;
        
        // Add transition style
        img.style.transition = 'opacity 1s ease-in-out';
        
        // Set initial image
        if (imageList.length > 0) {
            img.src = imageList[0];
            img.style.opacity = 1; // Ensure initial image is visible
        }
        
        // Rotate images with smoother transition
        if (imageList.length > 1) {
            // Wait for the first image to load before starting rotation
            img.onload = function() {
                // Start rotation after a delay to ensure first image is visible
                setTimeout(rotateImages, 5000); // Show first image for 5 seconds
            };
            
            function rotateImages() {
                // Fade out current image
                img.style.opacity = 0;
                
                // After fade out, change image and fade in
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % imageList.length;
                    img.src = imageList[currentIndex];
                    
                    // Fade in new image after a small delay
                    setTimeout(() => {
                        img.style.opacity = 1;
                    }, 100);
                    
                }, 1000); // Wait for fade out to complete
                
                // Schedule next rotation (total cycle: 6 seconds = 1s fade out + 5s display)
                setTimeout(rotateImages, 6000);
            }
        }
    });
}