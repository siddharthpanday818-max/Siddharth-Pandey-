import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressBar from '../components/ProgressBar';
import { useApp } from '../App';
import type { Language, TranslationKeys } from '../types';

const weeklyData = [
  { name: 'Mon', score: 6 },
  { name: 'Tue', score: 8 },
  { name: 'Wed', score: 5 },
  { name: 'Thu', score: 9 },
  { name: 'Fri', score: 7 },
  { name: 'Sat', score: 10 },
  { name: 'Sun', score: 8 },
];

// FIX: Added a map to convert language codes ('en', 'hi', 'hn') to valid translation keys ('english', 'hindi', 'hinglish') for the t() function.
const langNameMap: Record<Language, keyof TranslationKeys> = {
  en: 'english',
  hi: 'hindi',
  hn: 'hinglish',
};

const ProfileScreen: React.FC = () => {
    const { t, language, setLanguage } = useApp();

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">{t('my_progress')}</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
                <ProgressBar label={t('overall_accuracy')} value={82} />
                <ProgressBar label={t('quizzes_completed')} value={65} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-lg font-bold text-slate-700 mb-4">{t('weekly_performance')}</h2>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                            <YAxis domain={[0, 10]} tick={{ fill: '#64748b' }} />
                            <Tooltip cursor={{fill: 'rgba(147, 197, 253, 0.4)'}} />
                            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-lg font-bold text-slate-700 mb-4">{t('select_language')}</h2>
                <div className="flex justify-around">
                    {(['en', 'hi', 'hn'] as Language[]).map(lang => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                language === lang 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {t(langNameMap[lang])}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;