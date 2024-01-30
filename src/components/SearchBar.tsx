import locationIcon from "../assets/Location Icon.png";
import pinIcon from "../assets/Pin Icon.png";
import addIcon from "../assets/Add Icon.png";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { WeatherData } from "../App";

interface SearchBarProps {
  setSearchInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  location: string;
}

export function SearchBar(props: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const makeApiCall = (url: string) => {
    axios.get<WeatherData>(url).then((response: AxiosResponse<WeatherData>) => {
      props.setData(response.data);
      props.setLocation("");
      setIsLoading(false);
    });
  };

  const searchLocation = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const dynamicUrl = `https://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${props.location}&aqi=no`;

      makeApiCall(dynamicUrl);

      // Blur the input field after pressing Enter
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dynamicUrl = `https://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${latitude},${longitude}&aqi=no`;
          makeApiCall(dynamicUrl);
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
        {
          enableHighAccuracy: false,
        }
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchInputFocus = () => {
    props.setSearchInputFocused(true);
  };

  const handleSearchInputBlur = () => {
    props.setSearchInputFocused(false);
    setIsLoading(false);
  };

  return (
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
          <img className="addCardIcon" src={addIcon} alt="Add Card Icon" />
        </button>
      </div>
      <input
        type="text"
        className="location"
        value={props.location}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.setLocation(event.target.value)
        }
        placeholder="enter location"
        onKeyPress={searchLocation}
        onFocus={handleSearchInputFocus}
        onBlur={handleSearchInputBlur}
        ref={inputRef} // Assign the ref to the input element
      />
      {isLoading && <p className="loading">Loading...</p>}
    </div>
  );
}
