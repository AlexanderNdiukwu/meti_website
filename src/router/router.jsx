import { createBrowserRouter } from 'react-router-dom';

import App from '../App';

import Home from '../pages/Home';

import Masters from '../pages/Masters';

import PhD from '../pages/PhD';

import PGD from '../pages/PGD';

import Courses from '../pages/Courses';

import Lecturers from '../pages/Lecturers';

import FAQ from '../pages/FAQ';

import About from '../pages/About';



// ADMISSIONS PORTAL IMPORTS

import ApplyFlow from '../pages/ApplyFlow';

import AdmissionsSignUp from '../pages/AdmissionsSignUp';

import AdmissionsLogin from '../pages/AdmissionsLogin';

import ForgotPassword from '../pages/auth/ForgotPassword';

import PaymentPage from '../pages/PaymentPage';
import ApplicationFormPage from '../pages/ApplicationFormPage';
import Support from '../pages/Support';

import DashboardLayout from '../pages/dashboard/DashboardLayout';

import DashboardHome from '../pages/dashboard/DashboardHome';


import DashboardAnnouncements from '../pages/dashboard/Announcements';

import DashboardSettings from '../pages/dashboard/Settings';

import AdminPanel from '../pages/AdminPanel';

import AdminReports from '../pages/AdminReports';





// ABOUT METI DROPDOWN PAGES

import PrincipalOfficers from '../pages/about/PrincipalOfficers';

import History from '../pages/about/History';

import DirectorProfile from '../pages/about/DirectorProfile';

import ProgramDuration from '../pages/about/ProgramDuration';

import Aboutlayout from '../store/Aboutlayout';



export const router = createBrowserRouter([

  {

    path: '/',

    element: <App />,

    children: [

      { path: '/', element: <Home /> },

      { path: '/masters', element: <Masters /> },

      { path: '/phd', element: <PhD /> },

      { path: '/pgd', element: <PGD /> },

      { path: '/courses', element: <Courses /> },

      { path: '/lecturers', element: <Lecturers /> },

      { path: '/faq', element: <FAQ /> },

      { path: '/about', element: <About /> },

    ]

  },

  {

    path: '/about',

    element: <Aboutlayout />,

    children: [

      { path: 'officers', element: <PrincipalOfficers /> },

      { path: 'history', element: <History /> },

      { path: 'director', element: <DirectorProfile /> },

      { path: 'duration', element: <ProgramDuration /> },

    ]
    
  },
  { path: '/support', element: <Support /> },
  


  // ── Admissions portal (standalone, outside main App layout) ──

  { path: '/apply', element: <ApplyFlow /> },

  { path: '/signup', element: <AdmissionsSignUp /> },

  { path: '/login', element: <AdmissionsLogin /> },

  { path: '/forgot-password', element: <ForgotPassword /> },

  { path: '/payment', element: <PaymentPage /> },

  { path: '/application-form', element: <ApplicationFormPage /> },

  {

    path: '/dashboard',

    element: <DashboardLayout />,

    children: [

      { index: true, element: <DashboardHome /> },


      { path: 'announcements', element: <DashboardAnnouncements /> },

      { path: 'settings', element: <DashboardSettings /> },

    ],

  },



  // ── Admin portal ──

  { path: '/admin', element: <AdminPanel /> },

  { path: '/admin/applications', element: <AdminPanel /> },

  { path: '/admin/applications/:id', element: <AdminPanel /> },

  { path: '/admin/announcements', element: <AdminPanel /> },

  { path: '/admin/reports', element: <AdminPanel /> },

  { path: '/admin/settings', element: <AdminPanel /> },



  


]);

