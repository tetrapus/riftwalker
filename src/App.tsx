import useGeolocation from "react-hook-geolocation";
import { Map } from "./Map";

function App() {
  const geolocation = useGeolocation();

  if (!geolocation.latitude) {
    return <div>Loading...</div>;
  }

  return (
    <Map
      geolocation={{
        lat: geolocation.latitude,
        lon: geolocation.longitude,
      }}
    />
  );
}

export default App;
