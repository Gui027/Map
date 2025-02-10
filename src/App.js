import React, { Suspense } from "react";
//import ObjectsMap from './components/ObjectsMap';

import "./styles.css";
const ObjectsMap = React.lazy(() => import("./components/ObjectsMap"));

export default function App() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ObjectsMap />
      </Suspense>
    </main>
  );
}
