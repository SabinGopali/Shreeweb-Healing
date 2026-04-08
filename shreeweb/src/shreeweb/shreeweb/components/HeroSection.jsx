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
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`;
};

const HeroSection = () => {
  const { heroData, loading, error } = useHeroData();

  if (loading) {
    return (
      <section className="relative min-h-screen w-full flex items-center justify-center bg-stone-200 animate-pulse px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-stone-400 border-t-stone-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 text-sm sm:text-base">Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !heroData) {
    // Fallback to default hero section
    return (
      <section 
        className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat py-16 px-4 sm:py-20 sm:px-6 md:py-0"
        style={{ 
          backgroundImage: 'url(/healing.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '100vh'
        }}
        data-aos="fade-in"
        data-aos-duration="400"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center w-full max-w-7xl mx-auto">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif tracking-wide sm:tracking-wider text-white drop-shadow-2xl mb-8 sm:mb-10 leading-tight px-4"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="300"
          >
            OMSHREEGUIDANCE
          </h1>
          
          <div 
            className="mt-8 sm:mt-10 md:mt-12 px-4"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="600"
          >
            <Link
              to="/shreeweb/offers"
              className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-4 lg:px-14 border-2 border-white/40 text-white rounded-full hover:border-white/60 transition-all duration-500 font-semibold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 w-auto"
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Begin Your Journey
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </Link>
            
            <p 
              className="mt-6 sm:mt-8 text-white/80 text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed px-2"
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
      backgroundImage: `url(${resolveUrl(heroData.backgroundImage)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center'
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
      className={`relative min-h-screen w-full flex items-center justify-center py-16 px-4 sm:py-20 sm:px-6 md:py-0 ${
        heroData.backgroundType === 'image' ? 'bg-cover bg-center bg-no-repeat' : ''
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
      
      <div className="relative z-10 text-center w-full max-w-7xl mx-auto">
        <h1 
          className={`font-serif tracking-wide sm:tracking-wider ${heroData.titleColor} drop-shadow-2xl mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:${heroData.titleSize} leading-tight px-4`}
          data-aos="fade-up"
          data-aos-duration="300"
          data-aos-delay="300"
          dangerouslySetInnerHTML={{ __html: heroData.title }}
        />
        
        <div 
          className="mt-8 sm:mt-10 md:mt-12 px-4"
          data-aos="fade-up"
          data-aos-duration="300"
          data-aos-delay="600"
        >
          <Link
            to="/shreeweb/offers"
            className={`group relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-4 lg:px-14 rounded-full transition-all duration-500 font-semibold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 w-auto ${getCtaButtonStyles()}`}
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              <span dangerouslySetInnerHTML={{ __html: heroData.ctaText }} />
              <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`mt-6 sm:mt-8 ${heroData.subtitleColor} text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed px-2`}
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