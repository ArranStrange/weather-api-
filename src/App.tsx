import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import locationIcon from "./assets/Location Icon.png";
import pinIcon from "./assets/Pin Icon.png";
import addIcon from "./assets/Add Icon.png";
import "./App.css";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
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

  const getCurrentLocation = () => {
    console.log(navigator);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dynamicUrl = `http://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${latitude},${longitude}&aqi=no`;

          axios
            .get<WeatherData>(dynamicUrl)
            .then((response: AxiosResponse<WeatherData>) => {
              setData(response.data);
              setLocation(response.data.location.name);
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

  useEffect(() => {
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
              <div className="optionsButtons">
                <button className="locationButton" onClick={getCurrentLocation}>
                  <img
                    className="locationIcon"
                    src={locationIcon}
                    alt="Location Icon"
                  />
                </button>
                <button className="pinButton">
                  <img className="locationIcon" src={pinIcon} alt="Pin Icon" />
                </button>
                <button className="addCardButton">
                  <img
                    className="addCardIcon"
                    src={addIcon}
                    alt="Add Card Icon"
                  />
                </button>
              </div>
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
              <div className="localTime">
                <h3>{data?.location.localtime?.split(" ")[1]}</h3>
                <h5>Local Time</h5>
              </div>
              <div className="info">
                {/* <h3>{data?.location.region}</h3> */}
                <h4>{data?.location.country}</h4>
                <div className="city">
                  <h2>{data?.location.name || location}</h2>
                </div>

                <h1>{data?.current.temp_c}°C</h1>
                <div className="realfeels">{data?.current.feelslike_c}°C</div>
                <div className="realfeels">Feels Like</div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="visability">{data?.current.vis_miles} Miles</div>
            <div className="humidity">{data?.current.humidity}%</div>
            <div className="windspeed">{data?.current.wind_mph}MPH</div>
            <div className="visability">Visability</div>
            <div className="humidity">Humidity</div>
            <div className="windspeed">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
