
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!installPrompt) return null;

  return (
 <button
  onClick={async () => {
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }}
  className="flex items-center justify-center gap-2 whitespace-nowrap shrink-0 px-8 py-3 rounded-full bg-white text-uniport-blue animate-pulse text-lg md:text-base font-bold hover:bg-blue-100 transition-colors shadow-lg"
>
  <Download size={16} />
  Install App
</button>
  );
}

