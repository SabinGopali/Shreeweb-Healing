import { useState, useEffect } from 'react';
import TestimonialsSection from '../components/TestimonialsSection';
import OffersSection from '../components/OffersSection';
import ClaritySection from '../components/ClaritySection';

export default function Offerings() {
  const [settings, setSettings] = useState({
    section: {
      sectionTitle: 'Curated Offerings',
      sectionDescription: 'Select the container that aligns with your current capacity and desired expansion.',
      backgroundColor: '#F4EFE6',
      cardBackground: '#EDE7DC'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/backend/shreeweb-offerings/public/with-settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default settings if API fails
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="py-12 px-4 text-center relative overflow-hidden sm:py-16 md:py-20"
        style={{ backgroundColor: settings.section.backgroundColor }}
        data-aos="fade-in"
        data-aos-duration="300"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-12 right-12 w-32 h-32 border border-stone-300 rounded-full"></div>
          <div className="absolute bottom-12 left-12 w-24 h-24 border border-amber-300 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-orange-300 rounded-full"></div>
          <div className="absolute top-1/4 left-1/3 w-20 h-20 border border-stone-400 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 
            className="text-3xl font-serif text-stone-800 mb-4 sm:text-4xl md:text-5xl sm:mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {settings.section.sectionTitle}
          </h1>
          <p 
            className="text-lg text-stone-600 mb-8 font-serif sm:text-xl sm:mb-12"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="300"
          >
            {settings.section.sectionDescription}
          </p>
        </div>
      </section>

      {/* Offerings Grid */}
      <section 
        className="py-12 px-4 relative sm:py-16"
        style={{ backgroundColor: settings.section.backgroundColor }}
        data-aos="fade-up"
        data-aos-duration="300"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        
        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <div data-aos="fade-up" data-aos-duration="200" data-aos-delay="200">
            <OffersSection customSettings={settings} />
          </div>
        </div>
      </section>

      {/* Call to Action - Now using CMS-managed content */}
      <div data-aos="fade-up" data-aos-duration="300">
        <ClaritySection />
      </div>

      <div data-aos="fade-up" data-aos-duration="300">
        <TestimonialsSection />
      </div>
    </div>
  );
}