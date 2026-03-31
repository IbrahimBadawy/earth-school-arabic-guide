import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import objectives from '../data/general-objectives.json';

const tabs = [
  { key: 'shared', label: 'المشترك' },
  { key: '1', label: 'المستوى الأول' },
  { key: '2', label: 'المستوى الثاني' },
  { key: '3', label: 'المستوى الثالث' },
];

const levelColors = { '1': '#4CAF50', '2': '#2196F3', '3': '#FF9800' };
const stageColors = {
  'استقبال': '#7EC8E3',
  'إنتاج مبدئي': '#D4A574',
  'إنتاج': '#4CAF50',
  'تفاعل': '#FF9800',
  'إنتاج فعّال': '#2D6A4F',
};

export default function GeneralObjectivesPage() {
  const [activeTab, setActiveTab] = useState('shared');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">الأهداف العامة</h1>
        <p className="text-text-muted text-sm">الأهداف الرئيسية لمنهج اللغة العربية في مدرسة الأرض</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-print">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface text-text-light hover:bg-surface-hover border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'shared' ? (
            <div className="space-y-4">
              <div className="bg-surface rounded-2xl p-5 border border-border">
                <h3 className="font-bold text-primary mb-2">{objectives.shared.title}</h3>
                <p className="text-sm text-text-muted mb-4">{objectives.shared.description}</p>
              </div>
              <div className="space-y-3">
                {objectives.shared.objectives.map((obj, i) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-surface rounded-xl p-4 border border-border flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: stageColors[obj.stage] || '#888' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-text">{obj.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: (stageColors[obj.stage] || '#888') + '20', color: stageColors[obj.stage] || '#888' }}>
                          {obj.stage}
                        </span>
                      </div>
                      <p className="text-sm text-text-light leading-relaxed">{obj.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Progression Arrow */}
              <div className="text-center text-sm text-text-muted py-4">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {Object.entries(stageColors).map(([stage, color], i) => (
                    <span key={stage} className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span>{stage}</span>
                      {i < Object.keys(stageColors).length - 1 && <span className="mx-1">←</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ color: levelColors[activeTab] }}>
                {objectives.levels[activeTab].title}
              </h3>
              {objectives.levels[activeTab].domains.map((domain, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-2xl p-5 border border-border"
                >
                  <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: levelColors[activeTab] }} />
                    {domain.name}
                  </h4>
                  <ul className="space-y-2">
                    {domain.objectives.map((obj, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-text-light">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ backgroundColor: levelColors[activeTab] + 'CC' }}>
                          {j + 1}
                        </span>
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
