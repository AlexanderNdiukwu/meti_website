// import { StrictMode, useEffect } from 'react'
// import { createRoot } from 'react-dom/client'
// import { RouterProvider } from 'react-router-dom'
// import { router } from './router/router'
// import ToastContainer from './components/ToastContainer'
// import LoadingScreen from './components/LoadingScreen'
// import { useAdmissionsStore } from './store/admissionsStore'
// import './index.css'
// import 'primereact/resources/themes/lara-light-blue/theme.css'
// import 'primeicons/primeicons.css'

// // Restores a logged-in user's session (and loads their applicant data)
// // once, on first load — before the router renders any page. Without
// // this, a returning user would appear logged out until they manually
// // log in again, even though Supabase still has a valid session.
// function Root() {
//   // Selectors, not whole-store destructuring — Root only cares about
//   // `loading`, so this stops it re-rendering on every unrelated store
//   // change (applicants fetched, announcements fetched, etc.)
//   const initSession = useAdmissionsStore((s) => s.initSession);
//   const subscribeToAuthChanges = useAdmissionsStore((s) => s.subscribeToAuthChanges);
//   const loading = useAdmissionsStore((s) => s.loading);

//   useEffect(() => {
//     initSession();
//     const subscription = subscribeToAuthChanges();
//     return () => subscription?.unsubscribe();
//   }, []);

// if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <>
//       <RouterProvider router={router} />
//       <ToastContainer />
//     </>
//   );
// }

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Root />
//   </StrictMode>,
// )


import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import ToastContainer from './components/ToastContainer'
import LoadingScreen from './components/LoadingScreen'
import ChunkErrorBoundary from './components/ChunkErrorBoundary'
import { useAdmissionsStore } from './store/admissionsStore'
import './index.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

// Captured as early as possible, outside React entirely — Chrome can
// fire this before the component tree finishes mounting. Attaching the
// listener only inside a deeply nested component (like InstallAppButton)
// risks missing it completely, which is exactly why Chrome's own native
// icon was showing instead of the custom button — our code's preventDefault()
// never got the chance to run.
window.deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredInstallPrompt = e;
  window.dispatchEvent(new Event('pwa-install-available'));
});
window.addEventListener('appinstalled', () => {
  window.deferredInstallPrompt = null;
  window.dispatchEvent(new Event('pwa-install-available'));
});

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

    // Safety net for Realtime — background/inactive browser tabs throttle
    // or drop WebSocket connections silently. Rather than relying on the
    // socket reconnecting in time, force a full data refresh the moment
    // the tab becomes visible again, regardless of the socket's state.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        initSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription?.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // A successful mount past this point means the current chunks loaded
  // fine — clear the reload flag so a FUTURE genuine stale-deploy error
  // can still trigger its one-time auto-reload, instead of being
  // permanently silenced by an old flag from a previous session.
  // Placed BEFORE the loading early-return, not after — hooks must run
  // unconditionally on every render, or React throws exactly the error
  // you just saw.
  useEffect(() => {
    sessionStorage.removeItem('meti-chunk-reload');
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ChunkErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer />
    </ChunkErrorBoundary>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
