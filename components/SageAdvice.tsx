
import React, { useState, useCallback, useEffect } from 'react';
import { getSageAdvice } from '../services/geminiService';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const SageAdvice: React.FC = () => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cooldown, setCooldown] = useState<boolean>(false);
  
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);


  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const handleSaveKey = () => {
    if(apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setIsKeySaved(true);
      setShowKeyInput(false);
      setError('');
    } else {
        setError('Per favore, inserisci una chiave API valida.');
    }
  };
  
  const handleRemoveKey = () => {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey('');
      setIsKeySaved(false);
      setShowKeyInput(true);
      setAdvice('');
  }

  const fetchAdvice = useCallback(async () => {
    if (cooldown || isLoading || !isKeySaved) return;

    setIsLoading(true);
    setCooldown(true);
    setError('');
    setAdvice('');

    try {
      const newAdvice = await getSageAdvice(apiKey);
      if (newAdvice.includes('non è valida')) {
          setError(newAdvice);
          handleRemoveKey();
      } else {
        setAdvice(newAdvice);
      }
    } catch (e) {
      setError('Impossibile ottenere il consiglio in questo momento.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 10000); // 10 second cooldown
    }
  }, [cooldown, isLoading, apiKey, isKeySaved]);

  return (
    <div className="w-full max-w-3xl mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
      <h3 className="text-lg font-semibold text-teal-300 mb-2">Saggezza della Terra</h3>
      
      {!isKeySaved && showKeyInput && (
        <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-yellow-300 mb-2">Per usare questa funzione, inserisci la tua chiave API di Google AI Studio.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="La tua chiave API Gemini"
                    className="flex-grow px-3 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="API Key Input"
                />
                <button onClick={handleSaveKey} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 font-bold transition-colors">
                    Salva Chiave
                </button>
            </div>
        </div>
      )}

      {isKeySaved && (
        <div className='flex flex-col items-center gap-2'>
            <button
                onClick={fetchAdvice}
                disabled={isLoading || cooldown}
                className="px-6 py-2 rounded-md bg-teal-600 text-white font-bold transition-all duration-200 hover:bg-teal-500 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Ascoltando...' : (cooldown ? 'La Terra riposa...' : 'Chiedi Consiglio')}
            </button>
             <button onClick={handleRemoveKey} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                Cambia Chiave API
            </button>
        </div>
      )}
      
      {advice && (
        <blockquote className="mt-4 p-4 bg-slate-700/50 rounded-md border-l-4 border-teal-400 italic text-slate-300">
          "{advice}"
        </blockquote>
      )}
      {error && (
        <p className="mt-4 text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SageAdvice;
