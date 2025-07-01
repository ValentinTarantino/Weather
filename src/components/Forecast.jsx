import './Forecast.css';

const Forecast = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Función para obtener el nombre del día
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
    };

    return (
        <div className="forecast">
            <h3 className="forecast-title">Pronóstico Próximos 5 Días</h3>
            <div className="forecast-container">
                {data.map((item, index) => {
                    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                    return (
                        <div className="forecast-day" key={index}>
                            <p className="day-name">{getDayName(item.dt_txt)}</p>
                            <img src={iconUrl} alt={item.weather[0].description} className="forecast-icon" />
                            <p className="day-temp">{Math.round(item.main.temp)}°C</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;