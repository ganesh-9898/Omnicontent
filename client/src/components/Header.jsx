import { Layers } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-20">
      {/* Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-300 p-0.5 flex items-center justify-center shadow-lg shadow-teal-950/50">
          <div className="w-full h-full bg-slate-950/85 rounded-[10px] flex items-center justify-center">
            <Layers className="w-5 h-5 text-emerald-300" strokeWidth={2} />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
            OmniContent
          </h1>
          <p className="text-xs text-slate-300 leading-tight hidden sm:block">
            AI Multi-Channel Content Suite
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          AI Powered
        </span>
      </div>
    </header>
  );
}
