import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CmsHtmlPreview, stripHtmlToText } from '../cms/cmsRichTextUtils';

// Resolve /uploads/* paths to the backend origin for correct browser fetching
const resolveBackendImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  return imageUrl.startsWith('/') ? `${backendUrl}${imageUrl}` : `${backendUrl}/${imageUrl}`;
};

const isVideoFileUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url.trim());
};

const VideoSection = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideoData();

    // When returning to the tab after CMS edits, fetch fresh content.
    const onFocus = () => fetchVideoData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching video data from /backend/shreeweb-video-section/public');
      const response = await fetch('/backend/shreeweb-video-section/public', { cache: 'no-store' });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No video section configured. Please configure it in the CMS.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch video section data`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.data) {
        console.log('Setting video data:', result.data);
        setVideoData(result.data);
      } else {
        throw new Error(result.message || 'Invalid response format or no data');
      }
    } catch (err) {
      console.error('Error fetching video data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-8 mx-auto w-64"></div>
              <div className="aspect-video bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !videoData) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-orange-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-stone-800 mb-2">Video Section Not Configured</h3>
              <p className="text-stone-600 mb-4">{error}</p>
              <p className="text-sm text-stone-500">Please configure the video section in the CMS to display content here.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 px-4 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 sm:py-20"
      data-aos="fade-up"
      data-aos-duration="300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Two-Column Layout: Text Left, Video Right */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Side - Text Content */}
            <div className="space-y-6 lg:space-y-8 lg:pr-8" data-aos="fade-right" data-aos-duration="300" data-aos-delay="100">
              
              {/* Social Media Links */}
              {videoData.socialLinks && videoData.socialLinks.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap">
                  {videoData.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-serif text-stone-600 hover:text-orange-600 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-300"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
              
              {/* Title */}
              <div>
                <CmsHtmlPreview
                  html={videoData.title}
                  className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-800 mb-6 leading-tight text-justify"
                />
                
                {/* Decorative Line */}
                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6"></div>
              </div>
              
              {/* Description */}
              <CmsHtmlPreview
                html={videoData.description}
                className="text-base md:text-lg lg:text-xl text-stone-600 leading-relaxed text-justify"
              />
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to={videoData.cta1Link || '/shreeweb/booking?plan=discovery'}
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-orange-600 to-orange-500 text-white relative overflow-hidden"
                >
                  <span className="relative z-10">{stripHtmlToText(videoData.cta1Text)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to="/shreeweb/offers"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-50"
                >
                  <span className="relative z-10">{stripHtmlToText(videoData.cta2Text)}</span>
                </Link>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="lg:sticky lg:top-24" data-aos="fade-left" data-aos-duration="300" data-aos-delay="200">
              <div className="relative w-full max-w-md mx-auto">
                {/* Video Container - Vertical aspect ratio with enhanced styling */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm" 
                     style={{ aspectRatio: '9/16' }}>
                  
                  {videoData.youtubeUrl ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={videoData.youtubeUrl}
                      title="Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full object-cover"
                    ></iframe>
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                      {videoData.videoImage ? (
                        isVideoFileUrl(videoData.videoImage) ? (
                          <video
                            src={resolveBackendImageUrl(videoData.videoImage)}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${resolveBackendImageUrl(videoData.videoImage)})`,
                            }}
                          />
                        )
                      ) : (
                        <div className="text-white text-center p-8">
                          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm opacity-75 font-serif">No video configured</p>
                        </div>
                      )}
                      
                      {/* Clickable overlay for YouTube redirect */}
                      {videoData.youtubeRedirectUrl && (
                        <div 
                          className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300 cursor-pointer flex items-center justify-center group"
                          onClick={() => window.open(videoData.youtubeRedirectUrl, '_blank')}
                        >
                          <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Decorative elements around video */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;