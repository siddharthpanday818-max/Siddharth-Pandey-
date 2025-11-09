import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import Loader from '../components/Loader';
import QuizView from '../components/QuizView';
import CameraView from '../components/CameraView';
import type { QuizQuestion } from '../types';
import { useApp } from '../App';

const QuizScreen: React.FC = () => {
  const { t, language, user } = useApp();
  const [topic, setTopic] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim() && !image || !user) return;
    setIsLoading(true);
    setError('');
    setQuestions([]);
    const generatedQuestions = await generateQuiz(topic, image, language, user.standard);
    setIsLoading(false);
    if (generatedQuestions && generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setQuizStarted(true);
    } else {
      setError('Failed to generate quiz. Please try a different topic.');
    }
  };
  
  const handleFinishQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setTopic('');
    setImage(null);
  };

  const handleCapture = (base64: string) => {
    setImage(base64);
    setShowCamera(false);
  };

  if (quizStarted) {
    return <QuizView questions={questions} topic={topic || 'your image'} onFinish={handleFinishQuiz} />;
  }

  return (
    <>
      {showCamera && <CameraView onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('quiz_practice')}</h1>
        <div className="flex gap-2">
          <div className="relative flex-grow">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t('enter_quiz_topic')}
                className="w-full p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 pr-12"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateQuiz()}
              />
              <button onClick={() => setShowCamera(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11ZM4.5 5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 19.5 5h-15ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" clip-rule="evenodd" /></svg>
              </button>
            </div>
            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400 whitespace-nowrap"
            >
              {isLoading ? '...' : t('generate_quiz')}
            </button>
        </div>

        {image && (
            <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden">
                <img src={`data:image/jpeg;base64,${image}`} alt="Selected" className="w-full h-full object-cover"/>
                <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )}

        <div className="mt-6">
          {isLoading && <Loader message={t('generating_quiz_message')} />}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default QuizScreen;