import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Ajustamos o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Criando o ícone de estacionamento
const parkingIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/map-pins-2/256/13-512.png",
  iconSize: [60, 60], // Tamanho do ícone
  iconAnchor: [20, 40], // Ponto de ancoragem
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
        (error) => {
          console.error("Erro ao obter localização:", error);
          setPosition([51.505, -0.09]); // Posição padrão
        }
      );
    } else {
      setPosition([51.505, -0.09]); // Posição padrão
    }
  }, []);

  if (!position) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <MapContainer center={position} zoom={13} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marcador da posição do usuário */}
      <Marker position={position}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {/* Marcador de vaga de estacionamento */}
      <Marker position={[-19.53645306343535, -40.62907357525347]} icon={parkingIcon}>
        <Popup>Vaga de Estacionamento</Popup>
      </Marker>
    </MapContainer>
  );
}

export default ObjectsMap;
