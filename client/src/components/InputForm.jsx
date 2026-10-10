import { useState } from 'react';
import { Sparkles, Twitter, Linkedin, Video, Search } from 'lucide-react';

const PLATFORMS = [
  {
    key: 'twitter',
    label: 'Twitter Thread',
    icon: Twitter,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    check: 'accent-sky-500',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn Post',
    icon: Linkedin,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    check: 'accent-blue-600',
  },
  {
    key: 'videoScript',
    label: 'Video Script',
    icon: Video,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    check: 'accent-purple-600',
  },
  {
    key: 'seoMetadata',
    label: 'SEO Metadata',
    icon: Search,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    check: 'accent-emerald-600',
  },
];

export default function InputForm({ onSubmit, loading, defaultPlatforms }) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set(defaultPlatforms));

  function togglePlatform(key) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // keep at least one
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
    <section className="card p-6 sm:p-8">
      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Paste Your Content</h2>
        <p className="text-slate-500 text-sm mt-1">
          Paste a blog post, article, newsletter, or rough draft — we'll do the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your long-form content here (minimum 50 characters)…

Example: A blog post about AI trends, a product update newsletter, a research summary, or any article you want to repurpose across social media and SEO channels."
            rows={10}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y text-sm leading-relaxed transition-colors disabled:opacity-60 scrollbar-thin"
          />
          {/* Char/word counter */}
          <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400 bg-slate-50 px-1">
            <span>{charCount.toLocaleString()} chars</span>
            <span className="text-slate-300">·</span>
            <span>{wordCount.toLocaleString()} words</span>
            {charCount > 0 && charCount < 50 && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-amber-500">{50 - charCount} more needed</span>
              </>
            )}
          </div>
        </div>

        {/* Platform checkboxes */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Generate for:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map(({ key, label, icon: Icon, color, bg, border }) => {
              const checked = selectedPlatforms.has(key);
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    checked
                      ? `${bg} ${border} shadow-sm`
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePlatform(key)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                  }`}>
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} strokeWidth={2} />
                  <span className={`text-xs font-medium ${checked ? 'text-slate-700' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={!isReady} className="btn-primary">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>

          {loading && (
            <p className="text-sm text-slate-500 animate-pulse">
              AI is crafting your content assets…
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
