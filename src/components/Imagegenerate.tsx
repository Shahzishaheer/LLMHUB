import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, Download, RefreshCw, Sparkles, Wand2, Palette, Trash2 } from 'lucide-react';
import { BounceLoader } from 'react-spinners';

interface GeneratedImageItem {
  url: string;
  prompt: string;
  timestamp: number;
}

const Imagegenerate = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<GeneratedImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setPrompt('');
      setGeneratedImage(data.imageUrl);
      
      // Add to history
      const newImage: GeneratedImageItem = {
        url: data.imageUrl,
        prompt: currentPrompt,
        timestamp: Date.now()
      };
      setImageHistory(prev => [newImage, ...prev].slice(0, 6)); // Keep last 6 images
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastPrompt) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}image/image-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: lastPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      // Add to history
      const newImage: GeneratedImageItem = {
        url: data.imageUrl,
        prompt: lastPrompt,
        timestamp: Date.now()
      };
      setImageHistory(prev => [newImage, ...prev].slice(0, 6));
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl?: string) => {
    const urlToDownload = imageUrl || generatedImage;
    if (!urlToDownload) return;

    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePromptClick = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt);
  };

  const promptSuggestions = [
    { icon: '🎨', text: 'A futuristic cityscape at sunset', category: 'Landscape' },
    { icon: '🦄', text: 'Magical unicorn in enchanted forest', category: 'Fantasy' },
    { icon: '🚀', text: 'Space station orbiting a distant planet', category: 'Sci-Fi' },
    { icon: '🌸', text: 'Zen garden with cherry blossoms', category: 'Nature' },
    { icon: '🎭', text: 'Cyberpunk street with neon lights', category: 'Urban' },
    { icon: '🏰', text: 'Medieval castle on mountain peak', category: 'Architecture' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Image Generation</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Create Stunning Images
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into beautiful AI-generated artwork in seconds
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Section - Input & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Input Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Describe Your Image</h2>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Describe your image in detail... (e.g., 'A serene mountain landscape with a waterfall at golden hour')"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                             focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                             dark:bg-gray-700 dark:text-white dark:focus:border-purple-400
                             dark:focus:ring-purple-900/50 transition-all duration-300
                             placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl
                           hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 font-semibold shadow-lg hover:shadow-xl
                           disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Image
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Prompt Suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inspiration</h2>
              </div>
              
              <div className="space-y-2">
                {promptSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(suggestion.text)}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg
                             hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200
                             border border-transparent hover:border-purple-300 dark:hover:border-purple-700
                             group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {suggestion.text}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{suggestion.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Generated Image Display */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Image Display */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 px-6">
                  <BounceLoader color='#9333ea' size={60} />
                  <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Creating your masterpiece...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take 10-30 seconds</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-32 px-6">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">❌</span>
                  </div>
                  <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
                  <button
                    onClick={handleRegenerate}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  {/* Image Container */}
                  <div className="relative group">
                    <img
                      src={generatedImage}
                      alt={lastPrompt || 'Generated image'}
                      className="w-full h-auto max-h-[600px] object-contain bg-gray-100 dark:bg-gray-900"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDownload()}
                          className="p-4 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform shadow-xl"
                          title="Download"
                        >
                          <Download className="w-6 h-6 text-purple-600" />
                        </button>
                        <button
                          onClick={handleRegenerate}
                          disabled={loading}
                          className="p-4 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform shadow-xl disabled:opacity-50"
                          title="Regenerate"
                        >
                          <RefreshCw className={`w-6 h-6 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prompt Display */}
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prompt</p>
                      <p className="text-gray-700 dark:text-gray-200">{lastPrompt}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleDownload()}
                        className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                    <ImageIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Create</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Enter a detailed description and click "Generate Image" to create your AI artwork
                  </p>
                </div>
              )}
            </div>

            {/* Image History */}
            {imageHistory.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Creations</h2>
                  </div>
                  <button
                    onClick={() => setImageHistory([])}
                    className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setGeneratedImage(item.url);
                        setLastPrompt(item.prompt);
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs text-white truncate">{item.prompt}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.url);
                          }}
                          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Generate stunning, high-resolution images with advanced AI models</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Simply describe what you want and let AI do the magic</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlimited Creativity</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Create any style from photorealistic to artistic illustrations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imagegenerate;
