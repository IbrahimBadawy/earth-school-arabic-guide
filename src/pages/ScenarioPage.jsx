import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toArabicNumerals, formatDuration } from '../utils/arabicNumbers';
import { useAppContext } from '../context/AppContext';
import calendar from '../data/unit-calendar.json';
import scenariosData from '../data/daily-scenarios/index';

// Generate daily goal and summary based on level, week, session
function getDailyInfo(levelNum, weekNum, sessionNum, weekData) {
  const isIntro = sessionNum === 1;

  if (levelNum === 1) {
    const letter = weekData?.letter || '';
    const letterName = weekData?.letterName || '';
    if (weekNum === 12) {
      return {
        goal: isIntro
          ? `التعرف على حرفي الميم والنون وأصواتهما وأشكالهما`
          : `مراجعة شاملة لجميع الحروف المتعلمة (١٣ حرفًا) والاحتفال بالإنجاز`,
        summary: isIntro
          ? `اليوم نتعرف على آخر حرفين في الوحدة: الميم والنون. نقارن بينهما في الصوت والشكل مع مراجعة الحروف السابقة.`
          : `اليوم مراجعة ختامية لكل الحروف التي تعلمناها خلال ١٢ أسبوعًا مع أنشطة تجميعية واحتفال.`,
      };
    }
    return {
      goal: isIntro
        ? `التعرف على صوت حرف ${letterName} (${letter}) وشكله وتمارين ما قبل الكتابة`
        : `تعزيز وتثبيت حرف ${letterName} (${letter}) مع مراجعة الحروف السابقة`,
      summary: isIntro
        ? `اليوم نبدأ بقراءة قصة ثم نتعرف على حرف ${letterName} من خلال الوعي الصوتي (سماع صوته في الكلمات) والوعي البصري (التعرف على شكله) وأنشطة فنية لتمارين الخطوط.`
        : `اليوم نعزز ما تعلمناه عن حرف ${letterName} بأنشطة مختلفة ومتنوعة مع مراجعة الحروف السابقة من خلال ألعاب تفاعلية.`,
    };
  }

  if (levelNum === 2) {
    const focusMap = {
      1: { goal: 'مراجعة الأساسيات وتحليل أصوات بسيطة ودمج صوتين', summary: 'نراجع الحروف المعروفة ونبدأ تحليل الكلمات لأصوات ودمج صوتين لتكوين مقاطع.' },
      2: { goal: 'دمج أصوات ثنائية وبداية التعرف على الحركات', summary: 'نتدرب على دمج صوتين وثلاثة أصوات ونبدأ التعرف على الفتحة والضمة والكسرة.' },
      3: { goal: 'إتقان الحركات الثلاث (فتحة، ضمة، كسرة) ونطق الحروف بها', summary: 'نتدرب على نطق الحروف بالحركات المختلفة وقراءة مقاطع بسيطة بالحركات.' },
      4: { goal: 'التعرف على مواضع الحرف (أول، وسط، آخر) في الكلمة', summary: 'نتعلم أن الحرف يتغير شكله حسب مكانه في الكلمة ونتدرب على التمييز والتصنيف.' },
      5: { goal: 'قراءة مقاطع ثنائية وثلاثية وكتابة حروف منفصلة', summary: 'نقرأ مقاطع وكلمات بسيطة ونتدرب على كتابة الحروف في صورتها المنفصلة.' },
      6: { goal: 'دمج ثلاثة أصوات لتكوين كلمات وكتابة كلمات بسيطة', summary: 'نطور مهارة الدمج لتكوين كلمات كاملة ونبدأ بكتابة كلمات بحروف منفصلة.' },
      7: { goal: 'قراءة كلمات ثنائية وثلاثية بالحركات', summary: 'نقرأ كلمات كاملة بالحركات ونتدرب على فهم المقروء وربطه بالمعنى.' },
      8: { goal: 'كتابة كلمات بحروف منفصلة وبداية الاتصال', summary: 'نكتب كلمات كاملة ونبدأ بمحاولات ربط الحروف ببعضها في الكتابة.' },
      9: { goal: 'قراءة جمل قصيرة بالحركات وتعزيز الكتابة', summary: 'ننتقل من قراءة كلمات مفردة إلى جمل قصيرة ونعزز مهارات الكتابة.' },
      10: { goal: 'تعزيز القراءة والكتابة وتقييم التقدم', summary: 'نراجع كل المهارات المكتسبة ونقيّم مستوى كل طفل في القراءة والكتابة.' },
      11: { goal: 'مراجعة شاملة لكل مهارات المستوى الثاني', summary: 'مراجعة شاملة: تحليل ودمج، حركات، مواضع، قراءة، وكتابة.' },
      12: { goal: 'تقييم نهائي ومراجعة واحتفال بالإنجازات', summary: 'اليوم الأخير: تقييم ختامي لكل المهارات واحتفال بنهاية الوحدة.' },
    };
    const f = focusMap[weekNum] || focusMap[1];
    return {
      goal: isIntro ? f.goal : `تعزيز: ${f.goal}`,
      summary: isIntro ? f.summary : `نعزز ونثبت ما تعلمناه: ${f.summary}`,
    };
  }

  // Level 3
  const focusMap3 = {
    1: { goal: 'التمييز بين الحروف المتشابهة في المخرج والمرادفات والأضداد', summary: 'نتعلم التفريق بين الحروف المتشابهة صوتيًّا ونبدأ بالمرادفات والأضداد.' },
    2: { goal: 'التمييز بين الحروف المتشابهة شكلًا (ب/ت/ث، ج/ح/خ)', summary: 'نتدرب على التمييز بين الحروف المتشابهة في الشكل من خلال أنشطة مقارنة.' },
    3: { goal: 'الصوت الطويل والقصير والتاء المربوطة والهمزة', summary: 'نتعرف على الفرق بين المد والحركة القصيرة ونبدأ بالتاء المربوطة والهمزة.' },
    4: { goal: 'الكتابة المتصلة وكتابة كلمات كاملة بالاتصال', summary: 'نتدرب على كتابة الحروف متصلة في كلمات كاملة مع مراعاة اتجاه الكتابة.' },
    5: { goal: 'ترتيب كلمات لتكوين جمل صحيحة لغويًّا', summary: 'نتعلم بنية الجملة العربية ونتدرب على ترتيب كلمات لتكوين جمل مفيدة.' },
    6: { goal: 'المرادفات والأضداد وتوسيع المفردات', summary: 'نتعمق في المرادفات والأضداد ونوسع قاموس المفردات الفصحى.' },
    7: { goal: 'الجذر المشترك وعائلة الكلمة', summary: 'نتعرف على مفهوم الجذر المشترك وكيف تتفرع منه كلمات ذات معانٍ مرتبطة.' },
    8: { goal: 'قراءة فقرات قصيرة وفهم المقروء', summary: 'ننتقل من قراءة جمل إلى فقرات قصيرة مع أسئلة فهم واستيعاب.' },
    9: { goal: 'كتابة جمل وصفية وتعبير كتابي', summary: 'نكتب جملًا وصفية تعبر عن أفكارنا ونبدأ بتأليف فقرات قصيرة.' },
    10: { goal: 'قراءة مستقلة وتعزيز الطلاقة', summary: 'نتدرب على القراءة المستقلة بدون مساعدة ونعزز الطلاقة والسرعة.' },
    11: { goal: 'تأليف قصة قصيرة ومراجعة المهارات اللغوية', summary: 'كل طفل يؤلف قصة قصيرة خاصة به مع مراجعة كل المهارات اللغوية.' },
    12: { goal: 'مراجعة شاملة واحتفال ختامي بالإنجازات', summary: 'اليوم الأخير: عرض الأعمال والإنجازات واحتفال بنهاية الوحدة.' },
  };
  const f3 = focusMap3[weekNum] || focusMap3[1];
  return {
    goal: isIntro ? f3.goal : `تعزيز: ${f3.goal}`,
    summary: isIntro ? f3.summary : `نعزز ونثبت: ${f3.summary}`,
  };
}

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
      <div className="bg-white rounded-2xl border border-border p-8 no-print">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">سيناريو اليوم</h1>

        <div className="space-y-7">
          {/* Level */}
          <div className="flex items-center gap-5 flex-wrap">
            <label className="text-base font-semibold text-gray-600 min-w-[80px]">المستوى:</label>
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
          <div className="flex items-center gap-5 flex-wrap">
            <label className="text-base font-semibold text-gray-600 min-w-[80px]">الأسبوع:</label>
            <div className="flex gap-2.5 flex-wrap">
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
          <div className="flex items-center gap-5">
            <label className="text-base font-semibold text-gray-600 min-w-[80px]">اليوم:</label>
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

      {/* Daily Summary & Goal */}
      {(() => {
        const info = getDailyInfo(levelNum, weekNum, sessionNum, weekData);
        return (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {/* Goal */}
            <div className="p-6 border-b border-border" style={{ backgroundColor: color.main + '08' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: color.main + '15' }}>
                  🎯
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-800 mb-1">هدف اليوم</h3>
                  <p className="text-base leading-loose" style={{ color: color.main }}>{info.goal}</p>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">
                  📋
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-800 mb-1">ملخص اليوم</h3>
                  <p className="text-base text-gray-600 leading-loose">{info.summary}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
