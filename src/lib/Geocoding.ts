// lib/Geocoding.ts

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
}

// Call Google Maps Geocoding API to convert address → coordinates
export async function geocodeAddress(address: string): Promise<GeocodingResult | { error: string; message: string }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return { error: "missing_api_key", message: "Google Maps API key is missing" };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" || !data.results.length) {
      return { error: data.status, message: data.error_message || "No results found" };
    }

    const result = data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
    };
  } catch (err: any) {
    return { error: "network_error", message: err.message || "Failed to fetch geocoding results" };
  }
}

// Use browser geolocation API → returns current coordinates
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | { error: string; message: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: "unsupported", message: "Geolocation is not supported in this browser" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        resolve({ error: "geolocation_failed", message: err.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
