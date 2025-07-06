import React, { useState } from 'react';
import { ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, MapPin, Thermometer, Droplets, Loader } from 'lucide-react';

export default function App() {
  const [showWeather, setShowWeather] = useState(false);
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const iconProps = { size: 64, color: "#9CA3AF" };
    const sunProps = { size: 32, color: "#FCD34D" };
    
    switch(condition?.toLowerCase()) {
      case 'clear':
        return <Sun size={64} color="#FCD34D" />;
      case 'clouds':
      case 'broken clouds':
      case 'scattered clouds':
      case 'few clouds':
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Cloud {...iconProps} />
            <Sun {...sunProps} style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
          </div>
        );
      case 'rain':
      case 'drizzle':
        return <CloudRain {...iconProps} />;
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'thunderstorm':
        return <CloudLightning {...iconProps} />;
      default:
        return (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Cloud {...iconProps} />
            <Sun {...sunProps} style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
          </div>
        );
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const API_KEY = '895284fb2d2c50a520ea537456963d9c'; // OpenWeatherMap API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        location: `${data.name}, ${data.sys.country}`,
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      const API_KEY = '895284fb2d2c50a520ea537456963d9c';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        location: `${data.name}, ${data.sys.country}`,
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data for this city');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherByCoords(latitude, longitude);
          setWeatherData(weather);
          setShowWeather(true);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to get your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  const handleCitySearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const weather = await fetchWeatherByCity(city);
      setWeatherData(weather);
      setShowWeather(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowWeather(false);
    setCity('');
    setWeatherData(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCitySearch();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4A9EFF 0%, #1E88E5 50%, #1976D2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '60px' }}>
        
        {/* Input Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: '40px',
          width: '320px',
          transform: showWeather ? 'translateX(-30px)' : 'translateX(0)',
          transition: 'all 0.5s ease'
        }}>
          <h2 style={{
            color: '#4A9EFF',
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '30px',
            margin: '0 0 30px 0'
          }}>
            Weather App
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 20px',
                background: '#F8F9FA',
                border: '1px solid #E9ECEF',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : '#4A9EFF',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              {loading ? 'Searching...' : 'Search Weather'}
            </button>
            
            <div style={{
              textAlign: 'center',
              color: '#6C757D',
              fontSize: '14px',
              margin: '10px 0'
            }}>
              or
            </div>
            
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : '#4A9EFF',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? <Loader size={20} className="animate-spin" /> : null}
              {loading ? 'Getting Location...' : 'Get Device Location'}
            </button>
          </form>

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              color: '#DC2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Curved Arrow */}
        {showWeather && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            opacity: 0.7,
            zIndex: 1
          }}>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <path
                d="M10 20 Q30 5 50 20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="currentColor"
                  />
                </marker>
              </defs>
            </svg>
          </div>
        )}

        {/* Weather Display Card */}
        {showWeather && weatherData && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            padding: '40px',
            width: '320px',
            animation: 'slideIn 0.5s ease-out',
            transformOrigin: 'left center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
              gap: '10px'
            }}>
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4A9EFF',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <h2 style={{
                color: '#4A9EFF',
                fontSize: '22px',
                fontWeight: '600',
                margin: 0
              }}>
                Weather App
              </h2>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {getWeatherIcon(weatherData.condition)}
              </div>
              
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '10px'
              }}>
                {weatherData.temperature}°C
              </div>
              
              <div style={{
                color: '#6B7280',
                fontSize: '16px',
                marginBottom: '15px',
                textTransform: 'capitalize'
              }}>
                {weatherData.description}
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                fontSize: '14px',
                gap: '5px'
              }}>
                <MapPin size={16} />
                {weatherData.location}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Thermometer size={24} color="#4A9EFF" />
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    {weatherData.feelsLike}°C
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    Feels like
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Droplets size={24} color="#4A9EFF" />
                <div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    {weatherData.humidity}%
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    Humidity
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}