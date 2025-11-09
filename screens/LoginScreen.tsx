import React, { useState } from 'react';
import { useApp } from '../App';

const LoginScreen: React.FC = () => {
  const { login, t } = useApp();
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('Class 8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login({ name: name.trim(), standard });
    }
  };

  const classes = Array.from({ length: 5 }, (_, i) => `Class ${8 + i}`);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-2">EduSarthi</h1>
        <p className="text-slate-500 mb-10">Your AI Learning Companion</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-left text-sm font-medium text-slate-700 mb-1">{t('name')}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
             <label htmlFor="class" className="block text-left text-sm font-medium text-slate-700 mb-1">{t('class_stream')}</label>
             <select
                id="class"
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white appearance-none"
             >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
           <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            {t('start_learning')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;