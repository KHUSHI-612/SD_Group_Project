export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function getDistanceKm(
  pointA: Coordinates,
  pointB: Coordinates
): number {
  const earthRadiusKm = 6371;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const latDiff = toRadians(pointB.latitude - pointA.latitude);
  const lngDiff = toRadians(pointB.longitude - pointA.longitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(pointA.latitude)) *
      Math.cos(toRadians(pointB.latitude)) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        reject(new Error("Location permission denied."));
      }
    );
  });
}

export function openGoogleMapsRoute(
  origin: Coordinates,
  destination: Coordinates
): void {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`;

  window.open(url, "_blank", "noopener,noreferrer");
}