import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  const [cookieData, setCookieData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCookieData();
  }, []);

  const fetchCookieData = async () => {
    try {
      const response = await fetch('/backend/shreeweb-cookie-policy/public');
      const data = await response.json();
      
      if (data.success) {
        setCookieData(data.data);
      }
    } catch (error) {
      console.error('Error fetching cookie policy data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails
  const fallbackData = {
    hero: {
      tag: 'Cookie Policy',
      title: 'Cookie',
      subtitle: 'transparency',
      description: 'Understanding how we use cookies and similar technologies to enhance your experience on our website.'
    },
    lastUpdatedDate: 'March 2026',
    understandingCookies: {
      title: 'Understanding Cookies & Similar Technologies',
      whatAreCookies: {
        title: 'What Are Cookies?',
        description: 'Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, improve your experience, and understand how you interact with our site. We use cookies responsibly and transparently.'
      },
      cookieTypes: {
        firstParty: {
          title: 'First-Party Cookies',
          description: 'Set directly by our website to remember your preferences and improve functionality.'
        },
        session: {
          title: 'Session Cookies',
          description: 'Temporary cookies that expire when you close your browser, used for essential site functions.'
        },
        persistent: {
          title: 'Persistent Cookies',
          description: 'Remain on your device for a set period to remember your preferences across visits.'
        }
      }
    },
    contactSection: {
      description: 'Questions about our cookie practices? We\'re transparent about our approach.',
      buttonText: 'Contact Us'
    }
  };

  const data = cookieData || fallbackData;

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading cookie policy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center bg-gradient-to-br from-[#F4EFE6] via-amber-50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-40 h-40 border border-amber-300 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-28 h-28 border border-stone-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-orange-300 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-sm font-medium text-stone-600 mb-6 tracking-[0.2em] uppercase">{data.hero.tag}</div>
          <h1 className="text-6xl md:text-7xl font-serif text-stone-800 mb-8 leading-tight">
            {data.hero.title}
            <span className="block text-stone-600 italic font-light mt-2">{data.hero.subtitle}</span>
          </h1>
          <div className="w-32 h-0.5 bg-amber-400 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-stone-700 leading-relaxed max-w-4xl mx-auto font-light">
            {data.hero.description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-[#F4EFE6]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-stone-200/50">
            
            {/* Last Updated */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm text-amber-800 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last Updated: {data.lastUpdatedDate}
              </div>
            </div>

            <div className="space-y-12">
              {/* Understanding Cookies */}
              <div className="border-l-4 border-amber-400 pl-8">
                <h2 className="text-3xl font-serif text-stone-800 mb-6">{data.understandingCookies.title}</h2>
                
                <div className="bg-amber-50 rounded-2xl p-8 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-stone-800 mb-3">{data.understandingCookies.whatAreCookies.title}</h3>
                      <p className="text-base text-stone-700 leading-relaxed">
                        {data.understandingCookies.whatAreCookies.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-stone-50 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-stone-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {data.understandingCookies.cookieTypes.firstParty.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {data.understandingCookies.cookieTypes.firstParty.description}
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-stone-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {data.understandingCookies.cookieTypes.session.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {data.understandingCookies.cookieTypes.session.description}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-stone-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {data.understandingCookies.cookieTypes.persistent.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {data.understandingCookies.cookieTypes.persistent.description}
                    </p>
                  </div>
                </div>
              </div>


            </div>

            {/* Contact Section */}
            <div className="mt-12 pt-8 border-t border-stone-300/50 text-center">
              <p className="text-stone-600 mb-6 italic">
                {data.contactSection.description}
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-4 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {data.contactSection.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}