import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import parkingData from "../mock/parkingData.json";

// Ajuste do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Ícones personalizados por status da vaga
const greenIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/map-pins-2/256/13-512.png", // original
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ObjectsMap() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        () => {
          console.error("Erro ao obter localização");
          setPosition([-19.53645306343535, -40.62907357525347]);
        }
      );
    } else {
      setPosition([-19.53645306343535, -40.62907357525347]);
    }
  }, []);

  if (!position) return <div>Carregando mapa...</div>;

  // Gerar todos os marcadores por vaga
  const generateVagaMarkers = () => {
    const markers = [];
  
    parkingData.forEach((spot, index) => {
      const baseLat = spot.latitude;
      const baseLng = spot.longitude;
  
      let count = 0;
  
      Object.entries(spot).forEach(([key, value]) => {
        if (key.includes("vaga_") && value === "Livre") {
          const offsetLat = 0.0001 * Math.cos(count);
          const offsetLng = 0.0001 * Math.sin(count);
  
          markers.push(
            <Marker
              key={`${spot.rua}-${key}`}
              position={[baseLat + offsetLat, baseLng + offsetLng]}
              icon={greenIcon}
            >
              <Popup>
                <strong>{spot.rua}</strong><br />
                {key.replace("vaga_", "Vaga ")}:{" "}
                <span style={{ color: "green" }}>Livre</span>
              </Popup>
            </Marker>
          );
  
          count++;
        }
      });
    });
  
    return markers;
  };
  

  return (
    <MapContainer center={position} zoom={15} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Posição do usuário */}
      <Marker position={position}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {/* Vagas individuais como marcadores */}
      {generateVagaMarkers()}
    </MapContainer>
  );
}

export default ObjectsMap;
