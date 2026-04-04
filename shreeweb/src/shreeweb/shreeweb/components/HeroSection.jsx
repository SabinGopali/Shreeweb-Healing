import React from 'react';
import { Link } from 'react-router-dom';
import { useHeroData } from '../hooks/useHeroData';

/* -------------------------------------------------------
   Helper: Resolve backend URLs
-------------------------------------------------------- */
const resolveUrl = (url) => {
  if (!url) return '';
  
  // Blob URLs and data URLs - use as-is
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Full URLs - use as-is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  
  // Relative paths - prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`;
};

const HeroSection = () => {
  const { heroData, loading, error } = useHeroData();

  if (loading) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center bg-stone-200 animate-pulse">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-stone-400 border-t-stone-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !heroData) {
    // Fallback to default hero section
    return (
      <section 
        className="relative h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: 'url(/healing.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
        data-aos="fade-in"
        data-aos-duration="400"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          <h1 
            className="text-8xl md:text-9xl font-serif tracking-wider text-white drop-shadow-2xl mb-8"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="300"
          >
            JAPANDI
          </h1>
          
          <div 
            className="mt-12"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="600"
          >
            <Link
              to="/shreeweb/booking?plan=discovery"
              className="group relative overflow-hidden inline-flex items-center px-12 py-4 border-2 border-white/40 text-white rounded-full hover:border-white/60 transition-all duration-500 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin Your Journey
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </Link>
            
            <p 
              className="mt-6 text-white/80 text-lg font-light tracking-wide"
              data-aos="fade-up"
              data-aos-duration="300"
              data-aos-delay="800"
            >
              Energetic alignment for sustainable expansion
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get background content based on type
  const getBackgroundContent = () => {
    if (heroData.backgroundType === 'video' && heroData.backgroundVideo) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -1 }}
        >
          <source src={resolveUrl(heroData.backgroundVideo)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  const getBackgroundStyle = () => {
    if (heroData.backgroundType === 'video') {
      return {}; // No background image for video
    }
    return {
      backgroundImage: `url(${heroData.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    };
  };

  // Get CTA button styles based on ctaStyle
  const getCtaButtonStyles = () => {
    switch (heroData.ctaStyle) {
      case 'gradient':
        return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600';
      case 'solid':
        return 'bg-white text-stone-800 hover:bg-stone-100';
      default: // transparent
        return 'border-2 border-white/40 text-white hover:border-white/60';
    }
  };

  return (
    <section 
      className={`relative h-screen w-full flex items-center justify-center ${
        heroData.backgroundType === 'image' ? 'bg-cover bg-center bg-no-repeat bg-fixed' : ''
      }`}
      style={{ 
        ...getBackgroundStyle(),
        minHeight: '100vh'
      }}
      data-aos="fade-in"
      data-aos-duration="400"
    >
      {/* Video Background */}
      {getBackgroundContent()}
      
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${heroData.overlayOpacity / 100})` }}
      ></div>
      
      <div className="relative z-10 text-center">
        <h1 
          className={`${heroData.titleSize} font-serif tracking-wider ${heroData.titleColor} drop-shadow-2xl mb-8`}
          data-aos="fade-up"
          data-aos-duration="300"
          data-aos-delay="300"
          dangerouslySetInnerHTML={{ __html: heroData.title }}
        />
        
        <div 
          className="mt-12"
          data-aos="fade-up"
          data-aos-duration="300"
          data-aos-delay="600"
        >
          <Link
            to="/shreeweb/booking?plan=discovery"
            className={`group relative overflow-hidden inline-flex items-center px-12 py-4 rounded-full transition-all duration-500 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 ${getCtaButtonStyles()}`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <span dangerouslySetInnerHTML={{ __html: heroData.ctaText }} />
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {heroData.ctaStyle === 'transparent' && (
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            )}
            {heroData.ctaStyle === 'gradient' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            )}
          </Link>
          
          <p 
            className={`mt-6 ${heroData.subtitleColor} text-lg font-light tracking-wide`}
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="800"
            dangerouslySetInnerHTML={{ __html: heroData.subtitle }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;