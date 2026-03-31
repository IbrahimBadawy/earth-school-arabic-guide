import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import assessment from '../data/assessment.json';
import { useAppContext } from '../context/AppContext';

const tabs = [
  { key: 'placement', label: 'تحديد المستوى' },
  { key: 'ongoing', label: 'التقييم المستمر' },
  { key: 'rubrics', label: 'سلالم التقدير' },
  { key: 'progress', label: 'متابعة التقدم' },
];
const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState('placement');
  const { selectedLevel } = useAppContext();
  const [rubricLevel, setRubricLevel] = useState(selectedLevel);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">التقييم</h1>
        <p className="text-base text-gray-500">أدوات ومعايير تقييم شاملة</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-print">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600 hover:bg-gray-50'}`}>{tab.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {activeTab === 'placement' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessment.placementCriteria.levels.map((level) => (
                <div key={level.level} className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: levelColors[level.level] }}>{level.level}</span>
                    <div>
                      <h3 className="font-semibold text-base text-gray-800">{level.name}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">{level.ageRange}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {level.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-base text-gray-600 leading-relaxed">
                        <span className="mt-1" style={{ color: levelColors[level.level] }}>✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ongoing' && (
            <div className="space-y-5">
              {assessment.ongoingAssessment.methods.map((method, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base text-gray-800">{method.name}</h3>
                    <span className="text-xs px-3 py-1.5 rounded bg-primary/10 text-primary font-medium">{method.frequency}</span>
                  </div>
                  <p className="text-base text-gray-500 mb-4 leading-relaxed">{method.description}</p>
                  {method.tools.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {method.tools.map((t, j) => <span key={j} className="px-3 py-1.5 rounded text-sm bg-amber-50 text-amber-700">{t}</span>)}
                    </div>
                  )}
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <p className="text-sm font-bold text-blue-700 mb-3">💡 نصائح:</p>
                    <ul className="space-y-2">
                      {method.tips.map((tip, j) => <li key={j} className="text-sm text-blue-600 leading-relaxed">• {tip}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rubrics' && (
            <div className="space-y-5">
              <div className="flex gap-3 no-print">
                {[1, 2, 3].map((l) => (
                  <button key={l} onClick={() => setRubricLevel(l)} className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: rubricLevel === l ? levelColors[l] : 'white', color: rubricLevel === l ? 'white' : levelColors[l], border: `1px solid ${rubricLevel === l ? levelColors[l] : '#e5e5e5'}` }}>
                    م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-5 text-sm">
                {assessment.rubrics.proficiencyLevels.map((pl) => (
                  <span key={pl.level} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pl.color }} />
                    <strong>{pl.level}</strong> - {pl.description}
                  </span>
                ))}
              </div>
              {assessment.rubrics.levelRubrics[rubricLevel]?.map((rubric, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="px-6 py-4 font-semibold text-base text-gray-800 border-b border-gray-100" style={{ backgroundColor: levelColors[rubricLevel] + '08' }}>{rubric.skill}</div>
                  <div className="divide-y divide-gray-50">
                    {assessment.rubrics.proficiencyLevels.map((pl) => (
                      <div key={pl.level} className="px-6 py-4 flex gap-3">
                        <span className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: pl.color }} />
                        <div>
                          <span className="text-sm font-bold" style={{ color: pl.color }}>{pl.level}</span>
                          <p className="text-base text-gray-600 mt-1 leading-relaxed">{rubric.criteria[pl.level]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-base text-gray-800 mb-3">{assessment.progressTemplate.title}</h3>
              <p className="text-base text-gray-500 mb-5 leading-relaxed">{assessment.progressTemplate.note}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                {assessment.progressTemplate.childFields.map((field, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm text-gray-400 block mb-2">{field}</label>
                    <div className="h-6 border-b border-gray-300" />
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-right font-bold text-gray-700 border border-gray-200">المهارة</th>
                      {assessment.progressTemplate.trackingPeriods.map((p) => <th key={p} className="p-3 text-center font-bold text-gray-700 border border-gray-200">{p}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {assessment.rubrics.levelRubrics[selectedLevel]?.map((r, i) => (
                      <tr key={i}>
                        <td className="p-3 border border-gray-200 text-gray-600">{r.skill}</td>
                        {assessment.progressTemplate.trackingPeriods.map((p) => <td key={p} className="p-3 border border-gray-200 text-center"><div className="w-full h-6 border border-dashed border-gray-300 rounded" /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-400 text-center mt-4">✓ متقن | ○ نامٍ | △ يحتاج دعم</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
