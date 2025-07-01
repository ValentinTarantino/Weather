import { useState } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import './App.css';

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast(null);

    try {
      // Petición para el clima actual
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (!currentWeatherResponse.ok) throw new Error('Ciudad no encontrada.');
      const currentWeatherData = await currentWeatherResponse.json();
      setCurrentWeather(currentWeatherData);

      // Petición para el pronóstico de 5 días
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      const forecastData = await forecastResponse.json();

      // Agrupar por día y calcular min/max
      const dailyData = {};
      forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = {
            min: item.main.temp_min,
            max: item.main.temp_max,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            date: date,
            humidities: [item.main.humidity], //  humedades
          };
        } else {
          dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
          dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
          dailyData[date].humidities.push(item.main.humidity); // Agrega humedad
        }
      });

      const today = new Date().toISOString().split('T')[0];
      // Calcula el promedio de humedad para cada día
      const dailyForecast = Object.values(dailyData)
        .filter(day => day.date !== today)
        .slice(0, 5)
        .map(day => ({
          ...day,
          humidity: Math.round(
            day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length
          ),
        }));

      setForecast(dailyForecast);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <div className="weather-card">
        <h1>App del Clima</h1>
        <SearchBar onSearch={fetchWeatherData} />
        
        {loading && <Loader />}
        {error && <p className="error-message">{error}</p>}
        
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}

        {!loading && !error && !currentWeather && (
          <p className="welcome-message">
            Escribe el nombre de una ciudad para ver el pronóstico.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;