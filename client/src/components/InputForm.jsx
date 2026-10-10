import { useState } from 'react';
import { Sparkles, Twitter, Linkedin, Video, Search, ShieldCheck } from 'lucide-react';

const PLATFORMS = [
  {
    key: 'twitter',
    label: 'Twitter Thread',
    icon: Twitter,
    iconColor: 'text-sky-400',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn Post',
    icon: Linkedin,
    iconColor: 'text-blue-400',
  },
  {
    key: 'videoScript',
    label: 'Video Script',
    icon: Video,
    iconColor: 'text-purple-400',
  },
  {
    key: 'seoMetadata',
    label: 'SEO Metadata',
    icon: Search,
    iconColor: 'text-emerald-400',
  },
];

export default function InputForm({ onSubmit, loading, defaultPlatforms }) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(defaultPlatforms));

  function togglePlatform(key) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || loading) return;
    onSubmit(content.trim(), Array.from(selectedPlatforms));
  }

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isReady = content.trim().length >= 50 && !loading;

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Transform Drafts into Multi-Channel Assets
        </h2>
        <p className="text-slate-300 text-sm mt-1">
          Paste your article, newsletter, or transcript. Our AI will reformat it for social, video, and SEO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Textarea inside glass-input wrapper */}
        <div className="glass-input rounded-2xl p-4 transition-all">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your long-form content here (minimum 50 characters)…"
            rows={7}
            disabled={loading}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none leading-relaxed disabled:opacity-60 scrollbar-thin"
          />
          {/* Stats bar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {charCount.toLocaleString()} chars
              </span>
              <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {wordCount.toLocaleString()} words
              </span>
              {charCount > 0 && charCount < 50 && (
                <span className="text-amber-400">{50 - charCount} more needed</span>
              )}
            </div>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ready for Transformation
            </span>
          </div>
        </div>

        {/* Platform checkboxes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            Target Channels
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map(({ key, label, icon: Icon, iconColor }) => {
              const checked = selectedPlatforms.has(key);
              return (
                <label
                  key={key}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    checked
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlatform(key)}
                    disabled={loading}
                    className="sr-only"
                  />
                  {/* Custom checkbox dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? 'bg-teal-500 border-teal-500' : 'border-slate-500 bg-transparent'
                    }`}
                  >
                    {checked && (
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} strokeWidth={2} />
                  <span className="text-xs font-medium text-slate-200">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={!isReady} className="btn-primary w-full py-3.5 justify-center text-base">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Synthesizing Assets…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Multi-Channel Assets
            </>
          )}
        </button>
      </form>
    </section>
  );
}
