import { useState } from 'react';
import Header from './components/Header.jsx';
import InputForm from './components/InputForm.jsx';
import ContentTabs from './components/ContentTabs.jsx';
import Aurora from './components/Aurora.jsx';

const ALL_PLATFORMS = ['twitter', 'linkedin', 'videoScript', 'seoMetadata'];

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(content, platforms) {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Server error. Please try again.');
      }

      setResults(json.data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Fluid Aurora background — fixed, full-screen, behind everything */}
      <div className="fixed inset-0 -z-10">
        <Aurora
          colorStops={['#10b981', '#0d9488', '#06b6d4']}
          blend={0.85}
          amplitude={1.1}
          speed={1.2}
        />
      </div>

      {/* Ambient dot-grid overlay */}
      <div className="bg-grid-pattern" />

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <InputForm
          onSubmit={handleSubmit}
          loading={loading}
          defaultPlatforms={ALL_PLATFORMS}
        />

        {error && (
          <div className="glass-panel rounded-2xl p-5 flex items-start gap-3 border-red-500/30">
            <span className="text-red-400 text-xl leading-none mt-0.5">⚠</span>
            <div>
              <p className="font-semibold text-red-300">Something went wrong</p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {results && <ContentTabs results={results} />}
      </main>

      <footer className="w-full text-center py-5 text-xs text-slate-400 border-t border-white/5 backdrop-blur-sm mt-10">
        OmniContent AI &bull; Powered by Fluid Aurora &amp; Gemini API
      </footer>
    </div>
  );
}
