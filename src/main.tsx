import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Capture the PWA install prompt globally right away
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
  window.dispatchEvent(new Event("app-install-prompt"));
});

window.onerror = function(message, source, lineno, colno, error) {
  console.error("GLOBAL ERROR CAPTURED:", { message, source, lineno, colno, error });
  // Store it for ErrorBoundary to find
  (window as any).LAST_CRASH = { message, source, lineno, colno, error: error?.stack };
  return false;
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

