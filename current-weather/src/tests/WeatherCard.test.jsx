import { render, screen } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";

const mockWeather = {
    main: { temp: 20, temp_max: 25, temp_min: 15, feels_like: 18, humidity: 60 },
    weather: [{ description: "clear sky" }],
    name: "Kyiv",
    wind: { speed: 5 },
    sys: { sunrise: 1693113600, sunset: 1693160400 }
};

const formatTime = () => "06:00";

test("render day weather", () => {
    render(<WeatherCard weather={mockWeather} theme="day" formatTime={formatTime} />);

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/20°C/i)).toBeInTheDocument();
});
