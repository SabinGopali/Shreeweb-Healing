import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClaritySection() {
  const [clarityData, setClarityData] = useState({
    title: 'Restore clarity.',
    subtitle: 'Expand naturally.',
    description: 'Take the first step towards untangling the energetic knots holding you back. Let\'s explore what\'s possible when you are fully aligned.',
    buttonText: 'Book a Discovery Call',
    backgroundColor: '#F4EFE6',
    textColor: '#1C1917',
    buttonColor: '#EA580C',
    buttonTextColor: '#FFFFFF'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClarityData();
  }, []);

  const fetchClarityData = async () => {
    try {
      const response = await fetch('/backend/shreeweb-clarity-section/public');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.claritySection) {
          setClarityData(data.claritySection);
        }
      }
    } catch (error) {
      console.error('Error fetching clarity section data:', error);
      // Keep default data on error
    } finally {
      setLoading(false);
    }
  };

  // Don't render if section data is missing
  if (!clarityData) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-16" style={{ backgroundColor: clarityData.backgroundColor }}>
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-stone-300 rounded w-48 mx-auto mb-6"></div>
            <div className="h-4 bg-stone-300 rounded w-96 mx-auto mb-2"></div>
            <div className="h-4 bg-stone-300 rounded w-80 mx-auto mb-8"></div>
            <div className="h-12 bg-stone-300 rounded-full w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 relative overflow-hidden"
      style={{ backgroundColor: clarityData.backgroundColor }}
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
          <h2 
            className="text-4xl md:text-5xl font-serif mb-3 leading-tight"
            style={{ color: clarityData.textColor }}
          >
            {clarityData.title}
          </h2>
          
          {clarityData.subtitle && (
            <h3 
              className="text-2xl md:text-3xl font-serif mb-8 opacity-80"
              style={{ color: clarityData.textColor }}
            >
              {clarityData.subtitle}
            </h3>
          )}
          
          <p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ color: clarityData.textColor }}
          >
            {clarityData.description}
          </p>
          
          <div className="flex justify-center">
            <Link
              to="/booking?plan=discovery"
              className="inline-flex items-center px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              style={{ 
                backgroundColor: clarityData.buttonColor,
                color: clarityData.buttonTextColor
              }}
            >
              {clarityData.buttonText}
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}