import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Don't show if user already dismissed
    if (localStorage.getItem("pwa-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative bg-[#111] border border-sky-500/30 rounded-2xl p-4 shadow-2xl shadow-sky-500/10 flex items-center gap-4">
        {/* App Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-bold text-2xl">V</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Instalar Vincere</p>
          <p className="text-[#888] text-xs mt-0.5">
            Acesse métricas e chat direto do celular
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={handleInstall}
          className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all hover:scale-105 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#333] hover:bg-[#444] flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}
