import SunMoonClock from "../assets/Backgrounds/Time 0.png";

//props from app.tsx extracting local time from API and passing searchInputFocus function
interface ClockProps {
  localtime: string;
  searchInputFocused: boolean;
}

export function Clock(props: ClockProps) {
  //function to
  const imageRotation = () => {
    console.log(props.localtime);
    // Check if props.localtime is undefined or not a string
    if (!props.localtime || typeof props.localtime !== "string") {
      return null; //returns null if local time is invalid
    }
    // Split localtime into date and time
    const timeComponents = props.localtime.split(" ");

    // Check if timeComponents array has expected format
    if (timeComponents.length !== 2) {
      return null; //returns null is local time is invalid
    }

    // Extract hour from time component and convert to number
    const hour = parseInt(timeComponents[1].split(":")[0], 10); // Provide index 0 to get the hours

    // Check if hour is a valid number
    if (isNaN(hour)) {
      return null;
    }

    console.log(hour);

    if (hour === 0) {
      return null; // If localtime is 00:00, return null
    }

    // Calculate rotation based on the hour
    const rotationDegree = hour * 15; // Assuming each hour corresponds to a 30-degree rotation
    return `rotate(${rotationDegree}deg)`;
  };

  const rotationStyle = imageRotation();

  return (
    //renders clock face with rotation based on hour if searchInputFocus is false
    !props.searchInputFocused && (
      <img
        className="clock"
        src={SunMoonClock}
        alt="Sun & Moon Clock"
        style={{
          transform: rotationStyle ? rotationStyle : undefined,
          transition: "transform 1s ease",
        }}
      />
    )
  );
}
