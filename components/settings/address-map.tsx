"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  address: string;
}

export function AddressMap({ address }: Props) {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchCoords = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );

      const data = await res.json();

      if (data.length) {
        setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    };

    fetchCoords();
  }, [address]);

  if (!coords)
    return (
      <div className="h-96 flex items-center justify-center">
        Loading map...
      </div>
    );

  const icon = new Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer
      center={coords as LatLngExpression}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coords as LatLngExpression} icon={icon}>
        <Popup>{address}</Popup>
      </Marker>
      <ZoomControl position="topright" />
    </MapContainer>
  );
}
