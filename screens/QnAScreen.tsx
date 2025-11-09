import React, { useState } from 'react';
import { getAnswerForQnA } from '../services/geminiService';
import Loader from '../components/Loader';
import CameraView from '../components/CameraView';
import { useApp } from '../App';

// Reusing the SimpleMarkdown component
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

const QnAScreen: React.FC = () => {
    const { t, language, user } = useApp();
    const [question, setQuestion] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetSolution = async () => {
        if (!question.trim() && !image || !user) return;
        setIsLoading(true);
        setSolution('');
        const generatedSolution = await getAnswerForQnA(question, image, language, user.standard);
        setSolution(generatedSolution);
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
                <h1 className="text-2xl font-bold text-slate-800 mb-4">{t('qna_header')}</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t('qna_placeholder')}
                        className="w-full p-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 min-h-[100px]"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <button onClick={() => setShowCamera(true)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 p-1">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11ZM4.5 5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 19.5 5h-15ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" clip-rule="evenodd" /></svg>
                             <span className="text-sm font-medium">{t('or_upload_image')}</span>
                        </button>
                        <button
                            onClick={handleGetSolution}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400"
                        >
                            {isLoading ? '...' : t('get_solution')}
                        </button>
                    </div>
                </div>

                {image && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                        <img src={`data:image/jpeg;base64,${image}`} alt="Question" className="w-full h-full object-cover"/>
                        <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    {isLoading && <Loader message={t('generating_solution_message')} />}
                    {solution && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('solution_for_question')}</h2>
                            <SimpleMarkdown content={solution} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default QnAScreen;
