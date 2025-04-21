import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import api from "../services/api";
import parkingData from "../mock/parkingData.json";

// Ajuste do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const greenIcon = new L.Icon({
  iconUrl: "https://cdn4.iconfinder.com/data/icons/map-pins-2/256/13-512.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ObjectsMap() {
  const [position, setPosition] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Localização do usuário
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      () => {
        setPosition([-19.53645306343535, -40.62907357525347]);
      }
    );

    // Função para buscar vagas da API
    const fetchData = async () => {
      try {
        const response = await api.get("/status_vagas");
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.warn("Resposta inválida da API, usando mock.");
          setData(parkingData);
        }
      } catch (error) {
        console.error("Erro na API, usando mock:", error);
        setData(parkingData);
      }
    };

    fetchData(); // primeira chamada imediata

    // Atualiza a cada 2 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval); // limpa intervalo no unmount
  }, []);

  if (!position) return <div>Carregando mapa...</div>;

  const generateVagaMarkers = () => {
    const markers = [];

    data.forEach((spot) => {
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

      <Marker position={position}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {generateVagaMarkers()}
    </MapContainer>
  );
}

export default ObjectsMap;
