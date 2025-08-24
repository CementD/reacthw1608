import "./WeatherForecastDays.css";

export default function WeatherForecastDays({ forecast }) {
    return (
        <div className="forecast-card">
            <h3>Next Days</h3>
            <div className="forecast-list">
                {forecast.map((day, index) => (
                    <div className="forecast-item" key={index}>
                        <p className="forecast-date">{day.date}</p>
                        <p className="forecast-temp">
                            {Math.round(day.temp_min)}°C / {Math.round(day.temp_max)}°C
                        </p>
                        <p className="forecast-humidity">Humidity: {day.humidity}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}