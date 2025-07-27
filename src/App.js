import { useState } from "react";
import FormSection from "./components/FormSection";
import MapSection from "./components/MapSection";

const App = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });

  return (
    <div className="flex h-screen w-screen">
      <FormSection setLocation={setLocation} />
      <MapSection lat={location.lat} lng={location.lng} />
    </div>
  );
};

export default App;
