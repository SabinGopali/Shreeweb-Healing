import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CmsHtmlPreview, stripHtmlToText } from '../cms/cmsRichTextUtils';

// Resolve /uploads/* paths to the backend origin for correct browser fetching
const resolveBackendImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) return imageUrl;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
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
      className="py-16 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50"
      data-aos="fade-up"
      data-aos-duration="300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Social Media Links */}
          {videoData.socialLinks && videoData.socialLinks.length > 0 && (
            <div className="text-center mb-8" data-aos="fade-down" data-aos-duration="200">
              <div className="flex justify-center space-x-12 text-sm text-stone-500 mb-12">
                {videoData.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif hover:text-stone-700 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Video Container with Overlay Text */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            data-aos="zoom-in"
            data-aos-duration="300"
            data-aos-delay="200"
          >
            {/* YouTube Video Embed */}
            <div className="relative">
              <div className="w-full aspect-video">
                {videoData.youtubeUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoData.youtubeUrl}
                    title="Video Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full object-cover"
                  ></iframe>
                ) : (
                  <div 
                    className="relative w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center"
                  >
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
                    ) : null}
                  </div>
                )}
              </div>
              
              {/* Clickable Overlay for YouTube Redirect */}
              {videoData.youtubeRedirectUrl && (
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12 group-hover:bg-black/10 transition-all duration-300 cursor-pointer"
                  onClick={() => window.open(videoData.youtubeRedirectUrl, '_blank')}
                >
                  <div className="text-white max-w-2xl">
                    <CmsHtmlPreview
                      html={videoData.title}
                      className="text-3xl md:text-4xl font-serif italic mb-6 leading-tight text-white"
                    />
                    <CmsHtmlPreview
                      html={videoData.description}
                      className="text-lg mb-8 opacity-90 leading-relaxed text-white"
                    />
                    
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={videoData.cta1Link || '/shreeweb/booking?plan=discovery'}
                        className="group relative overflow-hidden px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/40 hover:border-white/50 transition-all duration-300 text-white font-serif shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {stripHtmlToText(videoData.cta1Text)}
                      </Link>
                      <Link
                        to={videoData.cta2Link || '/shreeweb/booking?plan=session'}
                        className="group relative overflow-hidden px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/40 hover:border-white/50 transition-all duration-300 text-white font-serif shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {stripHtmlToText(videoData.cta2Text)}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Always show overlay with content if no redirect URL */}
              {!videoData.youtubeRedirectUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <div className="text-white max-w-2xl">
                    <CmsHtmlPreview
                      html={videoData.title}
                      className="text-3xl md:text-4xl font-serif italic mb-6 leading-tight text-white"
                    />
                    <CmsHtmlPreview
                      html={videoData.description}
                      className="text-lg mb-8 opacity-90 leading-relaxed text-white"
                    />
                    
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to={videoData.cta1Link || '/shreeweb/booking?plan=discovery'}
                        className="group relative overflow-hidden px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/40 hover:border-white/50 transition-all duration-300 text-white font-serif shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {stripHtmlToText(videoData.cta1Text)}
                      </Link>
                      <Link
                        to={videoData.cta2Link || '/shreeweb/booking?plan=session'}
                        className="group relative overflow-hidden px-8 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full hover:bg-white/40 hover:border-white/50 transition-all duration-300 text-white font-serif shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {stripHtmlToText(videoData.cta2Text)}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;