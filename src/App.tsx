import React, { useState } from "react";
import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import pinIcon from "./assets/Pin Icon.png";

export interface WeatherData {
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
  const [searchInputFocused, setSearchInputFocused] = useState<boolean>(false);
  const [pinnedWeatherCards, setPinnedWeatherCards] = useState<WeatherData[]>(
    []
  );

  const localtime = data?.location?.localtime || "";

  const pinCurrentWeather = () => {
    if (data) {
      setPinnedWeatherCards((prevPinnedCards) => [...prevPinnedCards, data]);
    }
  };

  return (
    <div className="App">
      <SearchBar
        location={location}
        setLocation={setLocation}
        setData={setData}
        setSearchInputFocused={setSearchInputFocused}
        pinCurrentWeather={pinCurrentWeather}
      />
      <div className="weatherCardContainer">
        <WeatherCard
          searchInputFocused={searchInputFocused}
          data={data}
          location={location}
          localtime={localtime}
        />
        <div className="PinnedWeatherCards">
          {pinnedWeatherCards.map((pinnedData, index) => (
            <WeatherCard
              key={`pinned-card-${index}`}
              searchInputFocused={searchInputFocused}
              data={pinnedData}
              location={pinnedData.location.name}
              localtime={pinnedData.location.localtime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
