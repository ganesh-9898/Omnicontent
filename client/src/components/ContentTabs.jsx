import { Twitter, Linkedin, Video, Search } from 'lucide-react';
import AssetCard from './AssetCard.jsx';

const TABS = [
  {
    key: 'twitterThread',
    tabKey: 'twitter',
    label: 'Twitter Thread',
    icon: Twitter,
    iconColor: 'text-sky-400',
    accentBg: 'bg-sky-500',
  },
  {
    key: 'linkedinPost',
    tabKey: 'linkedin',
    label: 'LinkedIn Post',
    icon: Linkedin,
    iconColor: 'text-blue-400',
    accentBg: 'bg-blue-500',
  },
  {
    key: 'videoScript',
    tabKey: 'videoScript',
    label: 'Video Script',
    icon: Video,
    iconColor: 'text-purple-400',
    accentBg: 'bg-purple-500',
  },
  {
    key: 'seoMetadata',
    tabKey: 'seoMetadata',
    label: 'SEO Metadata',
    icon: Search,
    iconColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
  },
];

export default function ContentTabs({ results }) {
  const availableTabs = TABS.filter((t) => results[t.key] !== undefined);

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-bold text-white">Generated Assets</h2>
        <p className="text-slate-400 text-sm mt-1">
          {availableTabs.length} content asset{availableTabs.length !== 1 ? 's' : ''} generated
        </p>
      </div>

      {/* All assets stacked */}
      <div className="space-y-6">
        {availableTabs.map(({ key, tabKey, label, icon, iconColor, accentBg }) => (
          <AssetCard
            key={key}
            tabKey={tabKey}
            label={label}
            icon={icon}
            iconColor={iconColor}
            accentBg={accentBg}
            data={results[key]}
          />
        ))}
      </div>
    </section>
  );
}
