import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ShreeWebNavbar from './components/ShreeWebNavbar';
import ShreeWebFooter from './components/ShreeWebFooter';
import BackToTopButton from './components/BackToTopButton';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ShreeWebLayout() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 100,
    });

    // Your global app uses `body { padding-top: 85px; }` to make room for the main navbar.
    // The `/shreeweb` pages hide that navbar, so we remove the padding to prevent top gaps.
    const prev = document.body.style.paddingTop;
    document.body.style.paddingTop = '0px';
    
    return () => {
      document.body.style.paddingTop = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-stone-900">
      <ShreeWebNavbar />
      <main className="w-full">
        <Outlet />
      </main>
      <ShreeWebFooter />
      <BackToTopButton />
    </div>
  );
}
