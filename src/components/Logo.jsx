import { useState } from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback si la imagen no carga
  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold ${className}`}>
        <span className="text-lg">🍞</span>
      </div>
    );
  }

  return (
    <img 
      src="/img/Logo.png" 
      alt="BakerySoft Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={handleImageError}
      onLoad={() => setImageError(false)}
    />
  );
};

export default Logo;