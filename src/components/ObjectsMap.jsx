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

// Ícone personalizado para vagas de estacionamento
const parkingIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/map-pins-2/256/13-512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ObjectsMap() {
  const [position, setPosition] = useState(null);
  
  useEffect(() => {
    // Obtém a localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        () => {
          console.error("Erro ao obter localização");
          setPosition([-19.53645306343535, -40.62907357525347]); // Posição padrão
        }
      );
    } else {
      setPosition([-19.53645306343535, -40.62907357525347]); // Posição padrão
    }
  }, []);

  if (!position) {
    return <div>Carregando mapa...</div>;
  }

  // Filtra os estacionamentos que possuem pelo menos uma vaga livre
  const availableParkingSpots = parkingData.filter((spot) =>
    Object.entries(spot).some(
      ([key, value]) => key.includes("vaga_") && value !== "Ocupada"
    )
  );

  return (
    <MapContainer center={position} zoom={15} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marcador da posição do usuário */}
      <Marker position={position}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {/* Marcadores das vagas de estacionamento disponíveis */}
      {availableParkingSpots.map((spot, index) => (
        <Marker key={index} position={[spot.latitude, spot.longitude]} icon={parkingIcon}>
          <Popup>
            <strong>Rua:</strong> {spot.rua} <br />
            <strong>Vagas:</strong>
            <ul>
              {Object.entries(spot)
                .filter(([key, value]) => key.includes("vaga_"))
                .map(([key, value]) => (
                  <li key={key} style={{ color: value === "Ocupada" ? "red" : "green" }}>
                    {key.replace("vaga_", "Vaga ")}: {value}
                  </li>
                ))}
            </ul>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ObjectsMap;
