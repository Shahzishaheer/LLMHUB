import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, Download, RefreshCw, MoveRight } from 'lucide-react';

const Imagegenerate = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPrompt = prompt.trim();
    if (!currentPrompt) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastPrompt(currentPrompt);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}image/image-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setPrompt('');
      setGeneratedImage(data.imageUrl);
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-white dark:bg-gray-900">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Title */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Image Generator
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">
            Describe an image and AI will create it
          </p>
        </div>

        {/* Chat Area */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4 min-h-[250px] md:min-h-[300px] bg-gray-50 dark:bg-gray-800">
          {lastPrompt ? (
            <div className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg max-w-[85%] md:max-w-[80%]">
                  <p className="text-xs md:text-sm">{lastPrompt}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 px-3 py-3 md:px-4 rounded-lg w-full">
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs md:text-sm">Generating...</span>
                    </div>
                  ) : error ? (
                    <p className="text-xs md:text-sm text-red-500">{error}</p>
                  ) : generatedImage ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <img
                        src={generatedImage}
                        alt={lastPrompt}
                        className="w-full max-h-[300px] md:max-h-[400px] object-contain rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button 
                          className="p-2  "
                          title="Download"
                        >
                          <Download className="w-4 h-4 hover:text-amber-100 cursor-pointer" />
                        </button>
                        <button
                          onClick={handleGenerate}
                          className="p-2 "
                          title="Regenerate"
                        >
                          <RefreshCw className="w-4 h-4  hover:text-amber-100 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Enter a prompt to get started</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleGenerate}>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your image..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:outline-none focus:border-blue-500
                       dark:bg-gray-800 dark:text-white text-sm"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg whitespace-nowrap
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoveRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Imagegenerate;
