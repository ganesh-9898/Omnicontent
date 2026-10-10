import { Layers } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text leading-tight">OmniContent</h1>
            <p className="text-xs text-slate-400 leading-tight hidden sm:block">AI Multi-Channel Content Suite</p>
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            AI Powered
          </span>
        </div>
      </div>
    </header>
  );
}
