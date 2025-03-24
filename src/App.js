import React, { Suspense } from "react";
import "./styles.css";

// Import do componente do mapa via lazy-loading
const ObjectsMap = React.lazy(() => import("./components/ObjectsMap"));

export default function App() {
  return (
    <div className="App">
      {/* Cabeçalho / Apresentação */}
      <header className="app-header">
        <h1>
          {/* Substitua a URL abaixo pela imagem que deseja utilizar */}
          <img
            className="logo"
            src="https://cdn-icons-png.flaticon.com/512/1180/1180032.png"
            alt="Logo do Vacol"
          />
          Vacol
        </h1>
        <h2>
          A IA que acaba com o estresse de estacionar e economiza seu tempo
        </h2>
        <p>
          Bem-vindo(a) ao Vacol – a solução inovadora que utiliza Inteligência
          Artificial e Visão Computacional para mostrar vagas de estacionamento
          disponíveis em tempo real. Encontre facilmente onde estacionar e
          reduza o seu tempo no trânsito!
        </p>
      </header>

      {/* Conteúdo Principal / Mapa */}
      <main className="app-main">
        <Suspense fallback={<div className="loading">Carregando mapa...</div>}>
          <ObjectsMap />
        </Suspense>
      </main>
    </div>
  );
}
