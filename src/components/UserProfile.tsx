import { useUser } from '@clerk/clerk-react';
import { useEffect, useState, type JSX } from 'react';
import { Key, Eye, EyeOff, X, ExternalLink, Shield, User, Mail, CheckCircle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  description: string;
  website: string;
  icon: string;
}

const UserProfile = (): JSX.Element => {
  const { user } = useUser();
 
  

  const [loaded, setLoaded] = useState<boolean>(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
   
    // {
    //   id: 'openai',
    //   name: 'OpenAI',
    //   value: '',
    //   placeholder: 'sk-...',
    //   description: 'GPT-4, GPT-3.5-turbo, and other OpenAI models',
    //   website: 'https://platform.openai.com/api-keys',
    //   icon: '🤖'
    // },
    {
      id: 'gemini',
      name: ' Gemini',
      value: '',
      placeholder: 'AIzaSy...',
      description: 'Google Gemini Pro and Gemini models',
      website: 'https://makersuite.google.com/app/apikey',
      icon: '💎'
    },
    // {
    //   id: 'anthropic',
    //   name: 'Anthropic Claude',
    //   value: '',
    //   placeholder: 'sk-ant-...',
    //   description: 'Claude 3 and other Anthropic models',
    //   website: 'https://console.anthropic.com/account/keys',
    //   icon: '🧠'
    // },
  //   {
  //   id: 'perplexity',
  //   name: 'Perplexity AI',
  //   value: '',
  //   placeholder: 'pplx-...',
  //   description: 'Perplexity models including pplx-7b-online, pplx-70b-online',
  //   website: 'https://www.perplexity.ai/settings/api',
  //   icon: '🔮'
  // },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      value: '',
      placeholder: 'sk-ant-...',
      description: 'Claude 3 and other Anthropic models',
      website: 'https://console.anthropic.com/account/keys',
      icon: '🧠'
    }
  ]);
  

  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({});
 //api keys persistence with localStorage and remove form when input free
  useEffect(() => {
  setApiKeys(prev =>
    prev.map(key => {
      const storedValue = localStorage.getItem(key.id);
      return storedValue ? { ...key, value: storedValue } : key;
    })
  );
  setLoaded(true);
}, []);

useEffect(() => {
  if (!loaded) return; // Avoid running on initial load
  apiKeys.forEach(key =>
    key.value && key.value.trim()
      ? localStorage.setItem(key.id, key.value)
      : localStorage.removeItem(key.id)
  );
}, [apiKeys, loaded]);

  const handleApiKeyChange = (id: string, value: string) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, value } : key
      )

    );

    
    
    
  };

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };



  const clearApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => key.id === id ? { ...key, value: '' } : key));

  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400 mb-3">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your account and API configurations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              {/* Profile Header with Blue Accent */}
              <div className="bg-blue-600 h-24"></div>
              
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.firstName || 'User'
                      }
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Member Account</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-sm break-all">
                        {user?.emailAddresses[0]?.emailAddress || 'user@example.com'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Key className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">
                        {apiKeys.filter(k => k.value).length} API keys configured
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {apiKeys.length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Models</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {apiKeys.filter(k => k.value).length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Keys</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - API Keys */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* API Keys Section Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Key Management</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Configure your AI model API keys to unlock different language models
                  </p>
                </div>
              </div>
            </div>

            {/* API Keys Grid */}
            <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Card Header */}
                <div className="bg-blue-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        {apiKey.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {apiKey.name}
                        </h3>
                        <p className="text-blue-100 text-sm">
                          {apiKey.description}
                        </p>
                      </div>
                    </div>
                    
                    {apiKey.value && (
                      <div className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-semibold">Active</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    
                    {/* API Key Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showValues[apiKey.id] ? 'text' : 'password'}
                            value={apiKey.value}
                            onChange={(e) => handleApiKeyChange(apiKey.id, e.target.value)}
                            placeholder={apiKey.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                                     focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => toggleShowValue(apiKey.id)}
                          className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-all
                                   text-gray-700 dark:text-gray-300"
                          title={showValues[apiKey.id] ? 'Hide API key' : 'Show API key'}
                        >
                          {showValues[apiKey.id] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>

                        {apiKey.value && (
                          <button
                            type="button"
                            onClick={() => clearApiKey(apiKey.id)}
                            className="px-4 py-3 border-2 border-red-200 dark:border-red-600 rounded-xl
                                     text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                                     transition-all"
                            title="Clear API key"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Get API Key Link */}
                    <div className="flex items-center justify-between pt-2">
                      <a
                        href={apiKey.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 
                                 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold
                                 hover:gap-3 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Get Your API Key
                      </a>
                      
                      {apiKey.value && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Configured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Security Notice */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-yellow-200 dark:border-yellow-800 overflow-hidden mt-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-lg mb-2">
                    Security Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                      <span>Your API keys are stored locally in your browser using localStorage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                      <span>Never share your API keys publicly or commit them to version control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                      <span>Rotate your keys regularly and revoke any compromised keys immediately</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default UserProfile;