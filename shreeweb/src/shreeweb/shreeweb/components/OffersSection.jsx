import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OffersSection({ customSettings = null, layout = 'expanded' }) {
  const [params] = useSearchParams();
  const [offerings, setOfferings] = useState([]);
  const [settings, setSettings] = useState({
    section: {
      cardBackground: '#EDE7DC'
    }
  });
  const [loading, setLoading] = useState(true);
  const highlighted = params.get('plan') || '';

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const response = await fetch('/backend/shreeweb-offerings/public/with-settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch offerings');
      }

      const data = await response.json();
      if (data.success) {
        // Flatten the grouped offerings and sort by order
        const allOfferings = [
          ...data.offerings.introductory,
          ...data.offerings.single,
          ...data.offerings.recurring,
          ...data.offerings.program
        ].sort((a, b) => a.order - b.order);
        
        setOfferings(allOfferings);
        
        // Update settings if available
        if (data.settings && data.settings.section) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
      // Fallback to default offerings if API fails
      setOfferings([
        {
          _id: 'discovery',
          title: 'Discovery Call',
          subtitle: 'Introductory',
          duration: '45 Min',
          description: 'A complimentary session to explore your current energetic landscape and discuss a customized plan for you.',
          price: 'Free'
        },
        {
          _id: 'alignment',
          title: 'Energetic Alignment',
          subtitle: 'Single Session',
          duration: '90 Min',
          description: 'A deep-dive single session for immediate clarity, cleansing, and recalibration.',
          price: '$111'
        },
        {
          _id: 'reset',
          title: 'Energetic Reset',
          subtitle: 'Recurring Sessions',
          duration: '2 Sessions Over 2 Weeks',
          description: 'A structured two week program to clear deep-seated burnout and restore baseline stability.',
          price: '$333'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Use custom settings if provided, otherwise use fetched settings
  const activeSettings = customSettings || settings;

  // Compact layout (3-column grid for home page)
  if (layout === 'compact') {
    if (loading) {
      return (
        <section className="py-0">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="rounded-3xl p-8 shadow-lg animate-pulse border border-stone-200/30"
                style={{ 
                  backgroundColor: `${activeSettings.section.cardBackground}F0`,
                  backgroundImage: `linear-gradient(135deg, ${activeSettings.section.cardBackground}F0 0%, ${activeSettings.section.cardBackground}E0 100%)`
                }}
              >
                <div className="h-4 bg-stone-300 rounded mb-3 w-20"></div>
                <div className="h-6 bg-stone-300 rounded mb-2 w-32"></div>
                <div className="h-4 bg-stone-300 rounded mb-6 w-16"></div>
                <div className="h-20 bg-stone-300 rounded mb-8"></div>
                <div className="h-8 bg-stone-300 rounded mb-6 w-20"></div>
                <div className="h-10 bg-stone-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="py-0">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {offerings.map((offering, index) => {
            const isHighlighted = highlighted && highlighted === offering._id;
            return (
              <article
                key={offering._id}
                className={`rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl flex flex-col h-full border border-stone-200/30 ${
                  isHighlighted ? 'ring-2 ring-stone-400 shadow-xl' : 'hover:shadow-2xl'
                }`}
                style={{ 
                  backgroundColor: isHighlighted 
                    ? activeSettings.section.cardBackground 
                    : `${activeSettings.section.cardBackground}F0`,
                  backgroundImage: `linear-gradient(135deg, ${activeSettings.section.cardBackground}F0 0%, ${activeSettings.section.cardBackground}E0 100%)`
                }}
                data-aos="fade-up"
                data-aos-duration="200"
                data-aos-delay={200 + index * 100}
              >
                {offering.subtitle && (
                  <div className="text-sm font-medium text-stone-600 mb-3 tracking-wide uppercase">
                    {offering.subtitle}
                  </div>
                )}
                
                <h3 className="text-2xl font-serif text-stone-800 mb-2 italic leading-tight">
                  {offering.title}
                </h3>
                
                {offering.duration && (
                  <div className="text-sm text-stone-600 mb-6 font-medium">
                    {offering.duration}
                  </div>
                )}
                
                <p className="text-base text-stone-700 mb-8 leading-relaxed flex-grow">
                  {offering.description}
                </p>
                
                {offering.hasDiscount && offering.originalPrice && offering.discountedPrice ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-serif text-stone-500 line-through">
                        {offering.originalPrice}
                      </span>
                      <span className="text-3xl font-serif text-amber-700 font-medium">
                        {offering.discountedPrice}
                      </span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
                      Limited Time Offer
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-serif text-stone-800 mb-6 font-medium">
                    {offering.price}
                  </div>
                )}

                <div className="mt-auto">
                  <Link
                    to={`/shreeweb/booking?plan=${encodeURIComponent(offering._id)}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-medium text-orange-800 hover:bg-orange-100 transition-colors shadow-sm hover:shadow-md"
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  // Expanded layout (full-width cards for offers page)

  if (loading) {
    return (
      <section className="py-0">
        <div className="mx-auto w-full max-w-[1600px] px-4 space-y-12">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="rounded-3xl shadow-lg animate-pulse border border-stone-200/30 overflow-hidden"
              style={{ 
                backgroundColor: `${activeSettings.section.cardBackground}F0`,
                backgroundImage: `linear-gradient(135deg, ${activeSettings.section.cardBackground}F0 0%, ${activeSettings.section.cardBackground}E0 100%)`
              }}
            >
              <div className="p-10 lg:p-14 xl:p-16">
                {/* Header skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 pb-8 border-b border-stone-300/50">
                  <div className="flex-1">
                    <div className="h-4 bg-stone-300 rounded mb-4 w-28"></div>
                    <div className="h-12 bg-stone-300 rounded mb-4 w-96"></div>
                    <div className="h-6 bg-stone-300 rounded w-40"></div>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-4">
                    <div className="h-16 bg-stone-300 rounded w-32"></div>
                    <div className="h-14 bg-stone-300 rounded w-40"></div>
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-6">
                    <div>
                      <div className="h-6 bg-stone-300 rounded mb-3 w-24"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-stone-300 rounded w-full"></div>
                        <div className="h-5 bg-stone-300 rounded w-full"></div>
                        <div className="h-5 bg-stone-300 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div>
                      <div className="h-6 bg-stone-300 rounded mb-3 w-32"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-stone-300 rounded w-full"></div>
                        <div className="h-5 bg-stone-300 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="h-6 bg-stone-300 rounded mb-4 w-28"></div>
                    <div className="space-y-4">
                      <div className="h-6 bg-stone-300 rounded w-full"></div>
                      <div className="h-6 bg-stone-300 rounded w-full"></div>
                      <div className="h-6 bg-stone-300 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-0">
      <div className="mx-auto w-full max-w-[1600px] px-4 space-y-12">
        {offerings.map((offering, index) => {
          const isHighlighted = highlighted && highlighted === offering._id;
          
          return (
            <article
              key={offering._id}
              className={`rounded-3xl shadow-lg transition-all hover:shadow-2xl border border-stone-200/30 overflow-hidden ${
                isHighlighted ? 'ring-2 ring-stone-400 shadow-2xl' : 'hover:shadow-2xl'
              }`}
              style={{ 
                backgroundColor: isHighlighted 
                  ? activeSettings.section.cardBackground 
                  : `${activeSettings.section.cardBackground}F0`,
                backgroundImage: `linear-gradient(135deg, ${activeSettings.section.cardBackground}F0 0%, ${activeSettings.section.cardBackground}E0 100%)`
              }}
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay={200 + index * 100}
            >
              <div className="p-10 lg:p-14 xl:p-16">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 pb-8 border-b border-stone-300/50">
                  <div className="flex-1">
                    {offering.subtitle && (
                      <div className="text-sm font-medium text-stone-600 mb-4 tracking-wide uppercase">
                        {offering.subtitle}
                      </div>
                    )}
                    
                    <h3 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-stone-800 mb-4 italic leading-tight">
                      {offering.title}
                    </h3>
                    
                    {offering.duration && (
                      <div className="text-base lg:text-lg text-stone-600 font-medium flex items-center gap-2">
                        <svg className="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {offering.duration}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-4">
                    {offering.hasDiscount && offering.originalPrice && offering.discountedPrice ? (
                      <div className="text-right">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl lg:text-4xl font-serif text-stone-500 line-through">
                            {offering.originalPrice}
                          </span>
                          <span className="text-5xl lg:text-6xl font-serif text-amber-700 font-medium">
                            {offering.discountedPrice}
                          </span>
                        </div>
                        <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200 shadow-sm">
                          Limited Time Offer
                        </div>
                      </div>
                    ) : (
                      <div className="text-5xl lg:text-6xl font-serif text-stone-800 font-medium">
                        {offering.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Column - Descriptions */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-serif text-stone-800 mb-3 font-medium">Overview</h4>
                      <p className="text-base lg:text-lg text-stone-700 leading-relaxed">
                        {offering.description}
                      </p>
                    </div>

                    {offering.detailedDescription && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-3 font-medium">What to Expect</h4>
                        <p className="text-base lg:text-lg text-stone-600 leading-relaxed whitespace-pre-line">
                          {offering.detailedDescription}
                        </p>
                      </div>
                    )}

                    {offering.whoIsThisFor && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-3 font-medium">Who This Is For</h4>
                        <p className="text-base lg:text-lg text-stone-600 leading-relaxed whitespace-pre-line">
                          {offering.whoIsThisFor}
                        </p>
                      </div>
                    )}

                    {offering.whatYouWillReceive && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-3 font-medium">What You'll Receive</h4>
                        <p className="text-base lg:text-lg text-stone-600 leading-relaxed whitespace-pre-line">
                          {offering.whatYouWillReceive}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Highlights/Features & Outcomes */}
                  <div className="space-y-8">
                    {offering.highlights && offering.highlights.length > 0 && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-4 font-medium">Key Benefits</h4>
                        <ul className="space-y-4">
                          {offering.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-stone-700">
                              <svg className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-base lg:text-lg leading-relaxed">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {offering.features && offering.features.length > 0 && !offering.highlights?.length && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-4 font-medium">Includes</h4>
                        <ul className="space-y-4">
                          {offering.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-stone-700">
                              <svg className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-base lg:text-lg leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {offering.outcomes && offering.outcomes.length > 0 && (
                      <div>
                        <h4 className="text-xl font-serif text-stone-800 mb-4 font-medium">Expected Outcomes</h4>
                        <ul className="space-y-4">
                          {offering.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-stone-700">
                              <svg className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-base lg:text-lg leading-relaxed">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Now Button - Bottom Right */}
                <div className="mt-8 pt-8 border-t border-stone-300/50 flex justify-end">
                  <Link
                    to={`/shreeweb/booking?plan=${encodeURIComponent(offering._id)}`}
                    className="inline-flex items-center justify-center rounded-full border-2 border-orange-300 bg-orange-50 px-10 py-4 text-base lg:text-lg font-medium text-orange-800 hover:bg-orange-100 hover:border-orange-400 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Book Now
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

