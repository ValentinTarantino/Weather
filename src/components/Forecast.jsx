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
                    const iconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
                    return (
                        <div className="forecast-day" key={index}>
                            <p className="day-name">{getDayName(item.date)}</p>
                            <img src={iconUrl} alt={item.description} className="forecast-icon" />
                            <p className="day-info-row">
                                <span className="day-temp">
                                    <span style={{ color: "#ff6584" }}>↑{Math.round(item.max)}°C</span> / <span style={{ color: "#2196f3", fontWeight: 600 }}>↓{Math.round(item.min)}°C</span>
                                </span>
                                <span className="weather-description" style={{ fontSize: "0.95rem", margin: "0 8px" }}>{item.description}</span>
                                <span className="day-humidity" style={{ color: "#6ec6ff", fontWeight: 500 }}>
                                    Humedad: {item.humidity}%
                                </span>
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;