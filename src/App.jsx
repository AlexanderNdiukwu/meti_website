import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CallToAction from './components/CallToAction';
import GlobalApplyWidgets from './components/GlobalApplyWidgets';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import ChatbotWidget from './components/ChatbotWidget';


function App() {
 

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="grow">
        <ScrollToTop />
     
        <Outlet />
        <BackToTopButton />
      </main>
<CallToAction />
      <Footer />
      <GlobalApplyWidgets />
      <ChatbotWidget />
    </div>
  );
}

export default App;
