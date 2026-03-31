import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import assessment from '../data/assessment.json';
import { useAppContext } from '../context/AppContext';

const tabs = [
  { key: 'placement', label: 'تحديد المستوى', icon: '🎯' },
  { key: 'ongoing', label: 'التقييم المستمر', icon: '📋' },
  { key: 'rubrics', label: 'سلالم التقدير', icon: '📊' },
  { key: 'progress', label: 'متابعة التقدم', icon: '📈' },
];

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState('placement');
  const { selectedLevel } = useAppContext();
  const [rubricLevel, setRubricLevel] = useState(selectedLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">التقييم</h1>
        <p className="text-text-muted text-sm">أدوات ومعايير تقييم شاملة لمتابعة تقدم الأطفال</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-print">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface text-text-light border border-border hover:bg-surface-hover'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'placement' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessment.placementCriteria.levels.map((level) => (
                <div
                  key={level.level}
                  className="bg-surface rounded-2xl p-5 border-2 border-border"
                  style={{ borderColor: levelColors[level.level] + '40' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: levelColors[level.level] }}>
                      {level.level}
                    </span>
                    <div>
                      <h3 className="font-bold text-text">{level.name}</h3>
                      <p className="text-xs text-text-muted">{level.ageRange}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {level.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                        <span className="text-xs mt-1" style={{ color: levelColors[level.level] }}>✓</span>
                        <span className="leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ongoing' && (
            <div className="space-y-4">
              {assessment.ongoingAssessment.methods.map((method, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-2xl p-5 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-text">{method.name}</h3>
                    <span className="px-2 py-1 rounded-lg text-xs bg-primary/10 text-primary font-medium">
                      {method.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-text-light mb-3">{method.description}</p>
                  {method.tools.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-bold text-text-muted mb-1">الأدوات:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {method.tools.map((tool, j) => (
                          <span key={j} className="px-2 py-1 rounded-lg text-xs bg-secondary/10 text-secondary">{tool}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-accent/10 rounded-xl p-3">
                    <h4 className="text-xs font-bold text-accent mb-1">💡 نصائح:</h4>
                    <ul className="space-y-1">
                      {method.tips.map((tip, j) => (
                        <li key={j} className="text-xs text-text-light flex items-start gap-1.5">
                          <span className="text-accent">•</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'rubrics' && (
            <div className="space-y-4">
              <div className="flex gap-2 no-print">
                {[1, 2, 3].map((l) => (
                  <button
                    key={l}
                    onClick={() => setRubricLevel(l)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: rubricLevel === l ? levelColors[l] : levelColors[l] + '15',
                      color: rubricLevel === l ? 'white' : levelColors[l],
                    }}
                  >
                    المستوى {l === 1 ? 'الأول' : l === 2 ? 'الثاني' : 'الثالث'}
                  </button>
                ))}
              </div>

              {/* Proficiency Levels Legend */}
              <div className="flex flex-wrap gap-3 text-xs">
                {assessment.rubrics.proficiencyLevels.map((pl) => (
                  <span key={pl.level} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pl.color }} />
                    <span className="font-medium">{pl.level}</span>
                    <span className="text-text-muted">- {pl.description}</span>
                  </span>
                ))}
              </div>

              {/* Rubric Table */}
              {assessment.rubrics.levelRubrics[rubricLevel]?.map((rubric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-2xl overflow-hidden border border-border"
                >
                  <div className="p-4 font-bold text-text" style={{ backgroundColor: levelColors[rubricLevel] + '10' }}>
                    {rubric.skill}
                  </div>
                  <div className="divide-y divide-border">
                    {assessment.rubrics.proficiencyLevels.map((pl) => (
                      <div key={pl.level} className="p-4 flex gap-3">
                        <span className="flex-shrink-0 w-3 h-3 rounded-full mt-1" style={{ backgroundColor: pl.color }} />
                        <div>
                          <span className="text-xs font-bold" style={{ color: pl.color }}>{pl.level}</span>
                          <p className="text-sm text-text-light mt-0.5">{rubric.criteria[pl.level]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-surface rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-text mb-4">{assessment.progressTemplate.title}</h3>
              <p className="text-sm text-text-muted mb-6">{assessment.progressTemplate.note}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {assessment.progressTemplate.childFields.map((field, i) => (
                    <div key={i} className="bg-bg rounded-xl p-3 border border-border">
                      <label className="text-xs text-text-muted block mb-1">{field}</label>
                      <div className="h-8 border-b-2 border-border" />
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-bg">
                        <th className="p-3 text-right font-bold text-text border border-border">المهارة</th>
                        {assessment.progressTemplate.trackingPeriods.map((period) => (
                          <th key={period} className="p-3 text-center font-bold text-text border border-border">{period}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assessment.rubrics.levelRubrics[selectedLevel]?.map((rubric, i) => (
                        <tr key={i}>
                          <td className="p-3 border border-border text-text-light">{rubric.skill}</td>
                          {assessment.progressTemplate.trackingPeriods.map((period) => (
                            <td key={period} className="p-3 border border-border text-center">
                              <div className="w-full h-6 border border-dashed border-border rounded" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-text-muted text-center">
                  الرموز: ✓ متقن | ○ نامٍ | △ يحتاج دعم
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
