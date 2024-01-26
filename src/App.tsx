import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import "./App.css";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    humidity: number;
    cloud: number;
    vis_miles: number;
  };
}

function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const dynamicUrl = `http://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${latitude},${longitude}&aqi=no`;

            axios
              .get<WeatherData>(dynamicUrl)
              .then((response: AxiosResponse<WeatherData>) => {
                setData(response.data);
              })
              .catch((error) => {
                console.error("Error fetching weather data:", error);
              });
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      }
    };
    getCurrentLocation();
  }, []);

  const searchLocation = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const dynamicUrl = `http://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${location}&aqi=no`;

      axios
        .get<WeatherData>(dynamicUrl)
        .then((response: AxiosResponse<WeatherData>) => {
          setData(response.data);
          console.log(response.data);
        });

      setLocation("");
    }
  };

  return (
    <>
      <div className="App">
        <div className="weatherCard">
          <div className="header">
            <div className="options">
              <input
                type="text"
                className="location"
                value={location}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setLocation(event.target.value)
                }
                placeholder="enter location"
                onKeyPress={searchLocation}
              />
            </div>
            <div className="container">
              <img
                className="responsiveIcons"
                src={data?.current.condition.icon}
                alt="Current Condition Icon"
              />
              <div className="info">
                <h2>{data?.location.name || location}</h2>
                <h3>{data?.location.region}</h3>
                <h3>{data?.location.country}</h3>
                <h1>{data?.current.temp_c}°C</h1>
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="realfeels">{data?.current.feelslike_c}°C</div>
            <div className="humidity">{data?.current.humidity}%</div>
            <div className="windspeed">{data?.current.wind_mph}MPH</div>
            <div className="realfeels">Feels Like</div>
            <div className="humidity">Humidity</div>
            <div className="windspeed">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
