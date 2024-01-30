import { WeatherData } from "../App";
import SunnyBackground from "../assets/Backgrounds/Sunny.png";
import RainBackground from "../assets/Backgrounds/RainBackground.png";
import LightRainBackground from "../assets/Backgrounds/LightRain.png";
import PartlyCloudyBackground from "../assets/Backgrounds/PartlyCloudy.png";
import OvercastBackground from "../assets/Backgrounds/Cloudy.png";
import MistBackground from "../assets/Backgrounds/Mist.png";

interface WeatherCardProps {
  searchInputFocused: boolean;
  data: WeatherData | null;
  location: string;
}

export function WeatherCard(props: WeatherCardProps) {
  const getBackgroundImage = () => {
    console.log(props.data?.current);
    if (props.data?.current) {
      const conditionText = props.data.current.condition.text
        .toLowerCase()
        .replace(/\s/g, "");
      console.log(conditionText);

      // Map condition text to corresponding image URLs
      const backgroundImageMap: Record<string, string> = {
        // overcast: `url(${OvercastBackground})`,
        clear: `url(${SunnyBackground})`,
        // snow: `url(${SnowBackground})`,
        lightrain: `url(${LightRainBackground})`,
        partlycloudy: `url(${PartlyCloudyBackground})`,
        moderaterain: `url(${RainBackground})`,
        sunny: `url(${SunnyBackground})`,
        overcast: `url(${OvercastBackground})`,
        mist: `url(${MistBackground})`,
        rain: `url(${RainBackground})`,
      };
      return {
        backgroundImage:
          backgroundImageMap[conditionText] || backgroundImageMap.clear,
      };
    }
    return {}; // Default background if the data is not available
  };

  return (
    !props.searchInputFocused && (
      <div className="weatherCard">
        {props.data?.current && (
          <div className="header" style={getBackgroundImage()}>
            <div className="container">
              <div className="localTime">
                <h3>{props.data?.location.localtime?.split(" ")[1]}</h3>
              </div>

              {/* <h3>{props.data?.location.region}</h3> */}
              <h4 className="Country">{props.data?.location.country}</h4>
              <img
                className="responsiveIcons"
                src={props.data?.current.condition.icon}
                alt="Current Condition Icon"
              />
              <div className="city">
                <h2>{props.data?.location.name || props.location}</h2>
              </div>

              <h1 className="temp">{props.data?.current.temp_c}°C</h1>
            </div>
            <div className="realfeels">
              {props.data?.current.feelslike_c}°C
              <h5>Feels Like</h5>
            </div>
          </div>
        )}

        {props.data?.current && (
          <div className="footer">
            <div className="visability">
              {props.data?.current.vis_miles} Miles
            </div>
            <div className="humidity">{props.data?.current.humidity}%</div>
            <div className="windspeed">{props.data?.current.wind_mph}MPH</div>
            <div className="visability">Visability</div>
            <div className="humidity">Humidity</div>
            <div className="windspeed">Wind Speed</div>
          </div>
        )}
      </div>
    )
  );
}
