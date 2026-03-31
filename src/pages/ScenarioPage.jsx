import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumerals, formatDuration } from '../utils/arabicNumbers';
import { useAppContext } from '../context/AppContext';
import calendar from '../data/unit-calendar.json';
import scenariosData from '../data/daily-scenarios/index';

const typeColors = {
  story: { bg: '#E8F5E9', color: '#2D6A4F', icon: '📖' },
  discussion: { bg: '#E3F2FD', color: '#1565C0', icon: '💬' },
  phonological: { bg: '#FFF3E0', color: '#E65100', icon: '👂' },
  visual: { bg: '#F3E5F5', color: '#6A1B9A', icon: '👁️' },
  'art-lines': { bg: '#FCE4EC', color: '#C62828', icon: '🎨' },
  writing: { bg: '#E0F2F1', color: '#00695C', icon: '✍️' },
  drama: { bg: '#FFF8E1', color: '#F57F17', icon: '🎭' },
  language: { bg: '#E8EAF6', color: '#283593', icon: '📝' },
  quran: { bg: '#E8F5E9', color: '#2E7D32', icon: '📗' },
  activity: { bg: '#F1F8E9', color: '#558B2F', icon: '🎯' },
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

  const prevSession = sessionNum === 1
    ? weekNum > 1 ? { level: levelNum, week: weekNum - 1, session: 2 } : null
    : { level: levelNum, week: weekNum, session: 1 };
  const nextSession = sessionNum === 2
    ? weekNum < 12 ? { level: levelNum, week: weekNum + 1, session: 1 } : null
    : { level: levelNum, week: weekNum, session: 2 };

  if (!scenario) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">📖</span>
        <h2 className="text-xl font-bold text-primary">سيناريو اليوم</h2>
        <p className="text-text-muted">
          {color.name} - الأسبوع {toArabicNumerals(weekNum)} - الفقرة {toArabicNumerals(sessionNum)}
        </p>
        <p className="text-sm text-text-light">حرف الأسبوع: <span className="text-3xl font-bold text-primary">{weekData?.letter}</span></p>
        <div className="bg-surface rounded-2xl p-6 max-w-lg mx-auto border border-border">
          <p className="text-text-light text-sm leading-relaxed">
            سيتم إضافة السيناريو التفصيلي قريبًا. في الوقت الحالي يمكنك الاطلاع على مكتبة الأنشطة والأهداف التفصيلية.
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <Link to="/activities" className="px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary-dark transition-colors">
              مكتبة الأنشطة
            </Link>
            <Link to="/objectives/detailed" className="px-4 py-2 bg-surface border border-border text-text-light rounded-xl text-sm hover:bg-surface-hover transition-colors">
              الأهداف التفصيلية
            </Link>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          {prevSession && (
            <Link to={`/scenario/${prevSession.level}/${prevSession.week}/${prevSession.session}`} className="text-sm text-primary hover:underline">
              → الفقرة السابقة
            </Link>
          )}
          {nextSession && (
            <Link to={`/scenario/${nextSession.level}/${nextSession.week}/${nextSession.session}`} className="text-sm text-primary hover:underline">
              الفقرة التالية ←
            </Link>
          )}
        </div>
        {/* Level switcher */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((l) => (
            <Link
              key={l}
              to={`/scenario/${l}/${weekNum}/${sessionNum}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: l === levelNum ? levelColors[l].main : levelColors[l].light,
                color: l === levelNum ? 'white' : levelColors[l].main,
              }}
            >
              {levelColors[l].name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Calculate timeline bar
  const totalDuration = scenario.blocks.reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color.main }}>
              {color.name}
            </span>
            <span className="text-sm text-text-muted">
              الأسبوع {toArabicNumerals(weekNum)} - الفقرة {toArabicNumerals(sessionNum)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary">سيناريو اليوم</h1>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: color.main }}>{weekData?.letter}</div>
          <p className="text-xs text-text-muted mt-1">حرف الأسبوع</p>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">المدة الإجمالية: {formatDuration(totalDuration)}</span>
          <button onClick={() => window.print()} className="no-print px-3 py-1 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
            🖨️ طباعة
          </button>
        </div>
        <div className="flex rounded-lg overflow-hidden h-8">
          {scenario.blocks.map((block, i) => {
            const tc = typeColors[block.type] || typeColors.activity;
            return (
              <button
                key={i}
                onClick={() => setExpandedBlock(expandedBlock === i ? null : i)}
                className="relative group transition-all hover:opacity-80"
                style={{
                  width: `${(block.duration / totalDuration) * 100}%`,
                  backgroundColor: tc.bg,
                  borderRight: i < scenario.blocks.length - 1 ? '2px solid white' : 'none',
                }}
                title={`${block.title} (${formatDuration(block.duration)})`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium" style={{ color: tc.color }}>
                  {block.duration > 5 ? `${toArabicNumerals(block.duration)}د` : ''}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          {scenario.blocks.map((block, i) => {
            const tc = typeColors[block.type] || typeColors.activity;
            return (
              <span key={i} className="flex items-center gap-1 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tc.color }} />
                {block.title}
              </span>
            );
          })}
        </div>
      </div>

      {/* Activity Blocks */}
      <div className="space-y-4">
        {scenario.blocks.map((block, i) => {
          const tc = typeColors[block.type] || typeColors.activity;
          const isExpanded = expandedBlock === i || expandedBlock === null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border overflow-hidden bg-white"
            >
              <button
                onClick={() => setExpandedBlock(expandedBlock === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-right hover:bg-gray-50 transition-colors"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: tc.bg }}>
                  {tc.icon}
                </span>
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-text text-sm">{block.title}</h3>
                  <p className="text-xs text-text-muted">{block.description}</p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: tc.bg, color: tc.color }}>
                  {formatDuration(block.duration)}
                </span>
                <span className={`transition-transform text-text-muted ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Steps */}
                      {block.steps && block.steps.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-text-muted mb-2">الخطوات:</h4>
                          <ol className="space-y-2">
                            {block.steps.map((step, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-text-light">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: tc.color + 'CC' }}>
                                  {toArabicNumerals(j + 1)}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Materials */}
                      {block.materials && block.materials.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-text-muted mb-2">الأدوات:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {block.materials.map((mat, j) => (
                              <span key={j} className="px-2 py-1 rounded-lg text-xs bg-secondary/10 text-secondary font-medium">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      {block.tips && block.tips.length > 0 && (
                        <div className="bg-accent/10 rounded-xl p-3">
                          <h4 className="text-xs font-bold text-accent mb-1.5 flex items-center gap-1">💡 نصائح:</h4>
                          <ul className="space-y-1">
                            {block.tips.map((tip, j) => (
                              <li key={j} className="text-xs text-text-light flex items-start gap-1.5">
                                <span className="text-accent mt-0.5">•</span>
                                {tip}
                              </li>
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
        {prevSession ? (
          <Link to={`/scenario/${prevSession.level}/${prevSession.week}/${prevSession.session}`} className="px-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-light hover:bg-surface-hover transition-colors">
            → الفقرة السابقة
          </Link>
        ) : <div />}
        <div className="flex gap-2">
          {[1, 2, 3].map((l) => (
            <Link
              key={l}
              to={`/scenario/${l}/${weekNum}/${sessionNum}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: l === levelNum ? levelColors[l].main : levelColors[l].light,
                color: l === levelNum ? 'white' : levelColors[l].main,
              }}
            >
              م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
            </Link>
          ))}
        </div>
        {nextSession ? (
          <Link to={`/scenario/${nextSession.level}/${nextSession.week}/${nextSession.session}`} className="px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-primary-dark transition-colors">
            الفقرة التالية ←
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
