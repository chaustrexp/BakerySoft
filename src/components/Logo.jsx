const Logo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  return (
    <img 
      src="/img/Logo.png" 
      alt="BakerySoft Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};

export default Logo;