import { render, screen } from "@testing-library/react";
import WeatherForecast from "../components/WeatherForecast";

test("render app title", () => {
    render(<WeatherForecast />);
    expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
});
