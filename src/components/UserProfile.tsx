import { useUser } from '@clerk/clerk-react';
import { useEffect, useState, type JSX } from 'react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-base md:text-xl lg:text-2xl">
  {user?.firstName?.charAt(0)?.toUpperCase() || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'User'}
</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || 'User Profile'
                }
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.emailAddresses[0]?.emailAddress || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">API Keys</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure your AI model API keys to access different language models
              </p>
            </div>
          </div>

          {/* API Keys Grid */}
          <div className="space-y-6">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{apiKey.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {apiKey.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {apiKey.description}
                      </p>
                    </div>
                  </div>
                  <a
                    href={apiKey.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Get API Key →
                  </a>
                </div>

                <div className="relative">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type={showValues[apiKey.id] ? 'text' : 'password'}
                        value={apiKey.value}
                        onChange={(e) => handleApiKeyChange(apiKey.id, e.target.value)}
                        placeholder={apiKey.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => toggleShowValue(apiKey.id)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                      title={showValues[apiKey.id] ? 'Hide API key' : 'Show API key'}
                    >
                      {showValues[apiKey.id] ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>

                    {apiKey.value && (
                      <button
                        type="button"
                        onClick={() => clearApiKey(apiKey.id)}
                        className="px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg
                                 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                                 transition-colors duration-200"
                        title="Clear API key"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                {apiKey.value && (
                  <div className="mt-2 flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 dark:text-green-400">API key configured</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Your API keys are encrypted and stored securely. Never share your API keys publicly or in unsecured environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;