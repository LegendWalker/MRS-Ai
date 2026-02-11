
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ImageGenSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVisual = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Generate a high-quality educational illustration or diagram of: ${prompt}. Use a clean, professional aesthetic suitable for a textbook or educational presentation.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        let found = false;
        for (const part of parts) {
          if (part.inlineData?.data) {
            setImage(`data:image/png;base64,${part.inlineData.data}`);
            found = true;
            break;
          }
        }
        if (!found) {
          setError('No image data was returned. Please try a more specific educational prompt.');
        }
      } else {
        setError('No content was generated. This might be due to safety filters or a network issue.');
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError('Failed to generate visual. Please try a different prompt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 flex flex-col items-center max-w-5xl mx-auto w-full transition-colors duration-300">
      <div className="w-full mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Visual Study Aids</h2>
        <p className="text-slate-500 dark:text-slate-400">Create diagrams, illustrations, and scientific visualizations for your projects.</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'A labeled diagram of a plant cell'..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Format</label>
              <div className="flex gap-3">
                {['1:1', '4:3', '16:9'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateVisual}
              disabled={loading || !prompt.trim()}
              className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Diagram...
                </>
              ) : 'Generate Visual Aid'}
            </button>
          </div>
          
          {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800/50">{error}</div>}
        </div>

        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-3xl overflow-hidden flex items-center justify-center aspect-square md:aspect-auto border-4 border-white dark:border-slate-800 shadow-2xl min-h-[400px]">
          {image ? (
            <img src={image} alt="Generated Visual" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-slate-400 dark:text-slate-700 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 00 1.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-slate-500 dark:text-slate-600 font-medium">Your generated visual aid will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenSection;
