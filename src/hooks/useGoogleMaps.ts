import { useEffect, useState } from "react";

export const useGoogleMaps = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCmx5cVEoHlMFGMxZORP6i1karmdK7gZq4&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => {
      console.error("Google Maps JS failed to load.");
      setLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
};
