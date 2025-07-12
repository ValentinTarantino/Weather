import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather'; 
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import HourlyChart from './components/HourlyChart';
import FavoriteCities from './components/FavoriteCities';
import Loader from './components/Loader';
import './App.css';

const App = () => {
  const {
    currentWeather,
    forecast,
    hourlyForecast,
    selectedDayData,
    selectedDate,
    loading,
    error,
    fetchWeatherData,
    handleDaySelect,
    handleShowCurrent
  } = useWeather();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('weatherAppFavorites'));
      if (storedFavorites) { setFavorites(storedFavorites); }
    } catch (error) { console.error("Error al cargar favoritos de localStorage:", error); }
  }, []);

  useEffect(() => {
    localStorage.setItem('weatherAppFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cityName) => {
    if (favorites.includes(cityName)) { setFavorites(favorites.filter(fav => fav !== cityName)); } 
    else { setFavorites([...favorites, cityName]); }
  };

  const removeFavorite = (cityName) => {
    setFavorites(favorites.filter(fav => fav !== cityName));
  };
  
  return (
    <div className="weather-app">
      <div className="weather-card">
        <h1>App del Clima</h1>
        <FavoriteCities favorites={favorites} onSelectCity={fetchWeatherData} onRemoveCity={removeFavorite} />
        <SearchBar onSearch={fetchWeatherData} />

        {loading && <Loader />}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && currentWeather && (
          <div>
            {selectedDayData.isForecast && (
              <button onClick={handleShowCurrent} className="show-today-button">
                ← Volver a Hoy
              </button>
            )}
            
            <CurrentWeather
              data={selectedDayData}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {hourlyForecast && <HourlyChart data={hourlyForecast} />}
            
            <Forecast
              data={forecast}
              onDaySelect={handleDaySelect}
              selectedDate={selectedDate}
            />
          </div>
        )}

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