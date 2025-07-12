import { useState } from 'react';
import SunCalc from 'suncalc';
export const useWeather = () => {
    // ESTADOS
    // Todos los estados relacionados con los datos del clima se definen aquí dentro.
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [fullForecastList, setFullForecastList] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Constantes y funciones auxiliares
    const API_KEY = import.meta.env.VITE_API_KEY;
    const getTodayDateString = () => new Date().toISOString().split('T')[0];
    const fetchWeatherData = async (city) => {
        setLoading(true);
        setError(null);
        setCurrentWeather(null);
        setForecast(null);
        setHourlyForecast(null);
        setSelectedDayData(null);
        setFullForecastList(null);
        setSelectedDate(null);
        try {
            const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`);
            if (!currentWeatherResponse.ok) throw new Error('Ciudad no encontrada.');
            const currentWeatherData = await currentWeatherResponse.json();
            
            setCurrentWeather(currentWeatherData);
            setSelectedDayData(currentWeatherData);
            setSelectedDate(getTodayDateString());

            const { lat, lon } = currentWeatherData.coord;

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`);
            const forecastData = await forecastResponse.json();
            
            setFullForecastList(forecastData.list);

            const nowItem = { dt_txt: "Ahora", main: { temp: currentWeatherData.main.temp }, weather: [{ icon: currentWeatherData.weather[0].icon, description: currentWeatherData.weather[0].description }] };
            const nextHours = forecastData.list.slice(0, 7);
            setHourlyForecast([nowItem, ...nextHours]);

            const dailyData = {};
            forecastData.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                if (!dailyData[date]) {
                    dailyData[date] = { min: item.main.temp_min, max: item.main.temp_max, icon: item.weather[0].icon, description: item.weather[0].description, date: date, humidities: [item.main.humidity], feels_likes: [item.main.feels_like], winds: [item.wind.speed] };
                } else {
                    dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
                    dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
                    if (item.weather[0].icon.includes('d') && dailyData[date].icon.includes('n')) {
                        dailyData[date].icon = item.weather[0].icon;
                        dailyData[date].description = item.weather[0].description;
                    }
                    dailyData[date].humidities.push(item.main.humidity);
                    dailyData[date].feels_likes.push(item.main.feels_like);
                    dailyData[date].winds.push(item.wind.speed);
                }
            });
            
            const dailyForecast = Object.values(dailyData).slice(0, 5).map(day => {
                const avgReducer = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
                const dayDate = new Date(day.date + 'T12:00:00');
                const sunTimes = SunCalc.getTimes(dayDate, lat, lon);
                return { 
                    ...day, 
                    humidity: Math.round(avgReducer(day.humidities)), 
                    feels_like: Math.round(avgReducer(day.feels_likes)), 
                    wind_speed: parseFloat(avgReducer(day.winds).toFixed(1)),
                    sunrise: sunTimes.sunrise,
                    sunset: sunTimes.sunset
                };
            });
            setForecast(dailyForecast);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDaySelect = (dayData) => {
        setSelectedDate(dayData.date);
        const date = new Date(dayData.date + 'T12:00:00');
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const normalizedData = {
            name: `${currentWeather.name} (${dayName})`,
            main: { temp: dayData.max, feels_like: dayData.feels_like, humidity: dayData.humidity },
            weather: [{ description: dayData.description, icon: dayData.icon }],
            wind: { speed: dayData.wind_speed },
            sys: { sunrise: dayData.sunrise, sunset: dayData.sunset },
            isForecast: true,
            minTemp: dayData.min,
        };
        setSelectedDayData(normalizedData);
        if (fullForecastList) {
            const dayHourlyData = fullForecastList.filter(item => item.dt_txt.startsWith(dayData.date));
            setHourlyForecast(dayHourlyData);
        }
    };

    const handleShowCurrent = () => {
        setSelectedDate(getTodayDateString());
        setSelectedDayData(currentWeather);
        if (fullForecastList && currentWeather) {
            const nowItem = { dt_txt: "Ahora", main: { temp: currentWeather.main.temp }, weather: [{ icon: currentWeather.weather[0].icon, description: currentWeather.weather[0].description }] };
            const nextHours = fullForecastList.slice(0, 7);
            setHourlyForecast([nowItem, ...nextHours]);
        }
    };
    return {
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
    };
};