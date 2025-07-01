import './CurrentWeather.css';

const CurrentWeather = ({ data }) => {
    if (!data) return null;

    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return (
        <div className="current-weather">
            <h2 className="city-name">{name}</h2>
            <div className="weather-main">
                <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
                <p className="temperature">{Math.round(main.temp)}°C</p>
            </div>
            <p className="weather-description">{weather[0].description}</p>
            <div className="weather-details">
                <p>S.Térmica: {Math.round(main.feels_like)}°C</p>
                <p>Humedad: {main.humidity}%</p>
                <p>Viento: {wind.speed.toFixed(1)} m/s</p>
            </div>
        </div>
    );
};

export default CurrentWeather;