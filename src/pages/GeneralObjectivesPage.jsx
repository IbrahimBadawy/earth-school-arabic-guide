import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import objectives from '../data/general-objectives.json';

const tabs = [
  { key: 'shared', label: 'أهداف مشتركة' },
  { key: '1', label: 'المستوى الأول' },
  { key: '2', label: 'المستوى الثاني' },
  { key: '3', label: 'المستوى الثالث' },
];

const levelColors = { '1': '#4CAF50', '2': '#2196F3', '3': '#FF9800' };

export default function GeneralObjectivesPage() {
  const [activeTab, setActiveTab] = useState('shared');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">الأهداف العامة</h1>
        <p className="text-base text-gray-500">الأهداف الرئيسية لمنهج اللغة العربية</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-print">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 border border-border hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {activeTab === 'shared' ? (
            <div className="space-y-5">
              <p className="text-base text-gray-500 leading-relaxed mb-3">{objectives.shared.description}</p>
              {objectives.shared.objectives.map((obj, i) => (
                <div key={obj.id} className="bg-white rounded-2xl border border-border p-6 flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-800 mb-2">{obj.title}</h4>
                    <p className="text-base text-gray-600 leading-loose">{obj.description}</p>
                    <span className="inline-block mt-3 text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500">{obj.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {objectives.levels[activeTab].domains.map((domain, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border p-6">
                  <h4 className="font-bold text-base mb-5 flex items-center gap-2.5" style={{ color: levelColors[activeTab] }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: levelColors[activeTab] }} />
                    {domain.name}
                  </h4>
                  <ul className="space-y-4">
                    {domain.objectives.map((obj, j) => (
                      <li key={j} className="flex items-start gap-3 text-base text-gray-700">
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ backgroundColor: levelColors[activeTab] + 'CC' }}>
                          {j + 1}
                        </span>
                        <span className="leading-loose">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
