import { createRoot } from "react-dom/client";
import "./index.css";
import App from "../src/app/App.jsx";
import AppProvider from "../src/app/providers/AppProvider.jsx";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "bootstrap-icons/font/bootstrap-icons.css";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledRequest: "warn",
  });
}

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById("root")).render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
}

bootstrap().catch((error) => {
  console.error("Failed to initialize application:", error);
});
