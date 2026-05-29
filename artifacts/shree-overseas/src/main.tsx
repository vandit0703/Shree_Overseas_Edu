import { createRoot } from "react-dom/client";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

setBaseUrl(import.meta.env.VITE_API_BASE_URL || null);

// Set up auth token getter to check both admin and staff tokens
setAuthTokenGetter(() => {
  return localStorage.getItem("adminToken") || localStorage.getItem("staffToken");
});

createRoot(document.getElementById("root")!).render(<App />);
