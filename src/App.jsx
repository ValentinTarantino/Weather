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
      
      // Filtro para obtener un pronóstico por día (a mediodía)
      const dailyForecast = forecastData.list.filter(item => 
        item.dt_txt.includes("12:00:00")
      );
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