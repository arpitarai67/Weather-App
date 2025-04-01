import React, { useState } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("/default.jpg"); // Default background
  const [textColor, setTextColor] = useState("white"); // Default text color

  const API_KEY = "4202b9fcdaf0befd3439ae91447bc921"; // Replace with your API key

  const fetchWeather = async () => {
    if (!city) return;
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      updateBackground(response.data);
    } catch (error) {
      setError("City not found! Please enter a valid city name.");
      setWeather(null);
      setBackgroundImage("/default.jpg"); // Reset to default background
      setTextColor("white"); // Reset text color
    }
  };

  // Function to get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Function to check if it's day or night
  const isDaytime = (weatherData) => {
    const { dt, sys } = weatherData; // dt = current time, sys.sunrise & sys.sunset = sunrise & sunset times
    return dt >= sys.sunrise && dt <= sys.sunset;
  };

  // Function to update background and text color based on weather and time of day
  const updateBackground = (weatherData) => {
    const weatherCondition = weatherData.weather[0].main;
    const dayTime = isDaytime(weatherData); // true → Day, false → Night

    const backgrounds = {
      Clear: {
        day: { img: "/sunny.webp", color: "black" },
        night: { img: "/clear-night.jpeg", color: "white" },
      },
      Clouds: {
        day: { img: "/cloudy.webp", color: "black" },
        night: { img: "/cloudy-night.webp", color: "white" },
      },
      Rain: {
        day: { img: "/rain.jpeg", color: "white" },
        night: { img: "/rainy-night.jpeg", color: "white" },
      },
      Thunderstorm: {
        day: { img: "/storm.webp", color: "yellow" },
        night: { img: "/storm-night.webp", color: "yellow" },
      },
      Snow: {
        day: { img: "/snowy.webp", color: "black" },
        night: { img: "/snowy-night.jpeg", color: "black" },
      },
      Mist: {
        day: { img: "/mist.jpeg", color: "black" },
        night: { img: "/mist-night.webp", color: "black" },
      },
      Haze: {
        day: { img: "/haze.jpeg", color: "black" },
        night: { img: "/haze-night.webp", color: "black" },
      },
      Fog: {
        day: { img: "/fog.jpeg", color: "black" },
        night: { img: "/fog-night.webp", color: "white" },
      },
    };

    const selected = backgrounds[weatherCondition] || {
      day: { img: "/default.jpg", color: "white" },
      night: { img: "/default.jpg", color: "white" },
    };

    const { img, color } = dayTime ? selected.day : selected.night;
    setBackgroundImage(img);
    setTextColor(color);
  };

  return (
    <div
      className="weather-container"
      style={{
        background: `url(${backgroundImage}) no-repeat center center/cover`,
        color: textColor,
        transition: "background 1s ease-in-out, color 0.5s ease-in-out",
      }}
    >
      <h1>Weather App</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="weather-icon">
            <img
              src={getWeatherIconUrl(weather.weather[0].icon)}
              alt={weather.weather[0].description}
            />
          </div>
          <p className="temp">{weather.main.temp}°C</p>
          <p className="condition">{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
