import { useState, useEffect } from 'react';

export const useHeroData = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/backend/shreeweb-hero/active');
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }
      
      const data = await response.json();
      
      if (data.success && data.hero) {
        setHeroData(data.hero);
      } else {
        throw new Error('Invalid hero data received');
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setError(err.message);
      
      // Fallback to default data
      setHeroData({
        title: 'OMSHREEGUIDANCE',
        subtitle: 'Energetic alignment for sustainable expansion',
        ctaText: 'Begin Your Journey',
        backgroundType: 'image',
        backgroundImage: '/healing.webp',
        backgroundVideo: '',
        overlayOpacity: 20,
        titleSize: 'text-8xl md:text-9xl',
        titleColor: 'text-white',
        subtitleColor: 'text-white/80',
        ctaStyle: 'transparent'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  return {
    heroData,
    loading,
    error,
    refetch: fetchHeroData
  };
};