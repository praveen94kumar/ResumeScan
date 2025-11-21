import React, { useState } from 'react';
import { LOGO_URL, PLACEHOLDER_LOGO } from '../constants';

export const Header: React.FC = () => {
  const [imgSrc, setImgSrc] = useState(LOGO_URL);

  return (
    <header className="bg-white shadow-sm border-b-4 border-[#B9A121]">
      <div className="container mx-auto px-6 py-4 flex items-center gap-4">
        <img 
          src={imgSrc} 
          alt="Pristine Technologies" 
          className="h-12 object-contain"
          onError={() => setImgSrc(PLACEHOLDER_LOGO)}
        />
        <div className="h-8 w-px bg-gray-300 mx-2"></div>
        <h1 className="text-2xl font-bold text-[#3C3C3C] font-playfair">
          Resume Matcher
        </h1>
      </div>
    </header>
  );
};