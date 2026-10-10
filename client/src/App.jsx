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
    <div className="min-h-screen relative">
      {/* Aurora background — fixed, full-screen, behind everything */}
      <div className="fixed inset-0 -z-10">
        <Aurora
          colorStops={['#7cff67', '#B497CF', '#5227FF']}
          blend={1}
          amplitude={1.0}
          speed={1.3}
        />
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <InputForm
          onSubmit={handleSubmit}
          loading={loading}
          defaultPlatforms={ALL_PLATFORMS}
        />

        {error && (
          <div className="card border-red-200 bg-red-50 p-5 flex items-start gap-3">
            <span className="text-red-500 text-xl leading-none mt-0.5">⚠</span>
            <div>
              <p className="font-semibold text-red-700">Something went wrong</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {results && <ContentTabs results={results} />}
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100 mt-10">
        OmniContent · AI-Powered Content Repurposing · Built with React + Express
      </footer>
    </div>
  );
}
