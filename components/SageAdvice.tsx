
import React, { useState, useCallback } from 'react';
import { getSageAdvice } from '../services/geminiService';

const SageAdvice: React.FC = () => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cooldown, setCooldown] = useState<boolean>(false);

  const fetchAdvice = useCallback(async () => {
    if (cooldown || isLoading) return;

    setIsLoading(true);
    setCooldown(true);
    setError('');
    setAdvice('');

    try {
      const newAdvice = await getSageAdvice();
      setAdvice(newAdvice);
    } catch (e) {
      setError('Impossibile ottenere il consiglio in questo momento.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => setCooldown(false), 10000); // 10 second cooldown
    }
  }, [cooldown, isLoading]);
  
  const apiKeyMissing = !process.env.API_KEY;

  return (
    <div className="w-full max-w-3xl mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
      <h3 className="text-lg font-semibold text-teal-300 mb-2">Saggezza della Terra</h3>
      <button
        onClick={fetchAdvice}
        disabled={isLoading || cooldown || apiKeyMissing}
        className="px-6 py-2 rounded-md bg-teal-600 text-white font-bold transition-all duration-200 hover:bg-teal-500 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Ascoltando...' : (cooldown ? 'La Terra riposa...' : 'Chiedi Consiglio')}
      </button>
      {apiKeyMissing && (
         <p className="text-xs text-yellow-400 mt-2">La funzione del saggio è disabilitata. Manca la chiave API.</p>
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
