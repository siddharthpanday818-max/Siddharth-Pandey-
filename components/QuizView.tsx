import React, { useState } from 'react';
import type { QuizQuestion } from '../types';
import { useApp } from '../App';

interface QuizViewProps {
  questions: QuizQuestion[];
  topic: string;
  onFinish: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, topic, onFinish }) => {
  const { t } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isQuizOver = currentQuestionIndex >= questions.length;

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return selectedAnswer === option ? 'bg-blue-200 border-blue-500' : 'bg-white hover:bg-slate-100';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-slate-50 text-slate-600';
  };

  if (isQuizOver) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('quiz_complete')}</h2>
        <p className="text-lg text-slate-600 mb-4">{`${t('your_score')}: ${score} / ${questions.length}`}</p>
        <button
          onClick={onFinish}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('play_again')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-blue-600 mb-1">{`${t('quiz_on_topic')} ${topic}`}</p>
        <p className="text-slate-500 font-medium text-sm">{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</p>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-6">{currentQuestion.question}</h3>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 rounded-lg bg-slate-100">
            {selectedAnswer === currentQuestion.correctAnswer ? (
                <p className="font-bold text-green-600">{t('correct_answer')}</p>
            ) : (
                <>
                    <p className="font-bold text-red-600">{t('wrong_answer')}</p>
                    <p className="text-sm text-slate-700 mt-2">{t('your_answer')}: {selectedAnswer}</p>
                    <p className="text-sm text-slate-700 mt-1">{t('correct_answer')}: {currentQuestion.correctAnswer}</p>
                </>
            )}
        </div>
      )}
      <div className="mt-8">
        {isAnswered ? (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('next_question')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed enabled:hover:bg-blue-700"
          >
            {t('submit')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;