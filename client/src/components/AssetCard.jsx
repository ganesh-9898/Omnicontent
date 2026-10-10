import { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';

// ─── Serialise data to a plain string for clipboard ──────────────────────────

function serializeForClipboard(tabKey, data) {
  if (tabKey === 'twitter') {
    return data.map((t, i) => `${i + 1}/ ${t}`).join('\n\n');
  }
  if (tabKey === 'videoScript') {
    return `HOOK:\n${data.hook}\n\nBODY:\n${data.body}\n\nCALL TO ACTION:\n${data.cta}`;
  }
  if (tabKey === 'seoMetadata') {
    return `Title: ${data.metaTitle}\nDescription: ${data.metaDescription}\nTags: ${data.tags.join(', ')}`;
  }
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

// ─── Stat helpers ─────────────────────────────────────────────────────────────

function getStats(tabKey, data) {
  const text = serializeForClipboard(tabKey, data);
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { chars, words };
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function TwitterContent({ tweets }) {
  return (
    <div className="space-y-3">
      {tweets.map((tweet, i) => (
        <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{tweet}</p>
            <p className="text-xs text-slate-400 mt-2">{tweet.length} / 280 chars</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkedinContent({ text }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function VideoScriptContent({ script }) {
  const sections = [
    { label: '🎣 Hook', key: 'hook', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: '📋 Body', key: 'body', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { label: '📣 Call to Action', key: 'cta', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  ];

  return (
    <div className="space-y-3">
      {sections.map(({ label, key, color }) => (
        <div key={key} className={`p-4 rounded-xl border ${color.split(' ').slice(0, 2).join(' ')}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${color.split(' ')[2]}`}>{label}</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{script[key]}</p>
        </div>
      ))}
    </div>
  );
}

function SeoContent({ metadata }) {
  return (
    <div className="space-y-4">
      {/* Meta Title */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Meta Title</p>
        <p className="text-base font-semibold text-indigo-700">{metadata.metaTitle}</p>
        <p className="text-xs text-slate-400 mt-1">{metadata.metaTitle.length} chars (ideal: 50–60)</p>
      </div>

      {/* Meta Description */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Meta Description</p>
        <p className="text-sm text-slate-700 leading-relaxed">{metadata.metaDescription}</p>
        <p className="text-xs text-slate-400 mt-1">{metadata.metaDescription.length} chars (ideal: 150–160)</p>
      </div>

      {/* Tags */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5" /> Keywords / Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main AssetCard ───────────────────────────────────────────────────────────

export default function AssetCard({ tabKey, label, icon: Icon, color, accentBg, data }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = serializeForClipboard(tabKey, data);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const { chars, words } = getStats(tabKey, data);

  return (
    <div className="card overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center shadow-sm`}>
            <Icon className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{label}</h3>
            <p className="text-xs text-slate-400">
              {chars.toLocaleString()} chars · {words.toLocaleString()} words
            </p>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            copied
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy All
            </>
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="p-6">
        {tabKey === 'twitter' && <TwitterContent tweets={data} />}
        {tabKey === 'linkedin' && <LinkedinContent text={data} />}
        {tabKey === 'videoScript' && <VideoScriptContent script={data} />}
        {tabKey === 'seoMetadata' && <SeoContent metadata={data} />}
      </div>
    </div>
  );
}
