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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">الأهداف العامة</h1>
        <p className="text-sm text-gray-500 mt-1">الأهداف الرئيسية لمنهج اللغة العربية</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-print">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-border hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'shared' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">{objectives.shared.description}</p>
              {objectives.shared.objectives.map((obj, i) => (
                <div key={obj.id} className="bg-white rounded-xl border border-border p-4 flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{obj.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{obj.description}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">{obj.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {objectives.levels[activeTab].domains.map((domain, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: levelColors[activeTab] }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: levelColors[activeTab] }} />
                    {domain.name}
                  </h4>
                  <ul className="space-y-2">
                    {domain.objectives.map((obj, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white mt-0.5" style={{ backgroundColor: levelColors[activeTab] + 'CC' }}>
                          {j + 1}
                        </span>
                        <span className="leading-relaxed">{obj}</span>
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
