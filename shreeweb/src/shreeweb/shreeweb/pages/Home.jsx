import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TestimonialsSection from '../components/TestimonialsSection';
import EmailCapture from '../components/EmailCapture';
import OffersSection from '../components/OffersSection';
import HeroSection from '../components/HeroSection';
import ClaritySection from '../components/ClaritySection';
import VideoSection from '../components/VideoSection';
import { CmsHtmlPreview } from '../cms/cmsRichTextUtils';

export default function Home() {
  const [settings, setSettings] = useState({
    section: {
      sectionTitle: 'Curated Offerings',
      sectionDescription: 'Select the container that aligns with your current capacity and desired expansion.',
      backgroundColor: '#F4EFE6',
      cardBackground: '#EDE7DC'
    }
  });

  const [hiddenCost, setHiddenCost] = useState({
    title: 'The Hidden cost of high performance',
    paragraph1:
      'Many successful professionals experience burnout, mental fatigue, and internal pressure despite strong strategies and discipline.',
    paragraph2:
      'When your energetic system is misaligned, even the most perfect business strategy feels heavy. True expansion requires more than just mindset shifts—it requires energetic capacity.',
    image: '/healing2.png',
    imageAlt: 'Healing and wellness imagery',
  });

  const [growth, setGrowth] = useState({
    title: 'When growth begins to feel',
    subtitle: 'heavier than it should',
    introduction:
      'Many entrepreneurs and high-performing professionals reach a stage where <span className="text-stone-800 font-normal"> effort alone stops creating the results they expect.</span>',
    description1:
      'Often, these challenges are connected not only to mindset or strategy, but also to <span className="text-stone-700 font-medium"> imbalances within the energetic system.</span>',
    description2:
      'When the energy body carries accumulated stress or blockages, it can affect emotional balance, decision making, resilience, and the ability to sustain growth.',
    signsTitle: 'Signs you may recognize',
    ctaText: 'If these resonate with you, energetic alignment may be the missing piece.',
    ctaButtonText: 'Explore a Discovery Call',
    backgroundImage: '/healing.webp',
    overlayOpacity: 70,
    signs: [
      { id: 'g1', text: 'Persistent mental fatigue causing difficulty in decision making', featured: false },
      { id: 'g2', text: 'Difficulty maintaining focus or clarity', featured: false },
      { id: 'g3', text: 'Recurring stress or burnout cycles', featured: false },
      { id: 'g4', text: 'Internal resistance when stepping into larger opportunities', featured: false },
      { id: 'g5', text: 'The feeling that something deeper needs to shift', featured: true },
    ],
  });

  const [process, setProcess] = useState({
    title: 'Energetic Alignment for <em className=\"italic text-stone-600\">Sustainable Expansion</em>',
    description:
      'Sessions work deeply with your energetic system to cleanse, balance, and strengthen internal stability, allowing you to hold more success with less resistance.',
    steps: [
      { id: 'p1', title: 'Scanning', description: 'Identifying energetic leaks and blockages in your field that are creating friction in your daily life.', icon: 'circle' },
      { id: 'p2', title: 'Cleansing', description: 'Releasing stagnant energy and external pressures that no longer serve your highest vision.', icon: 'filled-circle' },
      { id: 'p3', title: 'Balancing', description: 'Restoring harmony to your chakras, anchoring you back into a state of grounded power.', icon: 'grid' },
    ],
  });

  const [targetAudience, setTargetAudience] = useState({
    title: 'This work is designed for',
    subtitle: 'Individuals ready to address the energetic foundations of sustainable success',
    ctaQuote: "Ready to explore what's possible when your energy and ambition are aligned?",
    ctaText: 'Start with a Discovery Call',
    audiences: [],
  });

  const [emailCaptureSection, setEmailCaptureSection] = useState({
    title: 'Stay Connected',
    description: 'Get updates when new sessions become available.',
    subtitle: 'No spam, just clarity.',
    buttonText: 'Stay Updated',
    placeholderText: 'your@email.com',
    backgroundColor: 'gradient-to-br from-stone-100 via-amber-50 to-orange-100',
    benefits: [],
    bottomNote: 'Join a community focused on sustainable growth and energetic alignment',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchHiddenCost();
  }, []);

  useEffect(() => {
    fetchGrowth();
  }, []);

  useEffect(() => {
    fetchProcess();
  }, []);

  useEffect(() => {
    fetchTargetAudience();
  }, []);

  useEffect(() => {
    fetchEmailCaptureSection();
  }, []);

  const resolveHiddenImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (/^https?:\/\//i.test(url)) return url;
    // Uploaded CMS assets are under `/uploads/...` and should be fetched from backend.
    if (url.startsWith('/uploads/')) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      return `${backendUrl}${url}`;
    }
    // Frontend static assets (ex: `/healing2.png`) stay as-is.
    return url;
  };

  const stripTags = (htmlOrText) => {
    const s = String(htmlOrText ?? '');
    // Simple strip for CMS TipTap HTML wrappers used in this project.
    return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

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

  const fetchHiddenCost = async () => {
    try {
      const response = await fetch('/backend/shreeweb-hidden-cost-section/public', {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to fetch hidden cost section');
      const data = await response.json();
      if (data?.success && data?.data) {
        setHiddenCost((prev) => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      // keep defaults if API fails
    }
  };

  const resolveGrowthImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '/healing.webp';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/uploads/')) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      return `${backendUrl}${url}`;
    }
    return url;
  };

  const fetchGrowth = async () => {
    try {
      const response = await fetch('/backend/shreeweb-growth-section/public', {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to fetch growth section');
      const data = await response.json();
      if (data?.success && data?.data) {
        setGrowth((prev) => ({ ...prev, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const fetchProcess = async () => {
    try {
      const response = await fetch('/backend/shreeweb-process-section/public', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch process section');
      const data = await response.json();
      if (data?.success && data?.data) {
        setProcess((prev) => ({ ...prev, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const fetchTargetAudience = async () => {
    try {
      const response = await fetch('/backend/shreeweb-target-audience-section/public', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch target audience section');
      const data = await response.json();
      if (data?.success && data?.data) {
        setTargetAudience((prev) => ({ ...prev, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const getEmailCaptureBgClass = (value) => {
    const v = String(value || '');
    if (v === 'gradient-to-br from-stone-100 via-amber-50 to-orange-100') {
      return 'bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100';
    }
    if (v === 'gradient-to-br from-amber-50 to-orange-100') {
      return 'bg-gradient-to-br from-amber-50 to-orange-100';
    }
    if (v === 'stone-100') return 'bg-stone-100';
    if (v === 'amber-50') return 'bg-amber-50';
    if (v === 'orange-50') return 'bg-orange-50';
    if (v === 'white') return 'bg-white';
    return 'bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100';
  };

  const fetchEmailCaptureSection = async () => {
    try {
      const response = await fetch('/backend/shreeweb-email-capture-section/public', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch email capture section');
      const data = await response.json();
      if (data?.success && data?.data) {
        setEmailCaptureSection((prev) => ({ ...prev, ...data.data }));
      }
    } catch {
      // keep defaults
    }
  };

  const renderProcessIcon = (icon) => {
    if (icon === 'circle') return <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>;
    if (icon === 'filled-circle') return <div className="w-8 h-8 bg-stone-600 rounded-full"></div>;
    if (icon === 'grid') {
      return (
        <div className="grid grid-cols-2 gap-1 w-8 h-8">
          <div className="bg-stone-600 rounded-sm"></div>
          <div className="bg-stone-600 rounded-sm"></div>
          <div className="bg-stone-600 rounded-sm"></div>
          <div className="bg-stone-600 rounded-sm"></div>
        </div>
      );
    }
    if (icon === 'square') return <div className="w-8 h-8 bg-stone-600 rounded-lg"></div>;
    if (icon === 'diamond') return <div className="w-8 h-8 bg-stone-600 transform rotate-45"></div>;
    return <div className="w-8 h-8 border-2 border-stone-600 rounded-full"></div>;
  };
  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Clarity Section - Restore clarity */}
      <ClaritySection />

      {/* 2.5. This Work Is Designed For - Static Section */}
      <section 
        className="py-16 px-4 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 sm:py-20"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-serif text-stone-800 mb-4 leading-tight sm:text-4xl md:text-5xl sm:mb-6">
                This work is designed for
              </h2>
              <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-6 sm:w-32 sm:mb-8"></div>
              <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed sm:text-xl">
                Individuals ready to address the energetic foundations of sustainable success
              </p>
            </div>
            
            {/* Audience Cards Grid */}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
              
              {/* Card 1: Entrepreneurs & Business Owners */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:rounded-3xl sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                  <div className="w-6 h-6 bg-amber-600 rounded-lg sm:w-8 sm:h-8"></div>
                </div>
                <h3 className="text-lg font-serif text-stone-800 text-center mb-3 sm:text-xl sm:mb-4">
                  Entrepreneurs & Business Owners
                </h3>
                <p className="text-sm text-stone-600 text-center leading-relaxed sm:text-base">
                  Leaders seeking to maintain high performance without sacrificing well-being
                </p>
              </div>

              {/* Card 2: Ambitious Professionals */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:rounded-3xl sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                  <div className="w-6 h-6 bg-orange-600 rounded-lg sm:w-8 sm:h-8"></div>
                </div>
                <h3 className="text-lg font-serif text-stone-800 text-center mb-3 sm:text-xl sm:mb-4">
                  Ambitious Professionals
                </h3>
                <p className="text-sm text-stone-600 text-center leading-relaxed sm:text-base">
                  High-achievers experiencing stress, burnout, or feeling stuck despite their efforts
                </p>
              </div>

              {/* Card 3: Growth & Transition Navigators */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:rounded-3xl sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                  <div className="w-6 h-6 bg-stone-600 rounded-lg sm:w-8 sm:h-8"></div>
                </div>
                <h3 className="text-lg font-serif text-stone-800 text-center mb-3 sm:text-xl sm:mb-4">
                  Growth & Transition Navigators
                </h3>
                <p className="text-sm text-stone-600 text-center leading-relaxed sm:text-base">
                  Individuals moving through periods of expansion or life transition
                </p>
              </div>

              {/* Card 4: Energetic Alignment Seekers */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:rounded-3xl sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                  <div className="w-6 h-6 bg-amber-600 rounded-lg sm:w-8 sm:h-8"></div>
                </div>
                <h3 className="text-lg font-serif text-stone-800 text-center mb-3 sm:text-xl sm:mb-4">
                  Energetic Alignment Seekers
                </h3>
                <p className="text-sm text-stone-600 text-center leading-relaxed sm:text-base">
                  People interested in deeper energetic work and holistic approaches to success
                </p>
              </div>

              {/* Card 5: Clarity & Balance Seekers */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 sm:rounded-3xl sm:p-8 md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                  <div className="w-6 h-6 bg-orange-600 rounded-lg sm:w-8 sm:h-8"></div>
                </div>
                <h3 className="text-lg font-serif text-stone-800 text-center mb-3 sm:text-xl sm:mb-4">
                  Clarity & Balance Seekers
                </h3>
                <p className="text-sm text-stone-600 text-center leading-relaxed sm:text-base">
                  People seeking greater clarity, stability, and internal balance to support their highest vision
                </p>
              </div>
            </div>
            
            {/* Bottom Call to Action */}
            <div className="text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200/50 max-w-3xl mx-auto sm:rounded-3xl sm:p-8">
                <p className="text-base text-stone-700 mb-4 italic sm:text-lg sm:mb-6">
                  "Ready to explore what's possible when your energy and ambition are aligned?"
                </p>
                <Link
                  to="/shreeweb/booking?plan=discovery"
                  className="group relative overflow-hidden inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-md text-white rounded-full hover:from-orange-600/90 hover:to-amber-600/90 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:px-12 sm:py-4 sm:text-base"
                >
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    Start with a Discovery Call
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hidden Cost Section */}
      <section 
        className="py-12 px-4 sm:py-16"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 items-center lg:grid-cols-2 lg:gap-12">
              <div data-aos="fade-right" data-aos-duration="300" data-aos-delay="100">
                <div className="border-t-2 border-stone-300 pt-4 mb-6 sm:pt-6 sm:mb-8">
                  <h2 className="text-2xl font-serif text-stone-800 italic mb-4 sm:text-3xl sm:mb-6">
                    {stripTags(hiddenCost.title)}
                  </h2>
                  <p className="text-sm text-stone-600 mb-3 sm:text-base sm:mb-4">{stripTags(hiddenCost.paragraph1)}</p>
                  <p className="text-sm text-stone-600 sm:text-base">{stripTags(hiddenCost.paragraph2)}</p>
                </div>
              </div>
              <div className="relative" data-aos="fade-left" data-aos-duration="300" data-aos-delay="200">
                <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg sm:h-80 md:h-96">
                  <img 
                    src={resolveHiddenImageUrl(hiddenCost.image)}
                    alt={hiddenCost.imageAlt || 'Healing and wellness imagery'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Energetic Alignment Process */}
      <section 
        className="py-12 px-4 sm:py-16"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="100"
            >
              <CmsHtmlPreview
                html={process.title}
                className="text-2xl font-serif text-stone-800 mb-3 sm:text-3xl sm:mb-4"
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="200"
            >
              <CmsHtmlPreview
                html={process.description}
                className="text-base text-stone-600 mb-8 sm:text-lg sm:mb-12"
              />
            </div>
            
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {Array.isArray(process.steps) &&
                process.steps.slice(0, 6).map((step, i) => (
                  <div 
                    key={step.id || i}
                    className="bg-[#EDE7DC] rounded-2xl p-6 sm:p-8"
                    data-aos="fade-up"
                    data-aos-duration="200"
                    data-aos-delay={300 + i * 100}
                  >
                    <div className="w-12 h-12 bg-stone-300 rounded-full mx-auto mb-4 flex items-center justify-center sm:w-16 sm:h-16 sm:mb-6">
                      {renderProcessIcon(step.icon)}
                    </div>
                    <h3 className="text-lg font-serif text-stone-800 mb-3 sm:text-xl sm:mb-4">{stripTags(step.title)}</h3>
                    <p className="text-sm text-stone-600 sm:text-base">{stripTags(step.description)}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Curated Offerings Section */}
      <section 
        className="py-16 px-4 relative overflow-hidden sm:py-20"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        {/* Enhanced background pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 right-16 w-40 h-40 border border-stone-300 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-16 left-16 w-28 h-28 border border-amber-300 rounded-full animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 border border-orange-300 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 left-1/3 w-24 h-24 border border-stone-400 rounded-full animate-pulse" style={{animationDuration: '7s', animationDelay: '3s'}}></div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-amber-50/20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-2xl font-serif text-stone-800 mb-3 sm:text-3xl md:text-4xl sm:mb-4"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="100"
            >
              {settings.section.sectionTitle}
            </h2>
            <p 
              className="text-base text-stone-600 mb-8 sm:text-lg sm:mb-12"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="200"
            >
              {settings.section.sectionDescription}
            </p>
            
            <div data-aos="fade-up" data-aos-duration="300" data-aos-delay="300">
              <OffersSection customSettings={settings} layout="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Video Section - Vertical video with text on side */}
      <VideoSection />

      {/* 7. Growth Section - When growth begins to feel heavier */}
      <section 
        className="py-16 px-4 relative min-h-[80vh] flex items-center sm:py-20 sm:min-h-screen"
        style={{
          backgroundImage: `url(${resolveGrowthImageUrl(growth.backgroundImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'scroll'
        }}
      >
        {/* Healing Overlay - Reduced Opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(255,255,255,${(growth.overlayOpacity ?? 70) / 100})`,
          }}
        ></div>
        
        {/* Subtle Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-orange-200/60 rounded-full animate-pulse shadow-md" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse shadow-lg" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/3 left-1/6 w-1.5 h-1.5 bg-orange-300/50 rounded-full animate-pulse" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          {/* Centered Content with Glass Morphism */}
          <div className="text-center space-y-8 sm:space-y-12">
            
            {/* Main Heading with Enhanced Breathing Space */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl sm:rounded-3xl sm:p-8">
                <h2 className="text-2xl font-light text-stone-800 leading-relaxed tracking-wide sm:text-3xl md:text-4xl">
                  {stripTags(growth.title)}
                  <span className="block text-stone-600 italic font-extralight mt-2 text-xl sm:mt-3 sm:text-2xl md:text-3xl">
                    {stripTags(growth.subtitle)}
                  </span>
                </h2>
                
                {/* Enhanced Zen-like Decorative Element */}
                <div className="flex items-center justify-center space-x-2 mt-4 sm:space-x-3 sm:mt-6">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent sm:w-12"></div>
                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-lg sm:w-3 sm:h-3"></div>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent sm:w-12"></div>
                </div>
              </div>
            </div>
            
            {/* Gentle Introduction with Glass Effect */}
            <div className="space-y-6 max-w-4xl mx-auto sm:space-y-8">
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg sm:rounded-2xl sm:p-8">
                <p className="text-base text-stone-700 leading-relaxed font-light mb-4 sm:text-lg md:text-xl sm:mb-6">
                  {stripTags(growth.introduction)}
                </p>
                
                <p className="text-sm text-stone-600 leading-relaxed mb-4 sm:text-base md:text-lg sm:mb-6">
                  {stripTags(growth.description1)}
                </p>
                
                <p className="text-sm text-stone-600 leading-relaxed sm:text-base">
                  {stripTags(growth.description2)}
                </p>
              </div>
            </div>
            
            {/* Mindful Signs Section with Enhanced Glass Morphism */}
            <div className="mt-12 sm:mt-16">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/25 shadow-2xl sm:rounded-3xl sm:p-8">
                <h3 className="text-lg font-light text-stone-700 mb-8 tracking-wide sm:text-xl sm:mb-12">
                  {growth.signsTitle}
                </h3>
                
                {/* Enhanced Clean List with Better Glass Effects */}
                <div className="space-y-4 max-w-3xl mx-auto sm:space-y-6">
                  {Array.isArray(growth.signs) &&
                    growth.signs.map((sign) => (
                      <div key={sign.id} className="group">
                        <div
                          className={`flex items-start space-x-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-500 shadow-lg hover:shadow-xl sm:space-x-4 sm:p-6 sm:rounded-2xl ${
                            sign.featured
                              ? 'bg-gradient-to-r from-white/25 to-orange-100/30 border-orange-200/40'
                              : 'bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/40'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 shadow-md sm:w-2 sm:h-2 sm:mt-3 ${
                              sign.featured
                                ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                                : 'bg-gradient-to-br from-orange-300 to-orange-400'
                            }`}
                          ></div>
                          <span
                            className={`text-sm leading-relaxed font-light sm:text-base ${
                              sign.featured ? 'text-stone-800 font-normal text-center w-full' : 'text-stone-700'
                            }`}
                          >
                            {stripTags(sign.text)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Enhanced Call to Action with Healing Aesthetic */}
            <div className="mt-12 pt-6 sm:mt-16 sm:pt-8">
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/25 shadow-2xl sm:rounded-3xl sm:p-10">
                <div className="space-y-6 sm:space-y-8">
                  <p className="text-stone-600 italic font-light leading-relaxed text-base sm:text-lg">
                    {stripTags(growth.ctaText)}
                  </p>
                  
                  {/* Enhanced Breathing Space with Healing Elements */}
                  <div className="py-4 flex items-center justify-center space-x-2 sm:py-6 sm:space-x-4">
                    <div className="w-6 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent sm:w-8"></div>
                    <div className="w-1.5 h-1.5 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full animate-pulse shadow-lg sm:w-2 sm:h-2"></div>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent sm:w-16"></div>
                    <div className="w-1.5 h-1.5 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full animate-pulse shadow-lg sm:w-2 sm:h-2" style={{animationDelay: '1s'}}></div>
                    <div className="w-6 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent sm:w-8"></div>
                  </div>
                  
                  <Link
                    to="/shreeweb/offers"
                    className="inline-flex items-center px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 text-stone-700 rounded-full hover:bg-white/40 hover:border-white/50 transition-all duration-500 font-light tracking-wide shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:px-12 sm:py-4 sm:text-base"
                  >
                    <span>{stripTags(growth.ctaButtonText)}</span>
                    <div className="ml-2 w-1 h-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-md sm:ml-3 sm:w-1.5 sm:h-1.5"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle Healing Energy Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-orange-300/60 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 left-1/3 w-0.5 h-0.5 bg-white/70 rounded-full animate-ping" style={{animationDuration: '5s', animationDelay: '3s'}}></div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <div data-aos="fade-up" data-aos-duration="300">
        <TestimonialsSection />
      </div>

      {/* Email Capture */}
      <section 
        className={`py-16 px-4 ${getEmailCaptureBgClass(emailCaptureSection.backgroundColor)} relative overflow-hidden mb-0 sm:py-20`}
        data-aos="fade-up"
        data-aos-duration="300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-12 left-12 w-36 h-36 border border-stone-400 rounded-full"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 border border-amber-400 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-orange-400 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Icon */}
            <div 
              className="w-16 h-16 bg-gradient-to-br from-stone-200 to-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center sm:w-20 sm:h-20 sm:mb-8"
              data-aos="zoom-in"
              data-aos-duration="200"
              data-aos-delay="100"
            >
              <svg className="w-8 h-8 text-stone-700 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Heading */}
            <h2 
              className="text-3xl font-serif text-stone-800 mb-4 leading-tight sm:text-4xl md:text-5xl sm:mb-6"
            >
              <CmsHtmlPreview html={emailCaptureSection.title} />
            </h2>
            
            {/* Decorative Line */}
            <div 
              className="w-20 h-0.5 bg-amber-400 mx-auto mb-6 sm:w-24 sm:mb-8"
            ></div>
            
            {/* Description */}
            <p 
              className="text-lg text-stone-600 mb-8 leading-relaxed max-w-2xl mx-auto sm:text-xl sm:mb-12"
            >
              <CmsHtmlPreview html={emailCaptureSection.description} />
              <span className="block mt-2 font-medium text-stone-700">
                <CmsHtmlPreview html={emailCaptureSection.subtitle} />
              </span>
            </p>
            
            {/* Email Capture Component */}
            <div 
              className="max-w-xl mx-auto mb-12 sm:mb-16"
            >
              <EmailCapture
                context="Homepage updates"
                buttonText={stripTags(emailCaptureSection.buttonText || 'Stay Updated')}
                placeholderText={stripTags(emailCaptureSection.placeholderText || 'your@email.com')}
              />
            </div>
            
            {/* Benefits Section */}
            <div className="mb-8 sm:mb-12">
              <div className="grid gap-6 text-center max-w-4xl mx-auto sm:gap-8 md:grid-cols-3">
                {(Array.isArray(emailCaptureSection.benefits) ? emailCaptureSection.benefits : []).map((b, i) => {
                  const icon = b?.icon || 'star';
                  const iconWrapClass =
                    icon === 'lightbulb'
                      ? 'bg-amber-100 group-hover:bg-amber-200'
                      : icon === 'heart'
                        ? 'bg-orange-100 group-hover:bg-orange-200'
                        : 'bg-stone-100 group-hover:bg-stone-200';

                  const iconColor =
                    icon === 'lightbulb' ? 'text-amber-600' : icon === 'heart' ? 'text-orange-600' : 'text-stone-600';

                  return (
                    <div key={b?.id || i} className="flex flex-col items-center group">
                      <div
                        className={`w-12 h-12 ${iconWrapClass} rounded-full flex items-center justify-center mb-3 transition-colors duration-300 sm:w-16 sm:h-16 sm:mb-4`}
                      >
                        {icon === 'clock' && (
                          <svg className={`w-6 h-6 ${iconColor} sm:w-8 sm:h-8`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {icon === 'lightbulb' && (
                          <svg className={`w-6 h-6 ${iconColor} sm:w-8 sm:h-8`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                        {icon === 'heart' && (
                          <svg className={`w-6 h-6 ${iconColor} sm:w-8 sm:h-8`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                        {!['clock', 'lightbulb', 'heart'].includes(icon) && (
                          <svg className={`w-6 h-6 ${iconColor} sm:w-8 sm:h-8`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-base font-serif text-stone-800 mb-2 sm:text-lg">{stripTags(b?.title || '')}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed sm:text-sm">{stripTags(b?.description || '')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Bottom Note */}
            <div 
              className="border-t border-stone-300/50 pt-6 sm:pt-8"
            >
              <p className="text-sm text-stone-500 italic leading-relaxed sm:text-base">
                <CmsHtmlPreview html={emailCaptureSection.bottomNote} />
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}