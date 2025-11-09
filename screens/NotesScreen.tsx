import React, { useState } from 'react';
import { generateNotes } from '../services/geminiService';
import Loader from '../components/Loader';
import CameraView from '../components/CameraView';
import { useApp } from '../App';

// A simple markdown to HTML converter for this app's purpose
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    return (
        <div>
            {lines.map((line, index) => {
                if (line.startsWith('###')) {
                    return <h3 key={index} className="text-lg font-semibold mt-3 mb-1 text-slate-700">{line.replace('###', '').trim()}</h3>;
                }
                if (line.startsWith('##')) {
                    return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-slate-800">{line.replace('##', '').trim()}</h2>;
                }
                if (line.startsWith('#')) {
                    return <h1 key={index} className="text-2xl font-extrabold mt-5 mb-3 text-slate-900">{line.replace('#', '').trim()}</h1>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc text-slate-600">{line.replace('* ', '').trim()}</li>;
                }
                 if (line.trim().length === 0) {
                    return <br key={index} />;
                }
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return <p key={index} className="text-slate-600 my-1" dangerouslySetInnerHTML={{ __html: line }} />;
            })}
        </div>
    );
};

const NotesScreen: React.FC = () => {
  const { t, language, user } = useApp();
  const [topic, setTopic] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');

  const handleGenerateNotes = async () => {
    if (!topic.trim() && !image || !user) return;
    setIsLoading(true);
    setNotes('');
    setCurrentTopic(topic);
    const generatedNotes = await generateNotes(topic, image, language, user.standard);
    setNotes(generatedNotes);
    setIsLoading(false);
  };
  
  const handleCapture = (base64: string) => {
    setImage(base64);
    setShowCamera(false);
  };

  return (
    <>
      {showCamera && <CameraView onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('generate_notes')}</h1>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('enter_topic')}
              className="w-full p-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 pr-12"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateNotes()}
            />
            <button onClick={() => setShowCamera(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M9.75 3.102A3.375 3.375 0 0 0 6.375 6.375c0 1.28.713 2.4 1.773 2.955A3.371 3.371 0 0 0 6.375 12c-1.28 0-2.4-.713-2.955-1.773A3.371 3.371 0 0 0 0 12c0 1.864 1.511 3.375 3.375 3.375 1.28 0 2.4.713 2.955 1.773A3.371 3.371 0 0 0 8.1 18.918a3.375 3.375 0 0 0 3.255-2.023 2.993 2.993 0 0 1 1.29 0A3.375 3.375 0 0 0 15.898 18c1.864 0 3.375-1.511 3.375-3.375 0-1.28-.713-2.4-1.773-2.955A3.371 3.371 0 0 0 18.918 9a3.375 3.375 0 0 0-2.023-3.255 2.993 2.993 0 0 1 0-1.29A3.375 3.375 0 0 0 18 1.125a2.25 2.25 0 0 1-2.25 2.25 2.25 2.25 0 0 1-2.25-2.25c0-.996.658-1.84 1.545-2.122A3.375 3.375 0 0 0 12 0C7.86 0 4.5 3.36 4.5 7.5c0 .774.117 1.52.33 2.223A3.354 3.354 0 0 0 3.375 9C1.511 9 0 10.511 0 12s1.511 3 3.375 3c.774 0 1.52-.117 2.223-.33A3.354 3.354 0 0 0 6.375 16.5c1.864 0 3.375 1.511 3.375 3.375s-1.511 3.375-3.375 3.375C4.246 23.25 2.457 22.342 1.125 21a2.25 2.25 0 0 1 2.25-2.25 2.25 2.25 0 0 1 2.25 2.25c0 .996-.658 1.84-1.545 2.122A3.375 3.375 0 0 0 9 24c4.14 0 7.5-3.36 7.5-7.5 0-.774-.117-1.52-.33-2.223A3.354 3.354 0 0 0 17.625 15c1.864 0 3.375-1.511 3.375-3.375s-1.511-3.375-3.375-3.375c-.774 0-1.52.117-2.223.33A3.354 3.354 0 0 0 14.625 7.5c-1.864 0-3.375-1.511-3.375-3.375S12.761.75 14.625.75c.828 0 1.603.297 2.223.82A3.375 3.375 0 0 0 21.375 0C23.043 0 24 .957 24 2.625a2.25 2.25 0 0 1-2.25 2.25A2.25 2.25 0 0 1 19.5 2.625c0-.996-.658-1.84-1.545-2.122A3.375 3.375 0 0 0 15 0C13.2 0 12.532.894 9.75 3.102Z" transform="translate(12 12) rotate(-45) translate(-12 -12)"/></svg>
            </button>
          </div>
          <button
            onClick={handleGenerateNotes}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400 whitespace-nowrap"
          >
            {isLoading ? '...' : t('generate_notes')}
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
          {isLoading && <Loader message={t('generating_notes_message')} />}
          {notes && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t('notes_for_topic')} "{currentTopic || 'your image'}"</h2>
              <SimpleMarkdown content={notes} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesScreen;