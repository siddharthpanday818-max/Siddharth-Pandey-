import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat, Part } from '@google/genai';
import { useApp } from '../App';
import CameraView from '../components/CameraView';

const ChatScreen: React.FC = () => {
  const { t, language, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
        chatSessionRef.current = createChatSession(language, user.standard);
        setMessages([]);
    }
  }, [language, user]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !image || !chatSessionRef.current) return;
    
    const userMessage: ChatMessage = { sender: 'user', text: input, image: image || undefined };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    const imageToSend = image;
    setInput('');
    setImage(null);
    setIsLoading(true);

    try {
        const content: Part[] = [{ text: messageToSend }];
        if (imageToSend) {
            content.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageToSend,
                },
            });
        }

        // FIX: Changed `parts` to `message` as per the Gemini API for chat sessions.
        const responseStream = await chatSessionRef.current.sendMessageStream({ message: content });
        
        let aiResponseText = '';
        setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);

        for await (const chunk of responseStream) {
            aiResponseText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = aiResponseText;
                return newMessages;
            });
        }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleCapture = (base64: string) => {
    setImage(base64);
    setShowCamera(false);
  };

  return (
    <>
    {showCamera && <CameraView onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 text-center">{t('ai_doubt_solver')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl flex flex-col ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-200 text-slate-800 rounded-bl-none'
            }`}>
              {msg.image && <img src={`data:image/jpeg;base64,${msg.image}`} alt="user upload" className="rounded-lg mb-2 max-h-48"/>}
              {msg.text === '...' ? (
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-300"></span>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        {image && (
          <div className="mb-2 relative w-24 h-24 rounded-lg overflow-hidden border">
              <img src={`data:image/jpeg;base64,${image}`} alt="Selected" className="w-full h-full object-cover"/>
              <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCamera(true)} className="p-3 text-slate-500 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11ZM4.5 5A1.5 1.5 0 0 0 3 6.5v11A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 19.5 5h-15ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" clip-rule="evenodd" /></svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ask_anything')}
            className="flex-grow p-3 border-2 border-slate-300 rounded-full focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !image)}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChatScreen;