import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

// 1. Importamos o Leaflet e os arquivos de ícone
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// 2. Ajustamos o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
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
          // Caso haja erro ou o usuário negue a permissão
          setPosition([51.505, -0.09]); // Posição padrão
        }
      );
    } else {
      // Se o navegador não suportar Geolocalização
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

      <Marker position={position}>
        <Popup>Você está aqui</Popup>
      </Marker>
    </MapContainer>
  );
}

export default ObjectsMap;
