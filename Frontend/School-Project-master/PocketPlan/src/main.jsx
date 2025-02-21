import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppProvider from "./AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider />
  </StrictMode>
);
