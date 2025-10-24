const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              About LLMHUB
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your gateway to the most advanced AI language models, all in one place
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            LLMHUB is dedicated to democratizing access to cutting-edge AI technology. We believe that powerful 
            AI tools should be accessible to everyone, from students and researchers to businesses and developers.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            By bringing together multiple AI models in a single, intuitive interface, we're making it easier 
            than ever to harness the power of artificial intelligence for your unique needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-800/50 
                        rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Multiple AI Models</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Access GPT-4, Claude, Gemini, and more - all from a single platform. Choose the perfect model 
              for your specific task.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-gray-800 dark:to-gray-800/50 
                        rounded-2xl p-8 border border-purple-200 dark:border-gray-700">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Optimized infrastructure ensures you get responses in milliseconds, not seconds. 
              Experience the speed of modern AI.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-gray-800 dark:to-gray-800/50 
                        rounded-2xl p-8 border border-pink-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Privacy First</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your data is encrypted end-to-end. We never store your conversations or use them for training. 
              Your privacy is our priority.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-gray-800 dark:to-gray-800/50 
                        rounded-2xl p-8 border border-green-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Easy to Use</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Clean, intuitive interface designed for everyone. No technical expertise required - 
              just type and get intelligent responses.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Powered By</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'GPT-4', provider: 'OpenAI', icon: '🤖' },
              { name: 'Claude 3', provider: 'Anthropic', icon: '🧠' },
              { name: 'Gemini Pro', provider: 'Google', icon: '✨' },
              { name: 'Llama 2', provider: 'Meta', icon: '🦙' },
              { name: 'Mistral', provider: 'Mistral AI', icon: '🌪️' },
              { name: 'GPT-3.5', provider: 'OpenAI', icon: '⚡' },
            ].map((model) => (
              <div 
                key={model.name}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 
                         border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
              >
                <span className="text-3xl">{model.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{model.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{model.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of users already experiencing the future of AI
          </p>
          <div className="flex items-center justify-center gap-4">
            <a 
              href="/signup"
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 
                       rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200
                       shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Sign Up Free
            </a>
            <a 
              href="/"
              className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 
                       bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600
                       rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200
                       shadow-lg hover:shadow-xl"
            >
              Try Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
