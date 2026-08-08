// FILE: RouteErrorBoundary.jsx
// Place at: src/components/RouteErrorBoundary.jsx
import { useEffect } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const RELOAD_FLAG = 'meti-route-reload';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = error?.message || String(error?.statusText || error || '');
  const isChunkError = /Failed to fetch dynamically imported module|Loading chunk .* failed|dynamically imported module/i.test(message);

  useEffect(() => {
    if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      window.location.reload();
    }
  }, [isChunkError]);

  if (isChunkError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400 font-semibold">Loading the latest version…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center gap-4">
      <h1 className="text-2xl font-black text-gray-900">Something went wrong</h1>
      <p className="text-sm text-gray-500 max-w-md">
        Sorry about that — this page hit an unexpected error. Reloading usually fixes it.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-blue-900"
        >
          Reload Page
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary/5"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}