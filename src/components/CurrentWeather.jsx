import './CurrentWeather.css';
import { motion } from 'framer-motion';
import { WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { FaStar, FaRegStar } from 'react-icons/fa';

const CurrentWeather = ({ data, favorites, onToggleFavorite }) => {
    if (!data) return null;

    const { name, main = {}, weather = [{}], wind = {}, sys = {}, isForecast, minTemp } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    
    const baseCityName = name.split(' (')[0];
    const isFavorite = favorites.includes(baseCityName);

    const formatTime = (timeValue) => {
        if (!timeValue) return '';
        const dateObj = typeof timeValue === 'number' ? new Date(timeValue * 1000) : timeValue;
        return dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div 
            className="current-weather"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="city-header">
                <h2 className="city-name">{name}</h2>
                {!isForecast && (
                    <button 
                        className="favorite-toggle-button" 
                        onClick={() => onToggleFavorite(baseCityName)}
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                        {isFavorite ? <FaStar color="#ffc107" /> : <FaRegStar />}
                    </button>
                )}
            </div>
            
            <div className="weather-main">
                <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
                {isForecast ? ( <div className="temperature-forecast"> <span className="temp-max">↑{Math.round(main.temp)}°C</span> <span className="temp-min">↓{Math.round(minTemp)}°C</span> </div> ) : ( <p className="temperature">{Math.round(main.temp)}°C</p> )}
            </div>
            <p className="weather-description">{weather[0].description}</p>
            <div className="weather-details">
                <p className="detail-item"><WiThermometer /> S.Térmica: {Math.round(main.feels_like)}°C</p>
                <p className="detail-item"><WiHumidity /> Humedad: {main.humidity}%</p>
                <p className="detail-item"><WiStrongWind /> Viento: {wind.speed} m/s</p>
                {sys.sunrise && ( <p className="detail-item"><WiSunrise /> Amanecer: {formatTime(sys.sunrise)}</p> )}
                {sys.sunset && ( <p className="detail-item"><WiSunset /> Atardecer: {formatTime(sys.sunset)}</p> )}
            </div>
        </motion.div>
    );
};

export default CurrentWeather;