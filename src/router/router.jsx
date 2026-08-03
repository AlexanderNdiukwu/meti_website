// import { createBrowserRouter } from 'react-router-dom';

// import App from '../App';

// import Home from '../pages/Home';

// import Masters from '../pages/Masters';

// import PhD from '../pages/PhD';

// import PGD from '../pages/PGD';

// import Courses from '../pages/Courses';

// import Lecturers from '../pages/Lecturers';

// import FAQ from '../pages/FAQ';

// import About from '../pages/About';



// // ADMISSIONS PORTAL IMPORTS

// import ApplyFlow from '../pages/ApplyFlow';

// import AdmissionsSignUp from '../pages/AdmissionsSignUp';

// import AdmissionsLogin from '../pages/AdmissionsLogin';

// import ForgotPassword from '../pages/auth/ForgotPassword';

// import PaymentPage from '../pages/PaymentPage';
// import ApplicationFormPage from '../pages/ApplicationFormPage';
// import Support from '../pages/Support';

// import DashboardLayout from '../pages/dashboard/DashboardLayout';

// import DashboardHome from '../pages/dashboard/DashboardHome';


// import DashboardAnnouncements from '../pages/dashboard/Announcements';

// import DashboardSettings from '../pages/dashboard/Settings';

// import AdminPanel from '../pages/AdminPanel';

// import AdminReports from '../pages/AdminReports';





// // ABOUT METI DROPDOWN PAGES

// import PrincipalOfficers from '../pages/about/PrincipalOfficers';

// import History from '../pages/about/History';

// import DirectorProfile from '../pages/about/DirectorProfile';

// import ProgramDuration from '../pages/about/ProgramDuration';

// import Aboutlayout from '../store/Aboutlayout';



// export const router = createBrowserRouter([

//   {

//     path: '/',

//     element: <App />,

//     children: [

//       { path: '/', element: <Home /> },

//       { path: '/masters', element: <Masters /> },

//       { path: '/phd', element: <PhD /> },

//       { path: '/pgd', element: <PGD /> },

//       { path: '/courses', element: <Courses /> },

//       { path: '/lecturers', element: <Lecturers /> },

//       { path: '/faq', element: <FAQ /> },

//       { path: '/about', element: <About /> },

//     ]

//   },

//   {

//     path: '/about',

//     element: <Aboutlayout />,

//     children: [

//       { path: 'officers', element: <PrincipalOfficers /> },

//       { path: 'history', element: <History /> },

//       { path: 'director', element: <DirectorProfile /> },

//       { path: 'duration', element: <ProgramDuration /> },

//     ]
    
//   },
//   { path: '/support', element: <Support /> },
  


//   // ── Admissions portal (standalone, outside main App layout) ──

//   { path: '/apply', element: <ApplyFlow /> },

//   { path: '/signup', element: <AdmissionsSignUp /> },

//   { path: '/login', element: <AdmissionsLogin /> },

//   { path: '/forgot-password', element: <ForgotPassword /> },

//   { path: '/payment', element: <PaymentPage /> },

//   { path: '/application-form', element: <ApplicationFormPage /> },

//   {

//     path: '/dashboard',

//     element: <DashboardLayout />,

//     children: [

//       { index: true, element: <DashboardHome /> },


//       { path: 'announcements', element: <DashboardAnnouncements /> },

//       { path: 'settings', element: <DashboardSettings /> },

//     ],

//   },



//   // ── Admin portal ──

//   { path: '/admin', element: <AdminPanel /> },

//   { path: '/admin/applications', element: <AdminPanel /> },

//   { path: '/admin/applications/:id', element: <AdminPanel /> },

//   { path: '/admin/announcements', element: <AdminPanel /> },

//   { path: '/admin/reports', element: <AdminPanel /> },

//   { path: '/admin/settings', element: <AdminPanel /> },



  


// ]);


import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

import App from '../App';

// ── Public marketing pages — lazy loaded ──
const Home        = lazy(() => import('../pages/Home'));
const Masters      = lazy(() => import('../pages/Masters'));
const PhD           = lazy(() => import('../pages/PhD'));
const PGD           = lazy(() => import('../pages/PGD'));
const Courses       = lazy(() => import('../pages/Courses'));
const Lecturers     = lazy(() => import('../pages/Lecturers'));
const FAQ           = lazy(() => import('../pages/FAQ'));
const About         = lazy(() => import('../pages/About'));
const Support       = lazy(() => import('../pages/Support'));

// ── About METI dropdown pages ──
const PrincipalOfficers = lazy(() => import('../pages/about/PrincipalOfficers'));
const History            = lazy(() => import('../pages/about/History'));
const DirectorProfile    = lazy(() => import('../pages/about/DirectorProfile'));
const ProgramDuration    = lazy(() => import('../pages/about/ProgramDuration'));
const Aboutlayout        = lazy(() => import('../store/Aboutlayout'));

// ── Admissions portal ──
const ApplyFlow            = lazy(() => import('../pages/ApplyFlow'));
const AdmissionsSignUp     = lazy(() => import('../pages/AdmissionsSignUp'));
const AdmissionsLogin      = lazy(() => import('../pages/AdmissionsLogin'));
const ForgotPassword       = lazy(() => import('../pages/auth/ForgotPassword'));
const PaymentPage          = lazy(() => import('../pages/PaymentPage'));
const ApplicationFormPage  = lazy(() => import('../pages/ApplicationFormPage'));

const DashboardLayout          = lazy(() => import('../pages/dashboard/DashboardLayout'));
const DashboardHome            = lazy(() => import('../pages/dashboard/DashboardHome'));
const DashboardAnnouncements   = lazy(() => import('../pages/dashboard/Announcements'));
const DashboardSettings        = lazy(() => import('../pages/dashboard/Settings'));

// ── Admin portal ──
const AdminPanel   = lazy(() => import('../pages/AdminPanel'));
const AdminReports = lazy(() => import('../pages/AdminReports'));

// Wraps a lazy page with a fallback so each route shows the loading
// screen only for its own brief fetch — not the whole app.
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: withSuspense(Home) },
      { path: '/masters', element: withSuspense(Masters) },
      { path: '/phd', element: withSuspense(PhD) },
      { path: '/pgd', element: withSuspense(PGD) },
      { path: '/courses', element: withSuspense(Courses) },
      { path: '/lecturers', element: withSuspense(Lecturers) },
      { path: '/faq', element: withSuspense(FAQ) },
      { path: '/about', element: withSuspense(About) },
    ]
  },
  {
    path: '/about',
    element: withSuspense(Aboutlayout),
    children: [
      { path: 'officers', element: withSuspense(PrincipalOfficers) },
      { path: 'history', element: withSuspense(History) },
      { path: 'director', element: withSuspense(DirectorProfile) },
      { path: 'duration', element: withSuspense(ProgramDuration) },
    ]
  },
  { path: '/support', element: withSuspense(Support) },

  // ── Admissions portal (standalone, outside main App layout) ──
  { path: '/apply', element: withSuspense(ApplyFlow) },
  { path: '/signup', element: withSuspense(AdmissionsSignUp) },
  { path: '/login', element: withSuspense(AdmissionsLogin) },
  { path: '/forgot-password', element: withSuspense(ForgotPassword) },
  { path: '/payment', element: withSuspense(PaymentPage) },
  { path: '/application-form', element: withSuspense(ApplicationFormPage) },

  {
    path: '/dashboard',
    element: withSuspense(DashboardLayout),
    children: [
      { index: true, element: withSuspense(DashboardHome) },
      { path: 'announcements', element: withSuspense(DashboardAnnouncements) },
      { path: 'settings', element: withSuspense(DashboardSettings) },
    ],
  },

  // ── Admin portal ──
  { path: '/admin', element: withSuspense(AdminPanel) },
  { path: '/admin/applications', element: withSuspense(AdminPanel) },
  { path: '/admin/applications/:id', element: withSuspense(AdminPanel) },
  { path: '/admin/announcements', element: withSuspense(AdminPanel) },
  { path: '/admin/reports', element: withSuspense(AdminPanel) },
  { path: '/admin/settings', element: withSuspense(AdminPanel) },
]);

