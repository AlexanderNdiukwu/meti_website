import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallAppButton({ className }) {
  const [installPrompt, setInstallPrompt] = useState(() => window.deferredInstallPrompt || null);

  useEffect(() => {
    const handler = () => setInstallPrompt(window.deferredInstallPrompt || null);
    window.addEventListener('pwa-install-available', handler);
    return () => window.removeEventListener('pwa-install-available', handler);
  }, []);

  if (!installPrompt) return null;

  return (
    <button
      onClick={async () => {
        installPrompt.prompt();
        await installPrompt.userChoice;
        window.deferredInstallPrompt = null;
        setInstallPrompt(null);
      }}
      className={className || "flex items-center justify-center gap-2 whitespace-nowrap shrink-0 px-8 py-3 rounded-full bg-white text-uniport-blue animate-pulse text-lg md:text-base font-bold hover:bg-blue-100 transition-colors shadow-lg"}
    >
      <Download size={16} />
      Install App
    </button>
  );
}