import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import ToastContainer from './components/ToastContainer'
import { useAdmissionsStore } from './store/admissionsStore'
import './index.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

// Restores a logged-in user's session (and loads their applicant data)
// once, on first load — before the router renders any page. Without
// this, a returning user would appear logged out until they manually
// log in again, even though Supabase still has a valid session.
function Root() {
  // Selectors, not whole-store destructuring — Root only cares about
  // `loading`, so this stops it re-rendering on every unrelated store
  // change (applicants fetched, announcements fetched, etc.)
  const initSession = useAdmissionsStore((s) => s.initSession);
  const subscribeToAuthChanges = useAdmissionsStore((s) => s.subscribeToAuthChanges);
  const loading = useAdmissionsStore((s) => s.loading);

  useEffect(() => {
    initSession();
    const subscription = subscribeToAuthChanges();
    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400 font-semibold">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
