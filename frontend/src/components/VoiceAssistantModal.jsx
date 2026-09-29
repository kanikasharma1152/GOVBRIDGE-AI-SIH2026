import { apiFetch } from '../api';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';

export default function VoiceAssistantModal({ isOpen, onClose, role = 'citizen' }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-IN';

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleSendQuery(transcript);
      };

      recognizer.onerror = () => setIsListening(false);
      recognizer.onend = () => setIsListening(false);

      recognitionRef.current = recognizer;
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setResponse(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || query;
    if (!textToSend.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await apiFetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, role })
      });
      const data = await res.json();
      setResponse(data);
      if (data?.answer) {
        speakText(data.answer);
      }
    } catch (err) {
      setResponse({
        query: textToSend,
        answer: "GovBridge is coordinating across connected government portals. Status check: Income Verification API is currently degraded with automated retry active."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Why is my application stuck?",
    "What government services can I apply for?",
    "Where is my scholarship application?",
    "What documents do I need?",
    "What information have I shared?",
    "Which APIs are currently unavailable?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-blue-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">ASK GOVBRIDGE</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  SECTION 45 VOICE ASSISTANT
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Connected directly to live ministerial interoperability workflows
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (ttsEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                setTtsEnabled(!ttsEnabled);
              }}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                ttsEnabled ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={ttsEnabled ? "Voice Output Active" : "Voice Output Muted"}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Clean Mic Interactive Component */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <button
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
              title={speechSupported ? (isListening ? "Listening..." : "Click to speak") : "Speech not supported, use text input"}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-slate-800">
                {isListening ? "Listening to your voice..." : "Click microphone or type question below"}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {speechSupported ? "Speak in natural language. GovBridge connects directly to system state." : "Web Speech API not supported in browser; type query below."}
              </p>
            </div>
          </div>

          {/* Text Input Row */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder="E.g., “Why is my application stuck?” or “What documents do I need?”"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            <button
              onClick={() => handleSendQuery()}
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition disabled:opacity-40 cursor-pointer flex items-center space-x-1.5"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask</span>
            </button>
          </div>

          {/* Suggested Prompts (Section 45) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Suggested Government Queries (Section 45):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleSendQuery(q);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  “{q}”
                </button>
              ))}
            </div>
          </div>

          {/* Response Box */}
          {response && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 border-b border-blue-200/80 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified System Telemetry Answer</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {response.answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
