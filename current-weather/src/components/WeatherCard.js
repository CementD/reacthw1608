import "./WeatherCard.css";

export default function WeatherCard({ weather, theme, formatTime }) {
    return (
        <div className={`weather-card ${theme}`}>
            <div className="weather-main">
                <h1 className="temperature">{Math.round(weather.main.temp)}°C</h1>
                <p className="description">{weather.weather[0].description}</p>
                <h2 className="city">{weather.name}</h2>
                <p className="feels">
                    {Math.round(weather.main.temp_max)}°C / {Math.round(weather.main.temp_min)}°C
                    {" "}Feels like {Math.round(weather.main.feels_like)}°C
                </p>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <img src={`${process.env.PUBLIC_URL}/wind.png`} alt="Wind" />
                    <span>{weather.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                    <img src={`${process.env.PUBLIC_URL}/humidity.png`} alt="Humidity" />
                    <span>{weather.main.humidity}%</span>
                </div>
                <div className="detail-item">
                    <img src={`${process.env.PUBLIC_URL}/sunrise.png`} alt="Sunrise" />
                    <span>{formatTime(weather.sys.sunrise)}</span>
                </div>
                <div className="detail-item">
                    <img src={`${process.env.PUBLIC_URL}/sunset.png`} alt="Sunset" />
                    <span>{formatTime(weather.sys.sunset)}</span>
                </div>
            </div>
        </div>
    );
}