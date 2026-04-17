import { SignUp } from '@clerk/clerk-react';
import { type JSX } from 'react';
import { Zap } from 'lucide-react';

const Signup = (): JSX.Element => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-obsidian overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cobalt/15 blur-[160px] rounded-full pointer-events-none animate-pulse-slow" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Branding Accent */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-cobalt/10 border border-cobalt/20 rounded-3xl flex items-center justify-center text-cobalt shadow-[0_0_30px_rgba(3,40,184,0.3)]">
            <Zap className="w-8 h-8 fill-cobalt" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter text-silver">LLM<span className="text-cobalt">HUB</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate mt-1 opacity-60">Register New Unit</p>
          </div>
        </div>

        {/* Clerk Sign Up */}
        <div className="glass rounded-[32px] overflow-hidden shadow-2xl border-white/5">
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-none p-8',
                headerTitle: 'text-silver font-black tracking-tight text-2xl',
                headerSubtitle: 'text-slate font-medium text-sm',
                socialButtonsBlockButton: 'glass border-white/10 text-silver hover:bg-white/5 transition-all rounded-xl py-3',
                socialButtonsBlockButtonText: 'font-bold text-xs uppercase tracking-widest',
                dividerRow: 'text-slate/20',
                dividerText: 'text-[10px] font-black uppercase tracking-widest text-slate/40',
                formFieldLabel: 'text-[10px] font-black uppercase tracking-widest text-slate mb-2',
                formFieldInput: 'bg-black/40 border border-white/10 rounded-xl text-silver py-3 focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all',
                formButtonPrimary: 'bg-cobalt hover:bg-cobalt/90 text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(3,40,184,0.3)] transition-all hover:scale-[1.02] active:scale-95',
                footerActionText: 'text-slate font-medium text-xs',
                footerActionLink: 'text-cobalt font-black hover:text-cobalt/80 transition-colors',
                identityPreviewText: 'text-silver font-medium',
                identityPreviewEditButtonIcon: 'text-cobalt',
              },
              layout: {
                socialButtonsPlacement: 'top',
                shimmer: true
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;