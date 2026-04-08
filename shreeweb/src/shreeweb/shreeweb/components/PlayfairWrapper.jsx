import React from 'react';

/**
 * Wrapper component that applies Playfair Display font to all text content
 * This ensures the font is hardcoded and will display in Playfair even in CMS preview
 */
const PlayfairWrapper = ({ children, className = '' }) => {
  return (
    <div 
      className={`font-playfair ${className}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {children}
    </div>
  );
};

export default PlayfairWrapper;
