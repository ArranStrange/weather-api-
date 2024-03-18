import React, { useState } from "react";
import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import pinIcon from "./assets/Pin Icon.png";

export interface WeatherData {
  //API response type declarations - pulled from weatherAPO.com
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
  // State
  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>("");
  const [searchInputFocused, setSearchInputFocused] = useState<boolean>(false);
  const [pinnedWeatherCards, setPinnedWeatherCards] = useState<WeatherData[]>(
    []
  );

  //local time pulled from API
  const localtime = data?.location?.localtime || "";

  //Pin Weather Card - Currently not in use
  const pinCurrentWeather = () => {
    if (data) {
      setPinnedWeatherCards((prevPinnedCards) => [...prevPinnedCards, data]);
    }
  };

  return (
    <div className="App">
      <SearchBar
        //Props
        location={location}
        setLocation={setLocation}
        setData={setData}
        setSearchInputFocused={setSearchInputFocused}
        pinCurrentWeather={pinCurrentWeather}
      />
      <div className="weatherCardContainer">
        <WeatherCard
          //Props
          searchInputFocused={searchInputFocused}
          data={data}
          location={location}
          localtime={localtime}
        />
        <div className="PinnedWeatherCards">
          {pinnedWeatherCards.map((pinnedData, index) => (
            //Map overs pinned weather cards and render componets below
            <WeatherCard
              //Props
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
