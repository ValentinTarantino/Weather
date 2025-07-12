import './Forecast.css';

const Forecast = ({ data, onDaySelect, selectedDate }) => {
    if (!data || data.length === 0) return null;

    const getDayName = (dateString) => {
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
    };

    return (
        <div className="forecast">
            <h3 className="forecast-title">Pronóstico 5 Días</h3>
            <div className="forecast-container">
                {data.map((item) => {
                    const iconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
                    const isActive = item.date === selectedDate;
                    
                    return (
                        <div 
                            className={`forecast-day ${isActive ? 'active' : ''}`}
                            key={item.date}
                            onClick={() => onDaySelect(item)}
                        >
                            <p className="day-name">{getDayName(item.date)}</p>
                            <img src={iconUrl} alt={item.description} className="forecast-icon" />
                            <p className="day-temp">
                                <span style={{ color: "#ff6584" }}>↑{Math.round(item.max)}°</span> / <span style={{ color: "#2196f3" }}>↓{Math.round(item.min)}°</span>
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;