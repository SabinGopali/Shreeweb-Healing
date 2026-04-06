import React, { useState, useEffect } from 'react';

export default function PrivacyPolicy() {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyData();
  }, []);

  const fetchPrivacyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/backend/shreeweb-privacy-policy/public', {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setPrivacyData(data.data);
      } else {
        // Fallback data
        setPrivacyData({
          hero: {
            tag: 'Privacy Policy',
            title: 'Your privacy is respected',
            subtitle: 'and handled with care'
          },
          lastUpdatedDate: '6 April 2026',
          introduction: {
            description: 'This policy outlines how your information is collected, used, and protected when you engage with Om Shree Guidance, its website, and services.'
          },
          informationCollection: {
            title: '1. Information We Collect',
            description: 'When you interact with this space, you may choose to provide:',
            items: ['Name', 'Email address', 'Contact details', 'Information shared through forms, bookings, or sessions'],
            technicalData: 'In addition, limited technical data (such as browser type, device, and general usage patterns) may be collected to ensure a smooth and refined experience.'
          },
          howWeUse: {
            title: '2. How Your Information Is Used',
            description: 'Your information is used with intention, only where necessary, to:',
            items: ['Facilitate bookings and deliver services', 'Communicate regarding sessions, inquiries, or updates', 'Improve the overall experience and offerings'],
            optInNote: 'You will only receive communication beyond service-related updates if you have explicitly opted in.',
            noSelling: 'Your information is never sold, rented, or shared for external marketing purposes.'
          },
          confidentiality: {
            title: '3. Confidentiality',
            description: 'All personal information, as well as anything shared during sessions, is treated with strict confidentiality and professional discretion.'
          },
          dataProtection: {
            title: '4. Data Protection',
            description: 'Appropriate measures are in place to protect your data. However, as with all digital platforms, absolute security cannot be guaranteed.'
          },
          thirdPartyServices: {
            title: '5. Third-Party Services',
            description: 'Trusted third-party platforms (such as payment processors or booking systems) may be used to support operations. These services operate under their own privacy policies.'
          },
          yourRights: {
            title: '6. Your Rights',
            description: 'You may request to:',
            items: ['Access your personal data', 'Update or correct your information', 'Request deletion of your data'],
            contactNote: 'For any such requests, contact:',
            contactEmail: 'omshreeguidance@gmail.com'
          },
          policyUpdates: {
            title: '7. Policy Updates',
            description: 'This policy may be refined over time. Continued use of this website and services indicates acceptance of any updates.'
          }
        });
      }
    } catch (err) {
      console.error('Error fetching privacy policy:', err);
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
            <p className="text-stone-600">Loading privacy policy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!privacyData) return null;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-br from-[#F4EFE6] via-amber-50 to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-40 h-40 border border-amber-300 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-28 h-28 border border-stone-300 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-sm font-medium text-stone-600 mb-6 tracking-[0.2em] uppercase">
            {privacyData.hero?.tag || 'Privacy Policy'}
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-stone-800 mb-4 leading-tight">
            {privacyData.hero?.title || 'Your privacy is respected'}
          </h1>
          <p className="text-3xl md:text-4xl text-stone-600 italic font-light">
            {privacyData.hero?.subtitle || 'and handled with care'}
          </p>
          <div className="w-32 h-0.5 bg-amber-400 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-[#F4EFE6]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-stone-200/50">
            
            {/* Last Updated */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm text-amber-800 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last Updated: {privacyData.lastUpdatedDate || '6 April 2026'}
              </div>
            </div>

            {/* Introduction */}
            {privacyData.introduction && (
              <div className="mb-12 text-center">
                <p className="text-lg text-stone-700 leading-relaxed">
                  {privacyData.introduction.description}
                </p>
              </div>
            )}

            <div className="space-y-10">
              {/* 1. Information We Collect */}
              {privacyData.informationCollection && (
                <div className="border-l-4 border-amber-400 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.informationCollection.title}</h2>
                  <p className="text-base text-stone-700 mb-3">{privacyData.informationCollection.description}</p>
                  <ul className="space-y-2 mb-4">
                    {privacyData.informationCollection.items?.map((item, index) => (
                      <li key={index} className="text-base text-stone-700">• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base text-stone-600 italic">{privacyData.informationCollection.technicalData}</p>
                </div>
              )}

              {/* 2. How Your Information Is Used */}
              {privacyData.howWeUse && (
                <div className="border-l-4 border-stone-400 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.howWeUse.title}</h2>
                  <p className="text-base text-stone-700 mb-3">{privacyData.howWeUse.description}</p>
                  <ul className="space-y-2 mb-4">
                    {privacyData.howWeUse.items?.map((item, index) => (
                      <li key={index} className="text-base text-stone-700">• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base text-stone-700 mb-2">{privacyData.howWeUse.optInNote}</p>
                  <p className="text-base text-stone-800 font-medium">{privacyData.howWeUse.noSelling}</p>
                </div>
              )}

              {/* 3. Confidentiality */}
              {privacyData.confidentiality && (
                <div className="border-l-4 border-orange-400 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.confidentiality.title}</h2>
                  <p className="text-base text-stone-700">{privacyData.confidentiality.description}</p>
                </div>
              )}

              {/* 4. Data Protection */}
              {privacyData.dataProtection && (
                <div className="border-l-4 border-amber-600 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.dataProtection.title}</h2>
                  <p className="text-base text-stone-700">{privacyData.dataProtection.description}</p>
                </div>
              )}

              {/* 5. Third-Party Services */}
              {privacyData.thirdPartyServices && (
                <div className="border-l-4 border-stone-600 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.thirdPartyServices.title}</h2>
                  <p className="text-base text-stone-700">{privacyData.thirdPartyServices.description}</p>
                </div>
              )}

              {/* 6. Your Rights */}
              {privacyData.yourRights && (
                <div className="border-l-4 border-amber-500 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.yourRights.title}</h2>
                  <p className="text-base text-stone-700 mb-3">{privacyData.yourRights.description}</p>
                  <ul className="space-y-2 mb-4">
                    {privacyData.yourRights.items?.map((item, index) => (
                      <li key={index} className="text-base text-stone-700">• {item}</li>
                    ))}
                  </ul>
                  <p className="text-base text-stone-700 mb-2">{privacyData.yourRights.contactNote}</p>
                  <a 
                    href={`mailto:${privacyData.yourRights.contactEmail}`}
                    className="text-base text-amber-700 hover:text-amber-800 font-medium underline"
                  >
                    {privacyData.yourRights.contactEmail}
                  </a>
                </div>
              )}

              {/* 7. Policy Updates */}
              {privacyData.policyUpdates && (
                <div className="border-l-4 border-stone-500 pl-6">
                  <h2 className="text-2xl font-serif text-stone-800 mb-4">{privacyData.policyUpdates.title}</h2>
                  <p className="text-base text-stone-700">{privacyData.policyUpdates.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
