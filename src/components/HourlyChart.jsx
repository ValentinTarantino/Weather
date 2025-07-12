import './HourlyChart.css';
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip">
                <p className="tooltip-time">{data.time}</p>
                <p className="tooltip-temp">{`${Math.round(data.main.temp)}°C`}</p>
                <p className="tooltip-desc">{data.weather[0].description}</p>
            </div>
        );
    }
    return null;
};

const HourlyChart = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }

    // Preparamos los datos para el gráfico, formateando la hora.
    const chartData = data.map(item => ({
        ...item,
        time: item.dt_txt === "Ahora" ? "Ahora" : item.dt_txt.split(' ')[1].substring(0, 5)
    }));

    // Encontramos la temperatura mínima y máxima para ajustar el eje Y
    const temps = chartData.map(item => item.main.temp);
    const yMin = Math.floor(Math.min(...temps) - 2);
    const yMax = Math.ceil(Math.max(...temps) + 2);

    return (
        <div className="hourly-chart">
            <h3 className="chart-title">Pronóstico Próximas Horas</h3>
            <ResponsiveContainer width="100%" aspect={2.5}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
                        tickLine={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
                    />
                    <YAxis
                        domain={[yMin, yMax]}
                        tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
                        tickLine={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
                        unit="°"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                    <Line
                        type="monotone"
                        dataKey="main.temp"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#8884d8' }}
                        activeDot={{ r: 6, stroke: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HourlyChart;