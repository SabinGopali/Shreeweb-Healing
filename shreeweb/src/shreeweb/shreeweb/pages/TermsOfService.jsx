import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTermsData();
  }, []);

  const fetchTermsData = async () => {
    try {
      const response = await fetch('/backend/shreeweb-terms-of-service/public');
      const data = await response.json();
      
      if (data.success) {
        setTermsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching terms of service data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data
  const fallbackData = {
    hero: {
      tag: 'Terms of Service',
      title: 'Clear expectations',
      subtitle: 'for your journey',
      description: 'These terms are designed to create clarity, mutual respect, and energetic integrity within this work.'
    },
    lastUpdatedDate: '6 April 2026',
    introduction: {
      description: 'By accessing this website or engaging with Om Shree Guidance, you agree to the following:'
    }
  };

  const data = termsData || fallbackData;

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading terms of service...</p>
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
          <div className="text-sm font-medium text-stone-600 mb-6 tracking-[0.2em] uppercase">
            {data.hero?.tag || 'Terms of Service'}
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-stone-800 mb-8 leading-tight">
            {data.hero?.title || 'Clear expectations'} 
            <span className="block text-stone-600 italic font-light mt-2">
              {data.hero?.subtitle || 'for your journey'}
            </span>
          </h1>
          <div className="w-32 h-0.5 bg-amber-400 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-stone-700 leading-relaxed max-w-4xl mx-auto font-light">
            {data.hero?.description || 'These terms are designed to create clarity, mutual respect, and energetic integrity within this work.'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 bg-[#F4EFE6]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-stone-200/50">
            
            {/* Last Updated */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-sm text-amber-800 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last Updated: {data.lastUpdatedDate || '6 April 2026'}
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-12 text-center">
              <p className="text-lg text-stone-700 leading-relaxed">
                {data.introduction?.description || 'By accessing this website or engaging with Om Shree Guidance, you agree to the following:'}
              </p>
            </div>

            <div className="space-y-10">
              {/* 1. Nature of Services */}
              <div className="border-l-4 border-amber-400 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.natureOfServices?.title || '1. Nature of Services'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.natureOfServices?.description || 'All services are conducted online and are based on subtle energy work and personal support practices.'}
                </p>
                <p className="text-base text-stone-600 leading-relaxed italic">
                  {data.natureOfServices?.note || 'This work is intended to support clarity, alignment, and energetic balance. No physical sessions are provided.'}
                </p>
              </div>

              {/* 2. Scope & Expectations */}
              <div className="border-l-4 border-stone-400 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.scopeExpectations?.title || '2. Scope & Expectations'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.scopeExpectations?.description || 'This work operates on an energetic and experiential level. Results may vary based on individual readiness, openness, and external factors.'}
                </p>
                <p className="text-base text-stone-600 leading-relaxed italic">
                  {data.scopeExpectations?.note || 'No specific outcomes are guaranteed.'}
                </p>
              </div>

              {/* 3. Not a Substitute */}
              <div className="border-l-4 border-orange-400 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.notSubstitute?.title || '3. Not a Substitute for Professional Advice'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.notSubstitute?.description || 'These services do not replace medical, psychological, legal, or financial guidance.'}
                </p>
                <p className="text-base text-stone-600 leading-relaxed italic">
                  {data.notSubstitute?.note || 'You are advised to consult a qualified professional for any such matters.'}
                </p>
              </div>

              {/* 4. Personal Responsibility */}
              <div className="border-l-4 border-amber-600 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.personalResponsibility?.title || '4. Personal Responsibility'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.personalResponsibility?.description || 'By engaging in this work, you acknowledge that:'}
                </p>
                <ul className="space-y-2">
                  {data.personalResponsibility?.items?.map((item, index) => (
                    <li key={index} className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  )) || (
                    <>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>You are fully responsible for your decisions, actions, and outcomes</span>
                      </li>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>You are participating voluntarily and with awareness</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* 5. Payments & Commitment */}
              <div className="border-l-4 border-stone-600 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.paymentsCommitment?.title || '5. Payments & Commitment'}
                </h2>
                <ul className="space-y-2">
                  {data.paymentsCommitment?.items?.map((item, index) => (
                    <li key={index} className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                      <span className="text-stone-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  )) || (
                    <>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-stone-600 mt-1">•</span>
                        <span>All sessions must be booked in advance</span>
                      </li>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-stone-600 mt-1">•</span>
                        <span>Payment is required to confirm your booking</span>
                      </li>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-stone-600 mt-1">•</span>
                        <span>Sessions may be rescheduled up to three times</span>
                      </li>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-stone-600 mt-1">•</span>
                        <span>All payments are final. Refunds are not provided once a booking is confirmed.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* 6. Rescheduling & Missed Sessions */}
              <div className="border-l-4 border-amber-500 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.reschedulingMissed?.title || '6. Rescheduling & Missed Sessions'}
                </h2>
                <ul className="space-y-2">
                  {data.reschedulingMissed?.items?.map((item, index) => (
                    <li key={index} className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  )) || (
                    <>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>A minimum of 24 hours' notice is required for rescheduling</span>
                      </li>
                      <li className="text-base text-stone-700 leading-relaxed flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>Missed sessions or late cancellations may not be accommodated or refunded</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* 7. Energetic Boundaries */}
              <div className="border-l-4 border-stone-500 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.energeticBoundaries?.title || '7. Energetic Boundaries'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.energeticBoundaries?.description || 'This work is offered within clear energetic and professional boundaries.'}
                </p>
                <p className="text-base text-stone-600 leading-relaxed italic">
                  {data.energeticBoundaries?.note || 'Respect for time, space, and process is essential. Any form of misuse, disrespect, or misalignment may result in refusal or discontinuation of services.'}
                </p>
              </div>

              {/* 8. Intellectual Property */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.intellectualProperty?.title || '8. Intellectual Property'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed mb-3">
                  {data.intellectualProperty?.description || 'All content, materials, and branding associated with Om Shree Guidance are protected.'}
                </p>
                <p className="text-base text-stone-600 leading-relaxed italic">
                  {data.intellectualProperty?.note || 'They may not be copied, distributed, or reused without explicit permission.'}
                </p>
              </div>

              {/* 9. Limitation of Liability */}
              <div className="border-l-4 border-amber-400 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.limitationLiability?.title || '9. Limitation of Liability'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed">
                  {data.limitationLiability?.description || 'By engaging in these services, you agree that Om Shree Guidance is not liable for any direct or indirect outcomes arising from your participation.'}
                </p>
              </div>

              {/* 10. Updates to Terms */}
              <div className="border-l-4 border-stone-400 pl-6">
                <h2 className="text-2xl font-serif text-stone-800 mb-4">
                  {data.updatesToTerms?.title || '10. Updates to Terms'}
                </h2>
                <p className="text-base text-stone-700 leading-relaxed">
                  {data.updatesToTerms?.description || 'These terms may evolve as the work expands. Continued use indicates acceptance of any updates.'}
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-16 pt-8 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-600 mb-4">
                For questions about these terms, please review our{' '}
                <Link to="/privacy-policy" className="text-amber-600 hover:text-amber-700 underline">
                  Privacy Policy
                </Link>
                {' '}or{' '}
                <Link to="/contact" className="text-amber-600 hover:text-amber-700 underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
