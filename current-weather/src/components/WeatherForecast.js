import { useState, useRef } from "react";
import WeatherCard from "./WeatherCard";
import WeatherForecastDays from "./WeatherForecastDays";
import "./WeatherForecast.css";

export default function WeatherForecast() {
    const API_KEY = "128d58528d1b3408de7b7b7111fadb72";

    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState("day");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const abortRef = useRef(null);

    const fetchWeather = async (cityName, countryCode) => {
        setLoading(true);
        setError(null);

        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}&units=metric`,
                { signal: ctrl.signal }
            );
            if (!res.ok) throw new Error(`HTTP: ${res.status}`);

            const data = await res.json();
            setWeather(data);
            setCountry(data.sys.country);

            const now = Date.now() / 1000;
            setTheme(now > data.sys.sunrise && now < data.sys.sunset ? "day" : "night");

            const forecastRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${countryCode}&appid=${API_KEY}&units=metric`,
                { signal: ctrl.signal }
            );
            if (!forecastRes.ok) throw new Error(`Forecast HTTP: ${forecastRes.status}`);

            const forecastData = await forecastRes.json();
            const daily = {};
            forecastData.list.forEach((item) => {
                const date = new Date(item.dt * 1000).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                });
                if (!daily[date]) {
                    daily[date] = {
                        temp_min: item.main.temp_min,
                        temp_max: item.main.temp_max,
                        humidity: item.main.humidity
                    };
                } else {
                    daily[date].temp_min = Math.min(daily[date].temp_min, item.main.temp_min);
                    daily[date].temp_max = Math.max(daily[date].temp_max, item.main.temp_max);
                    daily[date].humidity = Math.round(
                        (daily[date].humidity + item.main.humidity) / 2
                    );
                }
            });

            setForecast(
                Object.entries(daily).map(([date, values]) => ({
                    date,
                    ...values
                }))
            );
        } catch (err) {
            if (err.name !== "AbortError") setError(err.message);
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    };

    const getWeather = async (e) => {
        e.preventDefault();
        await fetchWeather(city, country);
    };

    function formatTime(unixTime) {
        const date = new Date(unixTime * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const addFavorite = () => {
        if (weather && !favorites.find((f) => f.id === weather.id)) {
            const newFavorites = [...favorites, { id: weather.id, name: weather.name, country }];
            setFavorites(newFavorites);
        }
    };

    const removeFavorite = (id) => {
        setFavorites(favorites.filter((f) => f.id !== id));
    };

    const handleFavoriteClick = async (f) => {
        setCity(f.name);
        setCountry(f.country);
        await fetchWeather(f.name, f.country);
    };

    return (
        <div className={`app ${theme}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>

            <div className={`sidebar ${sidebarOpen ? "open" : ""} ${theme}`}>
                <h3>Favorite cities</h3>
                {favorites.length === 0 ? (
                    <p>No favorites</p>
                ) : (
                    <ul>
                        {favorites.map((f) => (
                            <li key={f.id} onClick={() => handleFavoriteClick(f)}>
                                {f.name}, {f.country}
                                <button
                                    className="remove-btn"
                                    onClick={() => {
                                        removeFavorite(f.id);
                                    }}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="main-content">
                <h2>Weather App</h2>
                <form onSubmit={getWeather}>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City..."
                    />
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country code..."
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Show"}
                    </button>
                </form>

                {error ? <p className="error">{error}</p> :
                 weather ? (
                    <>
                        <WeatherCard weather={weather} theme={theme} formatTime={formatTime} />
                        <button
                            className={`fav-btn ${favorites.find((f) => f.id === weather.id) ? "active" : ""}`}
                            onClick={addFavorite}
                        >
                            ☆ Favorite
                        </button>
                        {forecast.length > 0 && <WeatherForecastDays forecast={forecast} />}
                    </>
                ) : <></>}
            </div>
        </div>
    );
}
