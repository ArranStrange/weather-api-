import { ChangeEvent, KeyboardEvent, useRef, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { WeatherData } from "../App";
import locationIcon from "../assets/Location Icon.png";
import pinIcon from "../assets/Pin Icon.png";
import addIcon from "../assets/Add Icon.png";

//Props Type Declaration
interface SearchBarProps {
  setSearchInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  pinCurrentWeather: () => void;
}

export function SearchBar(props: SearchBarProps) {
  //State
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  //API Call - with dependency of a URL
  const makeApiCall = (url: string) => {
    axios
      //get "WeatherData" declared in App.tsx from...
      .get<WeatherData>(url)
      //then response form Axios API call defined by following data.
      .then((response: AxiosResponse<WeatherData>) => {
        props.setData(response.data);
        props.setLocation("");
        //set is loading state
        setIsLoading(false);
        //set error stat
        setError(false);
      })
      //catch errors and display console error and set state
      .catch((error) => {
        console.error("API call Error", error);
        setIsLoading(false);
        //set error state
        setError(true);
        //search input focus to remove weather card in case of error
        props.setSearchInputFocused(true);
      });
  };

  //Search input
  const searchLocation = (event: KeyboardEvent<HTMLInputElement>) => {
    //listend to HTML input event, in this case location search
    //When enter is hit it constructs the url for an api call
    if (event.key === "Enter") {
      const dynamicUrl = `https://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${props.location}&aqi=no`;
      //this calls the function makeApiCall with the dependency of the newly created URL for the API call
      makeApiCall(dynamicUrl);

      // Blur the input field after pressing Enter
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  //Fetches current location using a API call from WeatherAPI.com
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      //Sets loading state before fetching data
      setIsLoading(true);
      //sets state of SearchInputFocused to hide Weather Cards
      props.setSearchInputFocused(true);
      //
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //finds current Lonitude and Latitude
          const { latitude, longitude } = position.coords;
          //Places found coordiantes into the URL
          const dynamicUrl = `https://api.weatherapi.com/v1/current.json?key=47fea2e61ff54bb7b04124827242501&q=${latitude},${longitude}&aqi=no`;
          makeApiCall(dynamicUrl); //uses the above URL to make the API call
          setIsLoading(false); //resets loading state
          props.setSearchInputFocused(false); // blurs the input once finished using to show hidden weather card
        },
        (error) => {
          //catches error and displays the following error in the console if any caught
          console.error("Error getting current location:", error);
        },

        {
          //sets high accuracy location finding off to speed up process
          enableHighAccuracy: false,
        }
      );
    }
  };

  //Use effect to run get current location on first app render
  useEffect(() => {
    setIsLoading(true);
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //function to set search input focus when input has been clicked
  const handleSearchInputFocus = () => {
    props.setSearchInputFocused(true);
  };

  //function to reset search input focus and blur the input of click off
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
        {/* <button className="pinButton" onClick={props.pinCurrentWeather}>
          {" "}
          <img className="locationIcon" src={pinIcon} alt="Pin Icon" />
        </button>
        <button className="addCardButton">
          <img className="addCardIcon" src={addIcon} alt="Add Card Icon" />
        </button> */}
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
