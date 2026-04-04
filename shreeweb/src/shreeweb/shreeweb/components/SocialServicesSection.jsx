import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-stone-300 rounded mr-1"></div>
                <div className="h-4 bg-stone-300 rounded w-16"></div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-stone-300 rounded mr-1"></div>
                <div className="h-4 bg-stone-300 rounded w-18"></div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-stone-300 rounded mr-1"></div>
                <div className="h-4 bg-stone-300 rounded w-12"></div>
              </div>
            </div>
            <div className="h-8 bg-stone-300 rounded w-96 mx-auto mb-6"></div>
            <div className="h-4 bg-stone-300 rounded w-full max-w-2xl mx-auto mb-2"></div>
            <div className="h-4 bg-stone-300 rounded w-80 mx-auto mb-8"></div>
            <div className="flex justify-center gap-4">
              <div className="h-12 bg-stone-300 rounded-full w-48"></div>
              <div className="h-12 bg-stone-300 rounded-full w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
      className="py-16 relative overflow-hidden"
      style={{ backgroundColor: socialServicesData.styling.backgroundColor }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-current"></div>
        <div className="absolute top-32 right-20 w-24 h-24 rounded-full border border-current"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full border border-current"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 rounded-full border border-current"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social Media Links inline with text */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
              {socialServicesData.socialMedia.facebook.enabled && (
                <a
                  href={socialServicesData.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
                  style={{ color: socialServicesData.styling.textColor }}
                >
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
              
              {socialServicesData.socialMedia.instagram.enabled && (
                <a
                  href={socialServicesData.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
                  style={{ color: socialServicesData.styling.textColor }}
                >
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                  Instagram
                </a>
              )}
              
              {socialServicesData.socialMedia.tiktok.enabled && (
                <a
                  href={socialServicesData.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
                  style={{ color: socialServicesData.styling.textColor }}
                >
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </a>
              )}

              {socialServicesData.socialMedia.youtube.enabled && (
                <a
                  href={socialServicesData.socialMedia.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
                  style={{ color: socialServicesData.styling.textColor }}
                >
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              )}
            </div>

            {/* Main Heading */}
            <h2 
              className="text-2xl md:text-3xl font-serif mb-6 leading-tight"
              style={{ color: socialServicesData.styling.textColor }}
            >
              {socialServicesData.mainHeading}
            </h2>
            
            {/* Description */}
            <p 
              className="text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: socialServicesData.styling.textColor }}
            >
              {socialServicesData.description}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {socialServicesData.primaryButton.enabled && (
              <button
                type="button"
                onClick={() => navigate('/shreeweb/booking?plan=discovery')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all hover:shadow-lg"
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
                onClick={() => navigate('/shreeweb/booking')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all hover:shadow-lg border-2"
                style={{ 
                  backgroundColor: socialServicesData.styling.secondaryButtonColor,
                  color: socialServicesData.styling.secondaryButtonTextColor,
                  borderColor: socialServicesData.styling.secondaryButtonColor
                }}
              >
                {socialServicesData.secondaryButton.text}
              </button>
            )}
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