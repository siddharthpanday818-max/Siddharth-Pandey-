import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import NotesScreen from './screens/NotesScreen';
import QuizScreen from './screens/QuizScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import QnAScreen from './screens/QnAScreen';
import type { Screen, Language, TranslationKeys, User } from './types';
import { translations } from './constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
  user: User | null;
  login: (user: User) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'login' | 'main'>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [language, setLanguage] = useState<Language>('en');

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState('main');
  };

  const handleAnimationEnd = useCallback(() => {
    setAppState('login');
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);
  
  const t = useCallback((key: keyof TranslationKeys): string => {
    return translations[language][key] || key;
  }, [language]);

  const appContextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t,
    user,
    login: handleLogin,
  }), [language, handleSetLanguage, t, user]);

  const renderCurrentScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen setActiveScreen={setActiveScreen} />;
      case 'notes':
        return <NotesScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'qna':
        return <QnAScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen setActiveScreen={setActiveScreen}/>;
    }
  };

  const renderAppContent = () => {
    switch (appState) {
        case 'splash':
            return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
        case 'login':
            return <LoginScreen />;
        case 'main':
            return (
                <>
                    <main className="flex-1 overflow-y-auto pb-20">
                        {renderCurrentScreen()}
                    </main>
                    <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
                </>
            );
        default:
            return <SplashScreen onAnimationEnd={handleAnimationEnd} />;
    }
  };


  return (
    <AppContext.Provider value={appContextValue}>
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <div className="w-full max-w-md h-screen md:h-[90vh] md:max-h-[800px] bg-slate-50 shadow-2xl rounded-lg flex flex-col overflow-hidden relative">
          {renderAppContent()}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;