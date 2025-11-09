import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const [showShort, setShowShort] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowShort(true), 200);
    const timer2 = setTimeout(() => {
      setShowShort(false);
    }, 1500);
     const timer3 = setTimeout(() => {
      setShowFull(true);
    }, 1800);
    const timer4 = setTimeout(onAnimationEnd, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationEnd]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full bg-blue-600 text-white">
      <div className="relative h-20 w-80 flex justify-center items-center overflow-hidden">
        <h1 className={`absolute text-7xl font-bold transition-all duration-500 ease-in-out ${showShort ? 'opacity-100' : 'opacity-0 -translate-x-10'}`}>
          ES
        </h1>
        <h1 className={`absolute text-6xl font-bold transition-opacity duration-700 ${showFull ? 'opacity-100' : 'opacity-0'}`}>
          EduSarthi
        </h1>
      </div>
      <p className={`absolute bottom-10 text-slate-200 transition-opacity duration-700 delay-500 ${showFull ? 'opacity-100' : 'opacity-0'}`}>
        Your AI Learning Companion
      </p>
    </div>
  );
};

export default SplashScreen;
