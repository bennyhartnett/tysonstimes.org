import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import App from "./App.jsx";
import { ContentProvider } from "./data/ContentProvider.jsx";
import "../assets/newspaper.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>,
);
