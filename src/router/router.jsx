import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

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
const AdminChatbot = lazy(() => import('../pages/AdminChatbot'));

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
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
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: 'officers', element: withSuspense(PrincipalOfficers) },
      { path: 'history', element: withSuspense(History) },
      { path: 'director', element: withSuspense(DirectorProfile) },
      { path: 'duration', element: withSuspense(ProgramDuration) },
    ]
  },
  { path: '/support', element: withSuspense(Support), errorElement: <RouteErrorBoundary /> },

  // ── Admissions portal (standalone, outside main App layout) ──
  { path: '/apply', element: withSuspense(ApplyFlow), errorElement: <RouteErrorBoundary /> },
  { path: '/signup', element: withSuspense(AdmissionsSignUp), errorElement: <RouteErrorBoundary /> },
  { path: '/login', element: withSuspense(AdmissionsLogin), errorElement: <RouteErrorBoundary /> },
  { path: '/forgot-password', element: withSuspense(ForgotPassword), errorElement: <RouteErrorBoundary /> },
  { path: '/payment', element: withSuspense(PaymentPage), errorElement: <RouteErrorBoundary /> },
  { path: '/application-form', element: withSuspense(ApplicationFormPage), errorElement: <RouteErrorBoundary /> },

  {
    path: '/dashboard',
    element: withSuspense(DashboardLayout),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: withSuspense(DashboardHome) },
      { path: 'announcements', element: withSuspense(DashboardAnnouncements) },
      { path: 'settings', element: withSuspense(DashboardSettings) },
    ],
  },

  // ── Admin portal ──
  { path: '/admin', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/applications', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/applications/:id', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/announcements', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/reports', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/settings', element: withSuspense(AdminPanel), errorElement: <RouteErrorBoundary /> },
  { path: '/admin/chatbot', element: withSuspense(AdminChatbot), errorElement: <RouteErrorBoundary /> },
]);




