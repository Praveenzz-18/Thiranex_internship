/* =====================================================
   WEATHER DASHBOARD - MAIN JAVASCRIPT
   ===================================================== */

// =====================================================
// CONFIGURATION & API SETUP
// =====================================================

const CONFIG = {
    // Using Open-Meteo API (free, no API key required)
    // For production, use OpenWeatherMap with proper API key
    BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    GEO_BASE_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    TIMEOUT: 10000, // 10 seconds
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// =====================================================
// STATE MANAGEMENT
// =====================================================

const state = {
    currentWeather: null,
    forecastData: null,
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || [],
    currentLocation: null,
    lastUpdateTime: null,
};

// =====================================================
// DOM ELEMENTS
// =====================================================

const DOM = {
    // Search Elements
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    currentLocationBtn: document.getElementById('currentLocationBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),

    // State Elements
    loading: document.getElementById('loading'),
    errorContainer: document.getElementById('errorContainer'),
    weatherContainer: document.getElementById('weatherContainer'),
    initialState: document.getElementById('initialState'),

    // Error Elements
    errorTitle: document.getElementById('errorTitle'),
    errorText: document.getElementById('errorText'),
    retryBtn: document.getElementById('retryBtn'),

    // Weather Display Elements
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    lastUpdate: document.getElementById('lastUpdate'),
    weatherIcon: document.getElementById('weatherIcon'),
    temp: document.getElementById('temp'),
    weatherDescription: document.getElementById('weatherDescription'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    feelsLike: document.getElementById('feelsLike'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    coordinates: document.getElementById('coordinates'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    cloudCover: document.getElementById('cloudCover'),

    // Forecast & Recent
    forecastContainer: document.getElementById('forecastContainer'),
    recentSearches: document.getElementById('recentSearches'),

    // Buttons
    startBtn: document.getElementById('startBtn'),
    searchBtn: document.getElementById('searchBtn'),
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format time from seconds since epoch to readable format
 */
function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get current date and time
 */
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get weather emoji based on weather code
 */
function getWeatherEmoji(weatherCode, isDay = true) {
    // WMO Weather interpretation codes
    const weatherMap = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Foggy
        48: '🌫️', // Depositing rime fog
        51: '🌧️', // Light drizzle
        53: '🌧️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        61: '🌦️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '⛈️', // Heavy rain
        71: '❄️', // Slight snow
        73: '❄️', // Moderate snow
        75: '❄️', // Heavy snow
        77: '❄️', // Snow grains
        80: '🌧️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '⛈️', // Violent rain showers
        85: '🌨️', // Slight snow showers
        86: '🌨️', // Heavy snow showers
        95: '⛈️', // Thunderstorm
        96: '⛈️', // Thunderstorm with slight hail
        99: '⛈️', // Thunderstorm with heavy hail
    };

    return weatherMap[weatherCode] || (isDay ? '🌤️' : '🌙');
}

/**
 * Get weather description based on weather code
 */
function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail',
    };

    return descriptions[weatherCode] || 'Unknown';
}

/**
 * Show/hide loading state
 */
function setLoading(isLoading) {
    if (isLoading) {
        DOM.loading.classList.remove('hidden');
        DOM.errorContainer.classList.add('hidden');
        DOM.weatherContainer.classList.add('hidden');
        DOM.initialState.classList.add('hidden');
    } else {
        DOM.loading.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(title = 'Error', message = 'Something went wrong. Please try again.') {
    DOM.errorTitle.textContent = title;
    DOM.errorText.textContent = message;
    DOM.errorContainer.classList.remove('hidden');
    DOM.weatherContainer.classList.add('hidden');
    DOM.loading.classList.add('hidden');
    DOM.initialState.classList.add('hidden');
}

/**
 * Show weather container
 */
function showWeather() {
    DOM.weatherContainer.classList.remove('hidden');
    DOM.errorContainer.classList.add('hidden');
    DOM.loading.classList.add('hidden');
    DOM.initialState.classList.add('hidden');
}

/**
 * Show initial state
 */
function showInitialState() {
    DOM.initialState.classList.remove('hidden');
    DOM.weatherContainer.classList.add('hidden');
    DOM.errorContainer.classList.add('hidden');
    DOM.loading.classList.add('hidden');
}

/**
 * Comprehensive error handler
 */
async function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);

    if (error.name === 'AbortError') {
        showError('Request Timeout', 'The request took too long. Please try again.');
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
        showError(
            'Network Error',
            'Unable to connect to the server. Please check your internet connection.'
        );
    } else if (error.message === 'Location not found') {
        showError('Location Not Found', 'Could not find the location you searched for. Try again.');
    } else if (error.message === 'No results') {
        showError('No Results', 'No weather data available for this location.');
    } else {
        showError(error.title || 'Error', error.message || 'Something went wrong. Please try again.');
    }
}

// =====================================================
// API FUNCTIONS
// =====================================================

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url, timeout = CONFIG.TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Search for locations by city name
 */
async function searchLocations(query) {
    if (!query || query.trim().length < 2) {
        DOM.searchSuggestions.innerHTML = '';
        DOM.searchSuggestions.classList.remove('active');
        return;
    }

    try {
        const url = `${CONFIG.GEO_BASE_URL}?name=${encodeURIComponent(query)}&count=5&language=en`;
        const data = await fetchWithTimeout(url);

        if (!data.results || data.results.length === 0) {
            DOM.searchSuggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
            DOM.searchSuggestions.classList.add('active');
            return;
        }

        // Parse complex JSON data
        DOM.searchSuggestions.innerHTML = data.results
            .map(
                (result) =>
                    `<div class="suggestion-item" data-lat="${result.latitude}" data-lon="${result.longitude}" data-name="${result.name}" data-country="${result.country || ''}">
                <strong>${result.name}</strong>
                ${result.admin1 ? `, ${result.admin1}` : ''}
                ${result.country ? `, ${result.country}` : ''}
            </div>`
            )
            .join('');

        DOM.searchSuggestions.classList.add('active');

        // Add event listeners to suggestions
        document.querySelectorAll('.suggestion-item').forEach((item) => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                const name = item.dataset.name;
                const country = item.dataset.country;

                fetchWeatherData(lat, lon, name, country);
                DOM.searchInput.value = `${name}${country ? ', ' + country : ''}`;
                DOM.searchSuggestions.innerHTML = '';
                DOM.searchSuggestions.classList.remove('active');
            });
        });
    } catch (error) {
        console.error('Location search error:', error);
        DOM.searchSuggestions.innerHTML = '<div class="suggestion-item">Search unavailable</div>';
        DOM.searchSuggestions.classList.add('active');
    }
}

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(latitude, longitude, cityName = 'Unknown', country = '') {
    setLoading(true);

    try {
        // Build URL with comprehensive parameters
        const url =
            `${CONFIG.BASE_URL}?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover,pressure_msl,visibility&` +
            `daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&` +
            `timezone=auto`;

        // Fetch with timeout and error handling
        const weatherData = await fetchWithTimeout(url, CONFIG.TIMEOUT);

        if (
            !weatherData.current ||
            weatherData.current.temperature_2m === undefined
        ) {
            throw new Error({
                message: 'Invalid weather data received',
                title: 'Data Error',
            });
        }

        // Parse and structure complex nested JSON
        state.currentWeather = {
            location: {
                name: cityName,
                country: country,
                latitude: latitude,
                longitude: longitude,
            },
            current: {
                temperature: Math.round(weatherData.current.temperature_2m),
                humidity: weatherData.current.relative_humidity_2m,
                windSpeed: weatherData.current.wind_speed_10m,
                feelsLike: Math.round(weatherData.current.apparent_temperature),
                weatherCode: weatherData.current.weather_code,
                cloudCover: weatherData.current.cloud_cover,
                pressure: weatherData.current.pressure_msl,
                visibility: Math.round(weatherData.current.visibility / 1000),
            },
            timezone: weatherData.timezone,
        };

        state.forecastData = weatherData.daily;
        state.lastUpdateTime = new Date();

        // Update UI
        renderWeatherData();
        showWeather();
        addToRecentSearches(cityName, country);

        // Store in cache
        cacheWeatherData(latitude, longitude);
    } catch (error) {
        await handleError(error, 'fetchWeatherData');
    } finally {
        setLoading(false);
    }
}

/**
 * Cache weather data in localStorage
 */
function cacheWeatherData(latitude, longitude) {
    try {
        const cacheKey = `weather_${latitude}_${longitude}`;
        const cacheData = {
            weather: state.currentWeather,
            forecast: state.forecastData,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Failed to cache data:', error);
    }
}

/**
 * Get cached weather data if available and not expired
 */
function getCachedWeatherData(latitude, longitude) {
    try {
        const cacheKey = `weather_${latitude}_${longitude}`;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;

        if (age > CONFIG.CACHE_DURATION) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    } catch (error) {
        console.warn('Failed to retrieve cache:', error);
        return null;
    }
}

// =====================================================
// UI RENDERING FUNCTIONS
// =====================================================

/**
 * Render current weather data
 */
function renderWeatherData() {
    if (!state.currentWeather) return;

    const { current, location, timezone } = state.currentWeather;

    // Update location info
    DOM.cityName.textContent = `${location.name}${location.country ? ', ' + location.country : ''}`;
    DOM.dateTime.textContent = getCurrentDateTime();

    // Update last update time
    if (state.lastUpdateTime) {
        DOM.lastUpdate.textContent = `Last updated: ${state.lastUpdateTime.toLocaleTimeString()}`;
    }

    // Update weather icon and description
    const weatherEmoji = getWeatherEmoji(current.weatherCode);
    const weatherDescription = getWeatherDescription(current.weatherCode);
    DOM.weatherIcon.textContent = weatherEmoji;
    DOM.weatherDescription.textContent = weatherDescription;

    // Update temperature and other metrics
    DOM.temp.textContent = current.temperature;
    DOM.humidity.textContent = current.humidity;
    DOM.windSpeed.textContent = current.windSpeed.toFixed(1);
    DOM.feelsLike.textContent = current.feelsLike;
    DOM.visibility.textContent = current.visibility;
    DOM.pressure.textContent = current.pressure;
    DOM.coordinates.textContent = `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`;
    DOM.cloudCover.textContent = `${current.cloudCover}%`;

    // Update sunrise and sunset
    if (state.forecastData) {
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = state.forecastData.time.indexOf(today);

        if (todayIndex !== -1) {
            DOM.sunrise.textContent = formatTime(
                new Date(state.forecastData.sunrise[todayIndex]).getTime() / 1000
            );
            DOM.sunset.textContent = formatTime(
                new Date(state.forecastData.sunset[todayIndex]).getTime() / 1000
            );
        }
    }

    // Render forecast
    renderForecast();
}

/**
 * Render 5-day forecast
 */
function renderForecast() {
    if (!state.forecastData) return;

    const forecastHTML = state.forecastData.time
        .slice(0, 5)
        .map((date, index) => {
            const tempMax = state.forecastData.temperature_2m_max[index];
            const tempMin = state.forecastData.temperature_2m_min[index];
            const weatherCode = state.forecastData.weather_code[index];
            const emoji = getWeatherEmoji(weatherCode);

            return `
            <div class="forecast-card">
                <div class="forecast-date">${formatDate(date)}</div>
                <div class="forecast-icon">${emoji}</div>
                <div class="forecast-temp">${Math.round(tempMax)}° / ${Math.round(tempMin)}°</div>
                <div class="forecast-description">${getWeatherDescription(weatherCode)}</div>
            </div>
        `;
        })
        .join('');

    DOM.forecastContainer.innerHTML = forecastHTML;
}

/**
 * Render recent searches
 */
function renderRecentSearches() {
    if (state.recentSearches.length === 0) {
        DOM.recentSearches.innerHTML = '<p style="color: var(--light-text);">No recent searches</p>';
        return;
    }

    DOM.recentSearches.innerHTML = state.recentSearches
        .map((search) => {
            const displayName = search.country ? `${search.name}, ${search.country}` : search.name;
            return `
            <button class="recent-search-btn" data-name="${search.name}" data-country="${search.country}" data-lat="${search.lat}" data-lon="${search.lon}">
                ${displayName}
                <span class="remove-recent">×</span>
            </button>
        `;
        })
        .join('');

    // Add event listeners
    document.querySelectorAll('.recent-search-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-recent')) {
                fetchWeatherData(
                    parseFloat(btn.dataset.lat),
                    parseFloat(btn.dataset.lon),
                    btn.dataset.name,
                    btn.dataset.country
                );
            }
        });

        btn.querySelector('.remove-recent').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromRecentSearches(btn.dataset.name, btn.dataset.country);
        });
    });
}

/**
 * Add location to recent searches
 */
function addToRecentSearches(name, country) {
    const { latitude, longitude } = state.currentWeather.location;

    // Remove if already exists
    state.recentSearches = state.recentSearches.filter(
        (s) => !(s.name === name && s.country === country)
    );

    // Add to beginning
    state.recentSearches.unshift({
        name,
        country,
        lat: latitude,
        lon: longitude,
    });

    // Keep only last 5
    state.recentSearches = state.recentSearches.slice(0, 5);

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));

    renderRecentSearches();
}

/**
 * Remove from recent searches
 */
function removeFromRecentSearches(name, country) {
    state.recentSearches = state.recentSearches.filter(
        (s) => !(s.name === name && s.country === country)
    );
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    renderRecentSearches();
}

// =====================================================
// GEOLOCATION FUNCTIONS
// =====================================================

/**
 * Get user's current location and fetch weather
 */
async function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Location Unavailable', 'Geolocation is not supported by your browser.');
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            // Try to get city name from reverse geocoding
            try {
                const url = `${CONFIG.GEO_BASE_URL}?latitude=${latitude}&longitude=${longitude}`;
                const data = await fetchWithTimeout(url);

                const location = data.results?.[0];
                const cityName = location?.name || 'Current Location';
                const country = location?.country || '';

                fetchWeatherData(latitude, longitude, cityName, country);
            } catch (error) {
                // Fallback: use coordinates if reverse geocoding fails
                fetchWeatherData(latitude, longitude, 'Current Location', '');
            }
        },
        (error) => {
            setLoading(false);
            const errorMessages = {
                1: 'Location permission denied. Please enable location access in your browser settings.',
                2: 'Unable to retrieve your location. Please try again.',
                3: 'Location request timed out. Please try again.',
            };
            showError('Location Error', errorMessages[error.code] || errorMessages[2]);
        }
    );
}

// =====================================================
// EVENT LISTENERS
// =====================================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Search input with debouncing
    let searchTimeout;
    DOM.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchLocations(e.target.value);
        }, 300);
    });

    // Search button
    DOM.searchBtn.addEventListener('click', () => {
        const query = DOM.searchInput.value.trim();
        if (query) {
            searchLocations(query);
        }
    });

    // Location button
    DOM.currentLocationBtn.addEventListener('click', getCurrentLocationWeather);

    // Retry button
    DOM.retryBtn.addEventListener('click', () => {
        showInitialState();
    });

    // Start button
    DOM.startBtn.addEventListener('click', () => {
        DOM.searchInput.focus();
    });

    // Enter key to search
    DOM.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            DOM.searchBtn.click();
        }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (e.target !== DOM.searchInput && !e.target.closest('.search-suggestions')) {
            DOM.searchSuggestions.classList.remove('active');
        }
    });
}

// =====================================================
// INITIALIZATION
// =====================================================

/**
 * Initialize the application
 */
function init() {
    // Render recent searches
    renderRecentSearches();

    // Initialize event listeners
    initEventListeners();

    // Show initial state
    showInitialState();

    console.log('Weather Dashboard initialized successfully');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
