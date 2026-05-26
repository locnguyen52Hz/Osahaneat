import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from '../src/app/App.jsx'
import AppProvider from "../src/app/providers/AppProvider.jsx";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  /* </StrictMode> */
);
