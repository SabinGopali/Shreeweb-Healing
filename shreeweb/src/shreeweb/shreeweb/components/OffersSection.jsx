import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OffersSection({ customSettings = null }) {
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
              
              <div className="text-3xl font-serif text-stone-800 mb-6 font-medium">
                {offering.price}
              </div>

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

