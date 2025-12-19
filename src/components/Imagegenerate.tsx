import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, Download, RefreshCw, MoveRight } from 'lucide-react';

const Imagegenerate = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/image/generate', {
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
      setGeneratedImage(data.imageUrl);
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-5xl w-full space-y-12">
        
        {/* Title Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Image Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mt-2">
            <span className="bg-blue-500 bg-clip-text text-transparent">
              Imagine & Create
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Transform your text into stunning visuals with our AI.
            <span className="block mt-2 text-gray-500 dark:text-gray-400">
              Just describe what you want to see.
            </span>
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl mx-auto">
          <form onSubmit={handleGenerate} className="relative group">
            <div className={`relative flex items-center transition-all duration-300 ${
              isFocused ? 'scale-[1.02]' : 'scale-100'
            }`}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe the image you want to generate..."
                className="w-full px-8 py-5 pr-16 text-lg border-2 border-gray-200 rounded-2xl 
                         focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                         dark:bg-gray-800/50 dark:border-gray-700 dark:text-white dark:focus:border-blue-400
                         dark:focus:ring-blue-900/50 backdrop-blur-sm
                         transition-all duration-300 shadow-xl hover:shadow-2xl
                         placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="absolute right-3 p-3.5 bg-blue-600 text-white rounded-xl
                         hover:bg-blue-700 disabled:cursor-not-allowed
                         transition-all duration-200 hover:scale-110 active:scale-95
                         disabled:hover:scale-100 shadow-lg hover:shadow-xl
                         disabled:opacity-50 group"
                aria-label="Generate image"
              >
                {loading ? <Loader2 className="animate-spin" /> : <MoveRight /> }
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 min-h-[400px] flex items-center justify-center overflow-hidden relative group backdrop-blur-sm transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-600">
            {loading ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500 animate-pulse font-medium">Dreaming up your image...</p>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={generatedImage} 
                  alt={prompt} 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button className="p-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 shadow-lg">
                    <Download className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="font-medium">{error}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">Enter a prompt to generate an image</p>
                <p className="text-sm mt-2 opacity-70">Try "A futuristic city on Mars at sunset"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagegenerate;
