import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Updated layout: Text left, Video right
export default function SocialServicesSection() {
  const navigate = useNavigate();
  const [socialServicesData, setSocialServicesData] = useState({
    socialMedia: {
      facebook: { url: '#', enabled: true },
      instagram: { url: '#', enabled: true },
      tiktok: { url: '#', enabled: true },
      youtube: { url: '#', enabled: true }
    },
    mainHeading: 'Your next level of success may require more than strategy.',
    description: 'Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.',
    primaryButton: {
      text: 'Schedule a Discovery Call',
      enabled: true
    },
    secondaryButton: {
      text: 'Book a Session',
      enabled: true
    },
    styling: {
      backgroundColor: '#F4EFE6',
      textColor: '#1C1917',
      primaryButtonColor: '#EA580C',
      primaryButtonTextColor: '#FFFFFF',
      secondaryButtonColor: '#F97316',
      secondaryButtonTextColor: '#FFFFFF'
    },
    communitySection: {
      heading: 'Join Our Community',
      description:
        'Connect with like-minded individuals on their journey toward energetic alignment and sustainable expansion.',
      cards: [
        {
          title: 'Daily Insights',
          description: 'Gentle reminders and practices to support your energetic well-being.',
        },
        {
          title: 'Community Support',
          description: 'Connect with others on similar journeys of growth and transformation.',
        },
        {
          title: 'Live Sessions',
          description: 'Join live Q&A sessions and group practices for deeper connection.',
        },
      ],
    },
    callToAction: {
      heading: 'Ready to begin your journey?',
      description:
        'Start with a complimentary Discovery Call to explore what\'s possible for you.',
      buttonText: 'Schedule Discovery Call',
      buttonLink: '/shreeweb/booking?plan=discovery',
    },
    videoUrl: '/healing-video.mp4',
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialServicesData();
  }, []);

  const fetchSocialServicesData = async () => {
    try {
      const response = await fetch('/backend/shreeweb-social-services/public');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.socialServices) {
          setSocialServicesData((prev) => ({
            ...prev,
            ...data.socialServices,
            communitySection:
              data.socialServices.communitySection ?? prev.communitySection,
            callToAction:
              data.socialServices.callToAction ?? prev.callToAction,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching social services data:', error);
      // Keep default data on error
    } finally {
      setLoading(false);
    }
  };

  // Don't render if section is inactive
  if (!socialServicesData.isActive) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-16" style={{ backgroundColor: socialServicesData.styling.backgroundColor }}>
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-300 rounded w-96 mx-auto mb-6"></div>
            <div className="h-4 bg-stone-300 rounded w-full max-w-2xl mx-auto mb-2"></div>
            <div className="h-4 bg-stone-300 rounded w-80 mx-auto mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section with Two-Column Layout */}
      <section 
        className="relative overflow-hidden"
        style={{ backgroundColor: socialServicesData.styling.backgroundColor }}
      >
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Left Side - Text Content */}
              <div className="space-y-6 lg:space-y-8 lg:pr-8">
                {/* Social Media Links */}
                <div className="flex items-center gap-4 flex-wrap">
                  {socialServicesData.socialMedia.facebook.enabled && (
                    <a
                      href={socialServicesData.socialMedia.facebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all duration-300 shadow-lg border border-stone-200/50"
                      aria-label="Facebook"
                    >
                      <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  
                  {socialServicesData.socialMedia.instagram.enabled && (
                    <a
                      href={socialServicesData.socialMedia.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-50 hover:scale-110 transition-all duration-300 shadow-lg border border-stone-200/50"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  
                  {socialServicesData.socialMedia.tiktok.enabled && (
                    <a
                      href={socialServicesData.socialMedia.tiktok.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 shadow-lg border border-stone-200/50"
                      aria-label="TikTok"
                    >
                      <svg className="w-6 h-6 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  )}

                  {socialServicesData.socialMedia.youtube.enabled && (
                    <a
                      href={socialServicesData.socialMedia.youtube.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all duration-300 shadow-lg border border-stone-200/50"
                      aria-label="YouTube"
                    >
                      <svg className="w-6 h-6 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Main Heading */}
                <div>
                  <h1 
                    className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-tight"
                    style={{ color: socialServicesData.styling.textColor }}
                  >
                    {socialServicesData.mainHeading}
                  </h1>
                  
                  {/* Decorative Line */}
                  <div className="w-20 h-1 bg-amber-500 mb-6"></div>
                </div>
                
                {/* Description */}
                <p 
                  className="text-base md:text-lg lg:text-xl leading-relaxed"
                  style={{ color: socialServicesData.styling.textColor }}
                >
                  {socialServicesData.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {socialServicesData.primaryButton.enabled && (
                    <button
                      type="button"
                      onClick={() => navigate('/shreeweb/booking?plan=discovery')}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:scale-105"
                      style={{ 
                        backgroundColor: socialServicesData.styling.primaryButtonColor,
                        color: socialServicesData.styling.primaryButtonTextColor
                      }}
                    >
                      {socialServicesData.primaryButton.text}
                    </button>
                  )}
                  
                  {socialServicesData.secondaryButton.enabled && (
                    <button
                      type="button"
                      onClick={() => navigate('/shreeweb/offers')}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:scale-105 border-2"
                      style={{ 
                        backgroundColor: 'transparent',
                        color: socialServicesData.styling.secondaryButtonColor,
                        borderColor: socialServicesData.styling.secondaryButtonColor
                      }}
                    >
                      {socialServicesData.secondaryButton.text}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Video Only */}
              <div className="lg:sticky lg:top-24">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Video Container - Standalone */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white" 
                       style={{ aspectRatio: '9/16' }}>
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={socialServicesData.videoUrl || '/healing-video.mp4'} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section
        className="py-16 px-4 bg-[#EDE7DC]"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-serif text-stone-800 mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            {socialServicesData.communitySection.heading}
          </h2>
          <p
            className="text-lg text-stone-600 mb-8 leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {socialServicesData.communitySection.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="bg-white rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-stone-800 mb-2">
                {socialServicesData.communitySection.cards?.[0]?.title}
              </h3>
              <p className="text-stone-600 text-sm">
                {socialServicesData.communitySection.cards?.[0]?.description}
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="400"
            >
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-stone-800 mb-2">
                {socialServicesData.communitySection.cards?.[1]?.title}
              </h3>
              <p className="text-stone-600 text-sm">
                {socialServicesData.communitySection.cards?.[1]?.description}
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-6"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay="500"
            >
              <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-stone-800 mb-2">
                {socialServicesData.communitySection.cards?.[2]?.title}
              </h3>
              <p className="text-stone-600 text-sm">
                {socialServicesData.communitySection.cards?.[2]?.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 bg-gradient-to-br from-amber-200 to-orange-200 text-stone-800"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-serif mb-6"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="100"
          >
            {socialServicesData.callToAction.heading}
          </h2>
          <p
            className="text-lg mb-8 opacity-90"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            {socialServicesData.callToAction.description}
          </p>
          {socialServicesData.callToAction.buttonLink ? (
            <a
              href={socialServicesData.callToAction.buttonLink}
              className="inline-block px-8 py-4 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium shadow-sm"
              data-aos="zoom-in"
              data-aos-duration="200"
              data-aos-delay="300"
            >
              {socialServicesData.callToAction.buttonText}
            </a>
          ) : null}
        </div>
      </section>
    </>
  );
}
