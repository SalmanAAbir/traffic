"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const dhaka: [number, number] = [23.8103, 90.4125];

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const icon =
  typeof window !== "undefined"
    ? L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    : undefined;

export default function ReportMap({
  lat,
  lng,
  className = "",
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  const center: [number, number] = [lat, lng];

  return (
    <div
      className={`relative z-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}
      style={{ minHeight: 220 }}
    >
      <MapContainer
        center={Number.isFinite(lat) && Number.isFinite(lng) ? center : dhaka}
        zoom={16}
        className="h-full min-h-[220px] w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        {icon ? <Marker position={center} icon={icon} /> : null}
      </MapContainer>
    </div>
  );
}
