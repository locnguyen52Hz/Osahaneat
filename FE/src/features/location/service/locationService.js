// services/locationService.js
export async function reverseGeocode(lat, lng, signal) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    { signal }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch address");
  }

  return res.json();
}