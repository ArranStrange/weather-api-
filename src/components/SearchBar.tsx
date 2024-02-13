import { ChangeEvent, KeyboardEvent, useRef, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { WeatherData } from "../App";
import locationIcon from "../assets/Location Icon.png";
import pinIcon from "../assets/Pin Icon.png";
import addIcon from "../assets/Add Icon.png";

interface SearchBarProps {
  setSearchInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  pinCurrentWeather: () => void;
}

export function SearchBar(props: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const makeApiCall = (url: string) => {
    axios
      .get<WeatherData>(url)
      .then((response: AxiosResponse<WeatherData>) => {
        props.setData(response.data);
        props.setLocation("");
        setIsLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.error("API call Error", error);
        setIsLoading(false);
        setError(true);
        props.setSearchInputFocused(true);
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
      setIsLoading(true);
      props.setSearchInputFocused(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dynamicUrl = `https://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${latitude},${longitude}&aqi=no`;
          makeApiCall(dynamicUrl);
          setIsLoading(false);
          props.setSearchInputFocused(false);
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
        <button className="pinButton" onClick={props.pinCurrentWeather}>
          {" "}
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
      {isLoading && <p className="Loading">Finding Location...</p>}
      {error && <p className="Error">...Opps! We Can't Find That Location</p>}
    </div>
  );
}
