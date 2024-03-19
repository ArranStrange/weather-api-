import SunMoonClock from "../assets/Backgrounds/Time 0.png";

interface ClockProps {
  localtime: string;
  searchInputFocused: boolean;
}

export function Clock(props: ClockProps) {
  const imageRotation = () => {
    console.log(props.localtime);

    // Check if props.localtime is undefined or not a string
    if (!props.localtime || typeof props.localtime !== "string") {
      return null;
    }

    const timeComponents = props.localtime.split(" ");

    // Check if timeComponents array has expected format
    if (timeComponents.length !== 2) {
      return null;
    }

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
