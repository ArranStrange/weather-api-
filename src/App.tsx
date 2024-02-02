import React, { useState } from "react";
import "./App.css";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { Clock } from "./components/Clock";

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
  const localtime = data?.location?.localtime || "";

  return (
    <div className="App">
      <SearchBar
        location={location}
        setLocation={setLocation}
        setData={setData}
        setSearchInputFocused={setSearchInputFocused}
      />
      <div className="weatherCardContainer">
        <WeatherCard
          searchInputFocused={searchInputFocused}
          data={data}
          location={location}
          localtime={localtime}
        />
      </div>
    </div>
  );
}

export default App;
