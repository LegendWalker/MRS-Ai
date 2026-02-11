
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Helper functions as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveTutor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to start voice session');
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Active');
            
            if (audioContextRef.current) {
              const source = audioContextRef.current.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
              scriptProcessorRef.current = scriptProcessor;

              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                if (!audioContextRef.current) return;
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };

                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current.destination);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscriptions(prev => [...prev, { role: 'MRS Ai', text }]);
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            setStatus('Network Error');
            stopSession();
          },
          onclose: (e) => {
            console.log('Session closed', e);
            setStatus('Session Closed');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: 'You are MRS Ai, an empathetic and highly intelligent verbal tutor. You provide spoken explanations that are clear and engaging. When a student asks a question, guide them to the answer rather than just giving it. Be warm, academic, and encouraging.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setStatus('Microphone access denied or connection failed');
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('Ready to start voice session');
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="flex-1 flex flex-col p-6 items-center justify-center bg-indigo-50/30 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Live Voice Tutoring</h2>
          <p className="text-slate-500 dark:text-slate-400">Practice your speaking, discuss concepts, and get instant verbal feedback from MRS Ai.</p>
        </div>

        <div className="relative">
          <div className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'border-indigo-500 bg-white dark:bg-slate-900 scale-110 shadow-2xl shadow-indigo-200 dark:shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50'}`}>
            {isActive ? (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-12 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-16 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                <div className="w-1.5 h-12 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 dark:text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </div>
          <div className="mt-6 text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-widest">{status}</div>
        </div>

        <div className="flex justify-center gap-4">
          {!isActive ? (
            <button
              onClick={startSession}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 hover:bg-indigo-700 transition-all flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5a.75.75 0 01.75-.75z" />
                <path d="M12 18.75a.75.75 0 00-.75.75v2.25h1.5v-2.25a.75.75 0 00-.75-.75z" />
              </svg>
              Start Voice Chat
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="px-8 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-100 dark:shadow-red-900/30 hover:bg-red-600 transition-all flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-white rounded-sm"></div>
              End Session
            </button>
          )}
        </div>

        {transcriptions.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left h-48 overflow-y-auto shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-4 sticky top-0 bg-white dark:bg-slate-900">Live Transcription</h3>
            {transcriptions.slice(-10).map((t, i) => (
              <div key={i} className="mb-2 text-sm">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">{t.role}:</span>
                <span className="text-slate-700 dark:text-slate-300">{t.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTutor;
