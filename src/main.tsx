import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Capture the PWA install prompt globally right away
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
  window.dispatchEvent(new Event("app-install-prompt"));
});

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA
registerSW({ immediate: true });
