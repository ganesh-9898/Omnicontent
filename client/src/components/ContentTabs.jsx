import { Twitter, Linkedin, Video, Search } from 'lucide-react';
import AssetCard from './AssetCard.jsx';

const TABS = [
  {
    key: 'twitterThread',
    tabKey: 'twitter',
    label: 'Twitter Thread',
    icon: Twitter,
    color: 'text-sky-500',
    accentBg: 'bg-sky-500',
  },
  {
    key: 'linkedinPost',
    tabKey: 'linkedin',
    label: 'LinkedIn Post',
    icon: Linkedin,
    color: 'text-blue-600',
    accentBg: 'bg-blue-600',
  },
  {
    key: 'videoScript',
    tabKey: 'videoScript',
    label: 'Video Script',
    icon: Video,
    color: 'text-purple-600',
    accentBg: 'bg-purple-600',
  },
  {
    key: 'seoMetadata',
    tabKey: 'seoMetadata',
    label: 'SEO Metadata',
    icon: Search,
    color: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
  },
];

export default function ContentTabs({ results }) {
  const availableTabs = TABS.filter((t) => results[t.key] !== undefined);

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Generated Assets</h2>
        <p className="text-slate-500 text-sm mt-1">
          {availableTabs.length} content asset{availableTabs.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      {/* All assets stacked */}
      <div className="space-y-6">
        {availableTabs.map(({ key, tabKey, label, icon, color, accentBg }) => (
          <AssetCard
            key={key}
            tabKey={tabKey}
            label={label}
            icon={icon}
            color={color}
            accentBg={accentBg}
            data={results[key]}
          />
        ))}
      </div>
    </section>
  );
}
