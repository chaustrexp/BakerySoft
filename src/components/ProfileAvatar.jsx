const ProfileAvatar = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  // Mapeo de roles a imágenes
  const getRoleImage = (role) => {
    const roleImages = {
      'admin': '/img/administrador.png',
      'manager': '/img/gerente.png',
      'supervisor': '/img/supervisor.jpeg',
      'employee': '/img/empleado.jpeg'
    };
    
    return roleImages[role] || '/img/empleado.jpeg'; // Default a empleado si no encuentra el rol
  };

  // Si el usuario tiene una foto personalizada, usarla; si no, usar la del rol
  const getAvatarSrc = () => {
    // Si el usuario tiene una foto personalizada (URL o base64)
    if (user.profilePhoto && (user.profilePhoto.startsWith('http') || user.profilePhoto.startsWith('data:'))) {
      return user.profilePhoto;
    }
    
    // Si no, usar la imagen del rol
    return getRoleImage(user.role);
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img
        src={getAvatarSrc()}
        alt={`${user.name} - ${user.role}`}
        className="w-full h-full object-cover rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
        onError={(e) => {
          // Fallback si la imagen no carga
          e.target.src = '/img/empleado.jpeg';
        }}
      />
      
      {/* Indicador de rol */}
      <div className={`absolute -bottom-1 -right-1 ${
        size === 'xs' ? 'w-3 h-3' : 
        size === 'sm' ? 'w-4 h-4' : 
        size === 'md' ? 'w-5 h-5' : 
        size === 'lg' ? 'w-6 h-6' : 'w-7 h-7'
      } rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs ${
        user.role === 'admin' ? 'bg-purple-500' :
        user.role === 'manager' ? 'bg-blue-500' :
        user.role === 'supervisor' ? 'bg-green-500' : 'bg-gray-500'
      }`}>
        <span className="text-white text-xs">
          {user.role === 'admin' ? '👑' :
           user.role === 'manager' ? '💼' :
           user.role === 'supervisor' ? '👨‍💼' : '👤'}
        </span>
      </div>
    </div>
  );
};

export default ProfileAvatar;