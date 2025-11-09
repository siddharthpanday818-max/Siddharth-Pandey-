import React from 'react';
import { useApp } from '../App';
import type { Screen } from '../types';

interface HomeScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen }) => {
  const { t, user } = useApp();

  const ActionCard = ({ title, description, onClick, icon }: { title: string, description: string, onClick: () => void, icon: string }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
    </button>
  );

  return (
    <div className="bg-slate-50 h-full">
      <div className="p-6 bg-blue-600 text-white rounded-b-3xl">
        <h1 className="text-3xl font-bold">{t('welcome_back')} {user?.name}!</h1>
        <p className="mt-1 opacity-90">{t('whats_on_your_mind')}</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1740&auto=format&fit=crop" alt="Students learning" className="rounded-2xl shadow-lg w-full h-40 object-cover"/>
        </div>

        <div>
            <h2 className="text-xl font-bold text-slate-700 mb-4">{t('quick_actions')}</h2>
            <div className="space-y-4">
                <ActionCard title={t('notes')} description={t('get_started_notes')} onClick={() => setActiveScreen('notes')} icon="📝" />
                <ActionCard title={t('quiz')} description={t('get_started_quiz')} onClick={() => setActiveScreen('quiz')} icon="🧠" />
                <ActionCard title={t('ai_chat')} description={t('get_started_chat')} onClick={() => setActiveScreen('chat')} icon="💬" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default HomeScreen;