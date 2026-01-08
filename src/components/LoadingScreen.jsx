import { useState, useEffect } from 'react';
import Logo from './Logo';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { text: 'Iniciando BakerySoft...', duration: 800 },
    { text: 'Cargando datos de inventario...', duration: 600 },
    { text: 'Verificando proveedores...', duration: 500 },
    { text: 'Configurando dashboard...', duration: 400 },
    { text: 'Preparando interfaz...', duration: 300 },
    { text: '¡Listo para usar!', duration: 200 }
  ];

  useEffect(() => {
    let progressInterval;
    let stepTimeout;

    const startLoading = () => {
      // Simular progreso
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              onLoadingComplete();
            }, 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      // Cambiar pasos
      const runStep = (stepIndex) => {
        if (stepIndex < loadingSteps.length) {
          setCurrentStep(stepIndex);
          stepTimeout = setTimeout(() => {
            runStep(stepIndex + 1);
          }, loadingSteps[stepIndex].duration);
        }
      };

      runStep(0);
    };

    startLoading();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center z-50">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo animado */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl transform transition-transform duration-1000 hover:scale-105">
              <Logo size="xl" className="animate-bounce" />
            </div>
            {/* Círculos animados alrededor del logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-amber-300 rounded-full animate-spin opacity-20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border border-amber-200 rounded-full animate-ping opacity-10"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BakerySoft</h1>
          <p className="text-gray-600 text-lg">Sistema de Gestión de Panadería</p>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0%</span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Paso actual */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-200"></div>
          </div>
          <p className="text-gray-700 font-medium text-lg animate-fade-in">
            {loadingSteps[currentStep]?.text || 'Cargando...'}
          </p>
        </div>

        {/* Características del sistema */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Inventario Inteligente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Dashboard Ejecutivo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Gestión de Proveedores</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Reportes Avanzados</span>
          </div>
        </div>

        {/* Versión */}
        <div className="mt-8 text-xs text-gray-400">
          <p>BakerySoft v1.0.0</p>
          <p>Desarrollado con React & Tailwind CSS</p>
        </div>
      </div>

      {/* Animación de partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;