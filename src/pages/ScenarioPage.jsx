import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumerals, formatDuration } from '../utils/arabicNumbers';
import { useAppContext } from '../context/AppContext';
import calendar from '../data/unit-calendar.json';
import scenariosData from '../data/daily-scenarios/index';

const typeStyles = {
  story: { bg: 'bg-green-50', text: 'text-green-700', icon: '📖' },
  discussion: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '💬' },
  phonological: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '👂' },
  visual: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '👁️' },
  'art-lines': { bg: 'bg-pink-50', text: 'text-pink-700', icon: '🎨' },
  writing: { bg: 'bg-teal-50', text: 'text-teal-700', icon: '✍️' },
  drama: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🎭' },
  language: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '📝' },
  quran: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '📗' },
  activity: { bg: 'bg-lime-50', text: 'text-lime-700', icon: '🎯' },
};

export default function ScenarioPage() {
  const { level, week, session } = useParams();
  const { levelColors } = useAppContext();
  const [expandedBlock, setExpandedBlock] = useState(null);

  const levelNum = parseInt(level);
  const weekNum = parseInt(week);
  const sessionNum = parseInt(session);
  const color = levelColors[levelNum] || levelColors[1];
  const weekData = calendar.weeks.find((w) => w.weekNumber === weekNum);
  const scenarioKey = `L${levelNum}-W${weekNum}-S${sessionNum}`;
  const scenario = scenariosData[scenarioKey];

  const prev = sessionNum === 1
    ? weekNum > 1 ? { l: levelNum, w: weekNum - 1, s: 2 } : null
    : { l: levelNum, w: weekNum, s: 1 };
  const next = sessionNum === 2
    ? weekNum < 12 ? { l: levelNum, w: weekNum + 1, s: 1 } : null
    : { l: levelNum, w: weekNum, s: 2 };

  if (!scenario) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-5xl">📖</span>
        <h2 className="text-lg font-bold text-gray-800">سيناريو اليوم</h2>
        <p className="text-sm text-gray-500">{color.name} - الأسبوع {toArabicNumerals(weekNum)} - الفقرة {toArabicNumerals(sessionNum)}</p>
        <p className="text-sm text-gray-400">سيتم إضافة هذا السيناريو قريبًا</p>
        <div className="flex gap-3 justify-center mt-4">
          <Link to="/activities" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">مكتبة الأنشطة</Link>
          <Link to="/calendar" className="px-4 py-2 bg-white border border-border text-gray-600 rounded-lg text-sm">الخطة الزمنية</Link>
        </div>
      </div>
    );
  }

  const totalDuration = scenario.blocks.reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 rounded-md text-xs font-bold text-white" style={{ backgroundColor: color.main }}>{color.name}</span>
            <span className="text-sm text-gray-500">الأسبوع {toArabicNumerals(weekNum)} - {sessionNum === 1 ? 'الثلاثاء' : 'الخميس'}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">سيناريو الفقرة {toArabicNumerals(sessionNum)}</h1>
        </div>
        {levelNum === 1 && weekData && (
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color: color.main }}>{weekData.letter}</div>
            <p className="text-xs text-gray-400">حرف الأسبوع</p>
          </div>
        )}
      </div>

      {/* Level Switcher */}
      <div className="flex gap-2 no-print">
        {[1, 2, 3].map((l) => (
          <Link key={l} to={`/scenario/${l}/${weekNum}/${sessionNum}`} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: l === levelNum ? levelColors[l].main : 'white', color: l === levelNum ? 'white' : levelColors[l].main, border: `1px solid ${l === levelNum ? levelColors[l].main : '#e5e5e5'}` }}>
            {levelColors[l].name}
          </Link>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">المدة: {formatDuration(totalDuration)}</span>
          <button onClick={() => window.print()} className="no-print px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">🖨️ طباعة</button>
        </div>
        <div className="flex rounded-lg overflow-hidden h-7">
          {scenario.blocks.map((block, i) => {
            const ts = typeStyles[block.type] || typeStyles.activity;
            return (
              <button key={i} onClick={() => setExpandedBlock(expandedBlock === i ? null : i)} className={`relative group transition-opacity hover:opacity-80 ${ts.bg}`} style={{ width: `${(block.duration / totalDuration) * 100}%`, borderLeft: i > 0 ? '1.5px solid white' : 'none' }} title={`${block.title} (${formatDuration(block.duration)})`}>
                <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium ${ts.text}`}>
                  {block.duration >= 7 ? `${toArabicNumerals(block.duration)}د` : ''}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          {scenario.blocks.map((block, i) => {
            const ts = typeStyles[block.type] || typeStyles.activity;
            return (
              <span key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>{ts.icon}</span> {block.title}
              </span>
            );
          })}
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {scenario.blocks.map((block, i) => {
          const ts = typeStyles[block.type] || typeStyles.activity;
          const isOpen = expandedBlock === null || expandedBlock === i;

          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-border overflow-hidden">
              <button onClick={() => setExpandedBlock(expandedBlock === i ? null : i)} className="w-full px-4 py-3 flex items-center gap-3 text-right hover:bg-gray-50 transition-colors">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${ts.bg}`}>{ts.icon}</span>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-sm text-gray-800">{block.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{block.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${ts.bg} ${ts.text}`}>{formatDuration(block.duration)}</span>
                <span className={`text-gray-300 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">
                      {block.steps?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 mb-2">الخطوات:</h4>
                          <ol className="space-y-1.5">
                            {block.steps.map((step, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white mt-0.5`} style={{ backgroundColor: color.main + 'CC' }}>{toArabicNumerals(j + 1)}</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {block.materials?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 mb-1.5">الأدوات:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {block.materials.map((mat, j) => (
                              <span key={j} className="px-2 py-1 rounded-md text-xs bg-amber-50 text-amber-700">{mat}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {block.tips?.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h4 className="text-xs font-bold text-blue-700 mb-1">💡 نصائح:</h4>
                          <ul className="space-y-0.5">
                            {block.tips.map((tip, j) => (
                              <li key={j} className="text-xs text-blue-600 flex items-start gap-1"><span>•</span>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 no-print">
        {prev ? <Link to={`/scenario/${prev.l}/${prev.w}/${prev.s}`} className="px-4 py-2 bg-white border border-border rounded-lg text-sm text-gray-600 hover:bg-gray-50">→ السابقة</Link> : <div />}
        {next ? <Link to={`/scenario/${next.l}/${next.w}/${next.s}`} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark">التالية ←</Link> : <div />}
      </div>
    </div>
  );
}
