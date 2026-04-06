import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/backend/shreeweb-about/public', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch about data');
      }

      if (data.success) {
        setAboutData(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError(err.message || 'Failed to load about data');
      // Set fallback data if API fails
      setAboutData({
        hero: {
          tag: 'About',
          title: 'OMSHREEGUIDANCE',
          subtitle: 'Energy Sessions',
          description: 'A calm, structured approach to help you scan your energetic field, release what\'s stuck, and return to balance.',
          backgroundColor: 'from-[#F4EFE6] via-amber-50 to-orange-50'
        },
        whatWeDo: {
          title: 'What we do',
          description: 'The sessions work with your energetic system to cleanse, balance, and strengthen internal stability. The goal is to reduce internal resistance so you can hold your success with more ease.',
          backgroundColor: '#F4EFE6',
          services: [
            {
              title: 'Scanning',
              description: 'Identify energy leaks and blocks that create friction in your daily experience.',
              icon: 'circle',
              order: 1
            },
            {
              title: 'Cleansing',
              description: 'Release stagnant energy and clear external "noise" that no longer serves you.',
              icon: 'filled-circle',
              order: 2
            },
            {
              title: 'Balancing',
              description: 'Restore harmony and guide you back to a state of grounded power.',
              icon: 'grid',
              order: 3
            }
          ]
        },
        philosophy: {
          title: 'The OMSHREEGUIDANCE Approach',
          description: 'Inspired by the minimalist principles of Japanese and Scandinavian design, our approach emphasizes simplicity, natural harmony, and sustainable well-being.',
          backgroundColor: 'from-stone-50 to-amber-50'
        },
        howToStart: {
          title: 'How to get started',
          description: 'Your journey toward energetic alignment begins with a simple, structured process',
          backgroundColor: '#F4EFE6'
        },
        callToAction: {
          title: 'Ready to begin?',
          description: 'Start with a complimentary Discovery Call to explore what\'s possible for you.',
          primaryButtonText: 'Schedule Discovery Call',
          primaryButtonLink: '/shreeweb/booking?plan=discovery',
          secondaryButtonText: 'View All Offerings',
          secondaryButtonLink: '/shreeweb/offers',
          quote: '"The journey of a thousand miles begins with a single step." - Lao Tzu',
          backgroundColor: 'from-stone-100 via-amber-50 to-orange-100'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading about page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="w-full">
        <div className="text-center py-24">
          <p className="text-stone-600">About page content not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className={`py-16 px-4 text-center bg-gradient-to-br ${aboutData.hero?.backgroundColor || 'from-[#F4EFE6] via-amber-50 to-orange-50'} relative overflow-hidden sm:py-20 md:py-24`}
        data-aos="fade-in"
        data-aos-duration="300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-40 h-40 border border-amber-300 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-28 h-28 border border-stone-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-orange-300 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div 
            className="text-xs font-medium text-stone-600 mb-4 tracking-[0.2em] uppercase sm:text-sm sm:mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {aboutData.hero?.tag || 'About'}
          </div>
          <h1 
            className="text-4xl font-serif text-stone-800 mb-6 leading-tight sm:text-5xl md:text-6xl md:text-7xl sm:mb-8"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="300"
          >
            {aboutData.hero?.title || 'OMSHREEGUIDANCE'}
            <span className="block text-stone-600 italic font-light mt-2">{aboutData.hero?.subtitle || 'Energy Sessions'}</span>
          </h1>
          <div 
            className="w-24 h-0.5 bg-amber-400 mx-auto mb-6 sm:w-32 sm:mb-8"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="500"
          ></div>
          <p 
            className="text-lg text-stone-700 leading-relaxed max-w-4xl mx-auto font-light sm:text-xl md:text-2xl md:text-3xl"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="600"
          >
            {aboutData.hero?.description || 'A calm, structured approach to help you scan your energetic field, release what\'s stuck, and return to balance.'}
          </p>
        </div>
      </section>

      {/* About Me Section */}
      {aboutData.aboutMe && (
        <section 
          className={`py-16 px-4 bg-gradient-to-br ${aboutData.aboutMe?.backgroundColor || 'from-stone-50 to-amber-50'} relative overflow-hidden sm:py-20 md:py-24`}
          data-aos="fade-up"
          data-aos-duration="300"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-20 w-32 h-32 border border-amber-300 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 border border-stone-300 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-orange-300 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-8 sm:mb-12" data-aos="fade-up" data-aos-duration="200" data-aos-delay="100">
              <h2 className="text-3xl font-serif text-stone-800 mb-3 sm:text-4xl md:text-5xl md:text-6xl sm:mb-4">{aboutData.aboutMe.title}</h2>
              <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-4 sm:w-32 sm:mb-6"></div>
              <p className="text-lg text-stone-700 font-light italic sm:text-xl md:text-2xl md:text-3xl">{aboutData.aboutMe.subtitle}</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-stone-200/50 sm:rounded-3xl sm:p-8 md:p-10 md:p-14" data-aos="fade-up" data-aos-duration="300" data-aos-delay="200">
              <div className="prose prose-base max-w-none sm:prose-lg md:prose-xl">
                {aboutData.aboutMe.content.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index} 
                    className="text-stone-700 leading-relaxed mb-4 last:mb-0 text-base sm:text-lg sm:mb-6 md:text-xl"
                    data-aos="fade-up"
                    data-aos-duration="200"
                    data-aos-delay={300 + (index * 100)}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Decorative Element */}
            <div className="flex items-center justify-center space-x-2 mt-8 sm:space-x-3 sm:mt-12" data-aos="fade-up" data-aos-duration="200" data-aos-delay="500">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent sm:w-16"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full shadow-lg sm:w-3 sm:h-3"></div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent sm:w-16"></div>
            </div>
          </div>
        </section>
      )}

      {/* What We Do Section */}
      <section 
        className="py-16 px-4 sm:py-20"
        style={{ backgroundColor: aboutData.whatWeDo?.backgroundColor || '#F4EFE6' }}
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up" data-aos-duration="200" data-aos-delay="100">
            <h2 className="text-3xl font-serif text-stone-800 mb-4 sm:text-4xl md:text-5xl sm:mb-6">{aboutData.whatWeDo?.title || 'What we do'}</h2>
            <div className="w-20 h-0.5 bg-stone-400 mx-auto mb-6 sm:w-24 sm:mb-8"></div>
            <p className="text-lg text-stone-700 leading-relaxed max-w-4xl mx-auto font-light sm:text-xl md:text-2xl">
              {aboutData.whatWeDo?.description || 'The sessions work with your energetic system to cleanse, balance, and strengthen internal stability. The goal is to reduce internal resistance so you can hold your success with more ease.'}
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {aboutData.whatWeDo?.services?.map((service, index) => (
              <div 
                key={index}
                className="group"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay={200 + (index * 100)}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:from-stone-300 group-hover:to-amber-300 transition-all duration-300">
                    {service.icon === 'circle' && <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>}
                    {service.icon === 'filled-circle' && <div className="w-8 h-8 bg-stone-600 rounded-full"></div>}
                    {service.icon === 'grid' && (
                      <div className="grid grid-cols-2 gap-1 w-8 h-8">
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                        <div className="bg-stone-600 rounded-sm"></div>
                      </div>
                    )}
                    {service.icon === 'square' && <div className="w-8 h-8 bg-stone-600 rounded-lg"></div>}
                    {service.icon === 'diamond' && <div className="w-8 h-8 bg-stone-600 transform rotate-45"></div>}
                    {!service.icon && <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>}
                  </div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-4 text-center">{service.title || 'Service'}</h3>
                  <p className="text-stone-600 text-center leading-relaxed text-lg">
                    {service.description || 'Service description'}
                  </p>
                </div>
              </div>
            )) || [
              // Fallback services if none exist
              <div 
                key="scanning"
                className="group"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay="200"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:from-stone-300 group-hover:to-amber-300 transition-all duration-300">
                    <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>
                  </div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-4 text-center">Scanning</h3>
                  <p className="text-stone-600 text-center leading-relaxed text-lg">
                    Identify energy leaks and blocks that create friction in your daily experience.
                  </p>
                </div>
              </div>,
              <div 
                key="cleansing"
                className="group"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay="300"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                    <div className="w-8 h-8 bg-stone-600 rounded-full"></div>
                  </div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-4 text-center">Cleansing</h3>
                  <p className="text-stone-600 text-center leading-relaxed text-lg">
                    Release stagnant energy and clear external "noise" that no longer serves you.
                  </p>
                </div>
              </div>,
              <div 
                key="balancing"
                className="group"
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay="400"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:from-stone-300 group-hover:to-stone-400 transition-all duration-300">
                    <div className="grid grid-cols-2 gap-1 w-8 h-8">
                      <div className="bg-stone-600 rounded-sm"></div>
                      <div className="bg-stone-600 rounded-sm"></div>
                      <div className="bg-stone-600 rounded-sm"></div>
                      <div className="bg-stone-600 rounded-sm"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-stone-800 mb-4 text-center">Balancing</h3>
                  <p className="text-stone-600 text-center leading-relaxed text-lg">
                    Restore harmony and guide you back to a state of grounded power.
                  </p>
                </div>
              </div>
            ]}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={`py-20 px-4 bg-gradient-to-br ${aboutData.philosophy?.backgroundColor || 'from-stone-50 to-amber-50'} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-12 left-12 w-36 h-36 border border-stone-400 rounded-full"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 border border-amber-400 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-orange-400 rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">{aboutData.philosophy?.title || 'The OMSHREEGUIDANCE Approach'}</h2>
            <div className="w-32 h-0.5 bg-amber-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed max-w-4xl mx-auto font-light">
              {aboutData.philosophy?.description || 'Inspired by the minimalist principles of Japanese and Scandinavian design, our approach emphasizes simplicity, natural harmony, and sustainable well-being.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mb-6 flex items-center justify-center group-hover:from-stone-300 group-hover:to-amber-300 transition-all duration-300">
                  <svg className="w-8 h-8 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Simplicity</h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  We focus on what's essential, removing energetic clutter to reveal your natural clarity and strength.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl mb-6 flex items-center justify-center group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                  <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Natural Harmony</h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Working with your body's innate wisdom to restore balance rather than forcing change.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl mb-6 flex items-center justify-center group-hover:from-stone-300 group-hover:to-stone-400 transition-all duration-300">
                  <svg className="w-8 h-8 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Sustainable Growth</h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Building internal capacity that supports long-term expansion without burnout.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl mb-6 flex items-center justify-center group-hover:from-orange-300 group-hover:to-amber-300 transition-all duration-300">
                  <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Mindful Presence</h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Cultivating awareness and presence as the foundation for all meaningful transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section 
        className="py-20 px-4"
        style={{ backgroundColor: aboutData.howToStart?.backgroundColor || '#F4EFE6' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">{aboutData.howToStart?.title || 'How to get started'}</h2>
            <div className="w-24 h-0.5 bg-stone-400 mx-auto mb-8"></div>
            <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
              {aboutData.howToStart?.description || 'Your journey toward energetic alignment begins with a simple, structured process'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full flex flex-col">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-800 to-stone-700 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center font-bold text-2xl group-hover:from-stone-700 group-hover:to-stone-600 transition-all duration-300">
                  1
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Choose Your Path</h3>
                <p className="text-stone-600 leading-relaxed text-lg flex-grow">
                  Select an offering that matches your current capacity and desired expansion.
                </p>
                <div className="mt-6">
                  <Link
                    to="/offers"
                    className="inline-block px-6 py-3 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium"
                  >
                    View Offerings
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full flex flex-col">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center font-bold text-2xl group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                  2
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Complete Setup</h3>
                <p className="text-stone-600 leading-relaxed text-lg flex-grow">
                  Complete payment and submit the intake form to help us understand your needs.
                </p>
                <div className="mt-6">
                  <div className="inline-block px-6 py-3 bg-amber-100 text-amber-800 rounded-full font-medium">
                    Secure Process
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 h-full flex flex-col">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-600 to-amber-600 text-white rounded-2xl mx-auto mb-6 flex items-center justify-center font-bold text-2xl group-hover:from-stone-500 group-hover:to-amber-500 transition-all duration-300">
                  3
                </div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Begin Your Journey</h3>
                <p className="text-stone-600 leading-relaxed text-lg flex-grow">
                  Book your session and receive personalized guidance for your transformation.
                </p>
                <div className="mt-6">
                  <Link
                    to="/booking"
                    className="inline-block px-6 py-3 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-24 px-4 bg-gradient-to-br ${aboutData.callToAction?.backgroundColor || 'from-stone-100 via-amber-50 to-orange-100'} relative overflow-hidden mb-0`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-40 h-40 border border-amber-300 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-28 h-28 border border-stone-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-orange-300 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-stone-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 leading-tight">{aboutData.callToAction?.title || 'Ready to begin?'}</h2>
            <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-stone-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
              {aboutData.callToAction?.description || 'Start with a complimentary Discovery Call to explore what\'s possible for you.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={aboutData.callToAction?.primaryButtonLink || '/shreeweb/booking?plan=discovery'}
                className="inline-block px-10 py-4 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                {aboutData.callToAction?.primaryButtonText || 'Schedule Discovery Call'}
              </Link>
              <Link
                to={aboutData.callToAction?.secondaryButtonLink || '/shreeweb/offers'}
                className="inline-block px-10 py-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-full hover:bg-orange-100 hover:border-orange-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                {aboutData.callToAction?.secondaryButtonText || 'View All Offerings'}
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-stone-300/50">
              <p className="text-stone-500 italic">
                {aboutData.callToAction?.quote || '"The journey of a thousand miles begins with a single step." - Lao Tzu'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}