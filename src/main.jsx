import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

/**
 * HelmetProvider must wrap the entire app so that
 * react-helmet-async can manage <head> updates across routes.
 */
createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
