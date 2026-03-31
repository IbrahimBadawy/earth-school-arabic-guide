import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumerals, formatDuration } from '../utils/arabicNumbers';
import { useAppContext } from '../context/AppContext';
import calendar from '../data/unit-calendar.json';
import scenariosData from '../data/daily-scenarios/index';

const typeStyles = {
  story: { bg: 'bg-green-50', text: 'text-green-700', icon: '📖', border: 'border-green-200' },
  discussion: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '💬', border: 'border-blue-200' },
  phonological: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '👂', border: 'border-orange-200' },
  visual: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '👁️', border: 'border-purple-200' },
  'art-lines': { bg: 'bg-pink-50', text: 'text-pink-700', icon: '🎨', border: 'border-pink-200' },
  writing: { bg: 'bg-teal-50', text: 'text-teal-700', icon: '✍️', border: 'border-teal-200' },
  drama: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🎭', border: 'border-amber-200' },
  language: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '📝', border: 'border-indigo-200' },
  quran: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '📗', border: 'border-emerald-200' },
  activity: { bg: 'bg-lime-50', text: 'text-lime-700', icon: '🎯', border: 'border-lime-200' },
};

export default function ScenarioPage() {
  const { level, week, session } = useParams();
  const { levelColors } = useAppContext();
  const navigate = useNavigate();
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

  return (
    <div className="space-y-10">
      {/* Selector Controls */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-6 no-print">
        <h1 className="text-xl font-bold text-gray-900">سيناريو اليوم</h1>

        {/* Level */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-semibold text-gray-600 min-w-[70px]">المستوى:</label>
          <div className="flex gap-3">
            {[1, 2, 3].map((l) => (
              <button
                key={l}
                onClick={() => navigate(`/scenario/${l}/${weekNum}/${sessionNum}`)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: l === levelNum ? levelColors[l].main : 'transparent',
                  color: l === levelNum ? 'white' : levelColors[l].main,
                  border: `2px solid ${levelColors[l].main}`,
                }}
              >
                {levelColors[l].name}
              </button>
            ))}
          </div>
        </div>

        {/* Week */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-semibold text-gray-600 min-w-[70px]">الأسبوع:</label>
          <div className="flex gap-2 flex-wrap">
            {calendar.weeks.map((w) => (
              <button
                key={w.weekNumber}
                onClick={() => navigate(`/scenario/${levelNum}/${w.weekNumber}/${sessionNum}`)}
                className="w-10 h-10 rounded-lg text-sm font-semibold transition-all flex items-center justify-center"
                style={{
                  backgroundColor: w.weekNumber === weekNum ? color.main : 'transparent',
                  color: w.weekNumber === weekNum ? 'white' : color.main,
                  border: `1.5px solid ${w.weekNumber === weekNum ? color.main : '#e5e5e5'}`,
                }}
              >
                {toArabicNumerals(w.weekNumber)}
              </button>
            ))}
          </div>
        </div>

        {/* Session / Day */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-600 min-w-[70px]">اليوم:</label>
          <div className="flex gap-3">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/scenario/${levelNum}/${weekNum}/${s}`)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: s === sessionNum ? color.main : 'transparent',
                  color: s === sessionNum ? 'white' : color.main,
                  border: `2px solid ${color.main}`,
                }}
              >
                {s === 1 ? '📅 الثلاثاء (الفقرة ١)' : '📅 الخميس (الفقرة ٢)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Info Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: color.main }}>{color.name}</span>
          <span className="text-base text-gray-600">
            الأسبوع {toArabicNumerals(weekNum)} - {sessionNum === 1 ? 'الثلاثاء' : 'الخميس'}
          </span>
        </div>
        {levelNum === 1 && weekData && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">حرف الأسبوع:</span>
            <span className="text-4xl font-bold" style={{ color: color.main }}>{weekData.letter}</span>
          </div>
        )}
      </div>

      {/* No scenario fallback */}
      {!scenario ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <span className="text-5xl block mb-4">📖</span>
          <p className="text-base text-gray-600 mb-3">سيتم إضافة هذا السيناريو قريبًا</p>
          <p className="text-sm text-gray-400">يمكنك اختيار أسبوع آخر أو زيارة مكتبة الأنشطة</p>
          <Link to="/activities" className="inline-block mt-5 px-5 py-2.5 bg-primary text-white rounded-lg text-sm">مكتبة الأنشطة</Link>
        </div>
      ) : (
        <>
          {/* Timeline Bar */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">المدة الإجمالية: <strong className="text-gray-800">{formatDuration(scenario.blocks.reduce((s, b) => s + b.duration, 0))}</strong></span>
              <button onClick={() => window.print()} className="no-print px-5 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">🖨️ طباعة</button>
            </div>
            <div className="flex rounded-lg overflow-hidden h-8 border border-gray-200">
              {scenario.blocks.map((block, i) => {
                const ts = typeStyles[block.type] || typeStyles.activity;
                const total = scenario.blocks.reduce((s, b) => s + b.duration, 0);
                return (
                  <button key={i} onClick={() => setExpandedBlock(expandedBlock === i ? null : i)} className={`relative group transition-opacity hover:opacity-80 ${ts.bg}`} style={{ width: `${(block.duration / total) * 100}%`, borderLeft: i > 0 ? '2px solid white' : 'none' }} title={`${block.title} (${formatDuration(block.duration)})`}>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${ts.text}`}>
                      {block.duration >= 7 ? `${toArabicNumerals(block.duration)}د` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-6 mt-4 flex-wrap">
              {scenario.blocks.map((block, i) => {
                const ts = typeStyles[block.type] || typeStyles.activity;
                return (
                  <span key={i} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-sm">{ts.icon}</span> {block.title}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Activity Blocks */}
          <div className="space-y-5">
            {scenario.blocks.map((block, i) => {
              const ts = typeStyles[block.type] || typeStyles.activity;
              const isOpen = expandedBlock === null || expandedBlock === i;

              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={`bg-white rounded-2xl border overflow-hidden ${expandedBlock === i ? ts.border : 'border-border'}`}>
                  <button onClick={() => setExpandedBlock(expandedBlock === i ? null : i)} className="w-full px-6 py-5 flex items-center gap-6 text-right hover:bg-gray-50/50 transition-colors">
                    <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${ts.bg}`}>{ts.icon}</span>
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-base text-gray-800">{block.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{block.description}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-xs font-bold ${ts.bg} ${ts.text}`}>{formatDuration(block.duration)}</span>
                    <span className={`text-gray-300 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
                          {/* Steps */}
                          {block.steps?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-gray-600 mb-3">الخطوات:</h4>
                              <ol className="space-y-3">
                                {block.steps.map((step, j) => (
                                  <li key={j} className="flex items-start gap-4 text-base text-gray-700">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ backgroundColor: color.main + 'CC' }}>{toArabicNumerals(j + 1)}</span>
                                    <span className="leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Materials */}
                          {block.materials?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-gray-600 mb-3">الأدوات المطلوبة:</h4>
                              <div className="flex flex-wrap gap-3">
                                {block.materials.map((mat, j) => (
                                  <span key={j} className="px-4 py-2 rounded-lg text-sm bg-amber-50 text-amber-800 border border-amber-200">{mat}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tips */}
                          {block.tips?.length > 0 && (
                            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                              <h4 className="text-sm font-bold text-blue-700 mb-3">💡 نصائح للمعلمة:</h4>
                              <ul className="space-y-2">
                                {block.tips.map((tip, j) => (
                                  <li key={j} className="text-sm text-blue-700 flex items-start gap-2 leading-relaxed"><span className="mt-1">•</span><span>{tip}</span></li>
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

          {/* Prev / Next */}
          <div className="flex justify-between items-center pt-4 no-print">
            {prev ? (
              <Link to={`/scenario/${prev.l}/${prev.w}/${prev.s}`} className="px-5 py-2.5 bg-white border border-border rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">→ الفقرة السابقة</Link>
            ) : <div />}
            {next ? (
              <Link to={`/scenario/${next.l}/${next.w}/${next.s}`} className="px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-medium hover:bg-primary-dark transition-colors">الفقرة التالية ←</Link>
            ) : <div />}
          </div>
        </>
      )}
    </div>
  );
}
