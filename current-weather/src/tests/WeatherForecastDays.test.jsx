import { render, screen } from "@testing-library/react";
import WeatherForecastDays from "../components/WeatherForecastDays";

test("render forecast list", () => {
    const mockForecast = [
        { date: "Mon 26 Aug", temp_min: 15, temp_max: 25, humidity: 55 },
        { date: "Tue 27 Aug", temp_min: 16, temp_max: 24, humidity: 60 }
    ];

    render(<WeatherForecastDays forecast={mockForecast} />);

    expect(screen.getByText("Mon 28 Aug")).toBeInTheDocument();
    expect(screen.getByText(/15°C \/ 25°C/)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 55%/)).toBeInTheDocument();
});
