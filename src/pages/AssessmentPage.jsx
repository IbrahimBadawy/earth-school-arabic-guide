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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">التقييم</h1>
        <p className="text-sm text-gray-500 mt-1">أدوات ومعايير تقييم شاملة</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-print">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600 hover:bg-gray-50'}`}>{tab.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {activeTab === 'placement' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessment.placementCriteria.levels.map((level) => (
                <div key={level.level} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: levelColors[level.level] }}>{level.level}</span>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">{level.name}</h3>
                      <p className="text-xs text-gray-400">{level.ageRange}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {level.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span style={{ color: levelColors[level.level] }}>✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ongoing' && (
            <div className="space-y-3">
              {assessment.ongoingAssessment.methods.map((method, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-800">{method.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{method.frequency}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{method.description}</p>
                  {method.tools.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{method.tools.map((t, j) => <span key={j} className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700">{t}</span>)}</div>}
                  <div className="bg-blue-50 rounded-lg p-2.5">
                    <p className="text-xs font-bold text-blue-700 mb-1">💡 نصائح:</p>
                    <ul className="space-y-0.5">{method.tips.map((tip, j) => <li key={j} className="text-xs text-blue-600">• {tip}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rubrics' && (
            <div className="space-y-4">
              <div className="flex gap-2 no-print">
                {[1, 2, 3].map((l) => (
                  <button key={l} onClick={() => setRubricLevel(l)} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: rubricLevel === l ? levelColors[l] : 'white', color: rubricLevel === l ? 'white' : levelColors[l], border: `1px solid ${rubricLevel === l ? levelColors[l] : '#e5e5e5'}` }}>
                    م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {assessment.rubrics.proficiencyLevels.map((pl) => (
                  <span key={pl.level} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pl.color }} />
                    <strong>{pl.level}</strong> - {pl.description}
                  </span>
                ))}
              </div>
              {assessment.rubrics.levelRubrics[rubricLevel]?.map((rubric, i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 font-semibold text-sm text-gray-800 border-b border-gray-100" style={{ backgroundColor: levelColors[rubricLevel] + '08' }}>{rubric.skill}</div>
                  <div className="divide-y divide-gray-50">
                    {assessment.rubrics.proficiencyLevels.map((pl) => (
                      <div key={pl.level} className="px-4 py-3 flex gap-2">
                        <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: pl.color }} />
                        <div>
                          <span className="text-xs font-bold" style={{ color: pl.color }}>{pl.level}</span>
                          <p className="text-xs text-gray-600 mt-0.5">{rubric.criteria[pl.level]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm text-gray-800 mb-2">{assessment.progressTemplate.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{assessment.progressTemplate.note}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {assessment.progressTemplate.childFields.map((field, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2.5">
                    <label className="text-xs text-gray-400 block mb-1">{field}</label>
                    <div className="h-6 border-b border-gray-300" />
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-right font-bold text-gray-700 border border-gray-200">المهارة</th>
                      {assessment.progressTemplate.trackingPeriods.map((p) => <th key={p} className="p-2 text-center font-bold text-gray-700 border border-gray-200">{p}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {assessment.rubrics.levelRubrics[selectedLevel]?.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2 border border-gray-200 text-gray-600">{r.skill}</td>
                        {assessment.progressTemplate.trackingPeriods.map((p) => <td key={p} className="p-2 border border-gray-200 text-center"><div className="w-full h-5 border border-dashed border-gray-300 rounded" /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">✓ متقن | ○ نامٍ | △ يحتاج دعم</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
