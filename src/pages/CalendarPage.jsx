import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import localCalendar from '../data/unit-calendar.json';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toArabicNumerals } from '../utils/arabicNumbers';

const defaultL2Focus = [
  'مراجعة وتأسيس - تحليل أصوات بسيطة', 'دمج صوتين - بداية الحركات',
  'الحركات الثلاث - فتحة وضمة وكسرة', 'مواضع الحرف - أول ووسط وآخر',
  'قراءة مقاطع ثنائية - كتابة حروف', 'دمج ثلاثة أصوات - كلمات بسيطة',
  'قراءة كلمات ثنائية وثلاثية', 'كتابة كلمات بحروف منفصلة',
  'قراءة جمل قصيرة بالحركات', 'تعزيز القراءة والكتابة',
  'مراجعة شاملة وتقييم', 'مراجعة نهائية واحتفال',
];

const defaultL3Focus = [
  'حروف متشابهة - تمييز المخارج', 'الصوت الطويل والقصير',
  'التاء المربوطة والهمزة', 'الكتابة المتصلة - كلمات كاملة',
  'ترتيب كلمات لتكوين جمل', 'المرادفات والأضداد',
  'الجذر المشترك - عائلة الكلمة', 'قراءة فقرات قصيرة',
  'كتابة جمل وصفية', 'قراءة مستقلة وطلاقة',
  'تأليف قصة قصيرة', 'مراجعة شاملة واحتفال ختامي',
];

export default function CalendarPage() {
  const { selectedLevel, setSelectedLevel, currentWeek, setCurrentWeek, levelColors } = useAppContext();
  const { isAdmin, assignedLevels, assignments } = useAuth();
  const visibleLevels = isAdmin ? [1, 2, 3] : assignedLevels;
  const color = levelColors[selectedLevel];

  // Load calendar + level focuses from Supabase
  const [calendarData, setCalendarData] = useState(localCalendar);
  const [l2Focus, setL2Focus] = useState(defaultL2Focus);
  const [l3Focus, setL3Focus] = useState(defaultL3Focus);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase.from('unit_weeks').select('*').order('week_number').then(({ data }) => {
      if (data?.length) {
        setCalendarData({
          ...localCalendar,
          weeks: data.map(w => ({
            weekNumber: w.week_number, letter: w.letter,
            letterName: w.letter_name, theme: w.theme,
            sessions: [
              { session: 1, focus: w.session1_focus },
              { session: 2, focus: w.session2_focus },
            ]
          }))
        });
      }
    });
    supabase.from('general_objectives').select('data').eq('id', 'calendar_l2').single().then(({ data }) => {
      if (data?.data) setL2Focus(data.data);
    });
    supabase.from('general_objectives').select('data').eq('id', 'calendar_l3').single().then(({ data }) => {
      if (data?.data) setL3Focus(data.data);
    });
  }, []);

  const getLevelFocus = (w) => {
    if (selectedLevel === 1) return `حرف ${w.letter} - ${w.letterName}`;
    if (selectedLevel === 2) return l2Focus[w.weekNumber - 1] || '';
    return l3Focus[w.weekNumber - 1] || '';
  };

  const canSeeSession = (lvl, sess) => {
    if (isAdmin) return true;
    const day = sess === 1 ? 'tuesday' : 'thursday';
    return assignments.some(a => a.level === lvl && a.day === day);
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">الخطة الزمنية</h1>
        <p className="text-base text-gray-500">
          ١٢ أسبوع × فقرتين (الثلاثاء والخميس) = ٢٤ فقرة | ٤٥ دقيقة لكل فقرة
        </p>
      </div>

      {/* Level Selector */}
      <div className="flex gap-3">
        {visibleLevels.map((l) => (
          <button
            key={l}
            onClick={() => setSelectedLevel(l)}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedLevel === l ? levelColors[l].main : 'white',
              color: selectedLevel === l ? 'white' : levelColors[l].main,
              border: `1.5px solid ${selectedLevel === l ? levelColors[l].main : '#e5e5e5'}`,
            }}
          >
            {levelColors[l].name}
          </button>
        ))}
      </div>

      {/* Level description */}
      <div className="bg-white rounded-2xl border border-border p-6 text-base text-gray-600 leading-relaxed">
        {selectedLevel === 1 && 'المستوى الأول: حرف جديد كل أسبوع مع مراجعة الحروف السابقة. المحاور: الوعي الصوتي والبصري وما قبل الكتابة.'}
        {selectedLevel === 2 && 'المستوى الثاني: التركيز على تحليل الأصوات ودمجها والحركات ومواضع الحروف والبدء بالقراءة والكتابة.'}
        {selectedLevel === 3 && 'المستوى الثالث: القراءة المستقلة والكتابة المتصلة وتكوين الجمل والمهارات اللغوية المتقدمة.'}
      </div>

      {/* Weeks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {calendarData.weeks.map((week, i) => (
          <motion.div
            key={week.weekNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-2xl border bg-white overflow-hidden transition-all hover:shadow-sm ${
              currentWeek === week.weekNumber ? 'ring-2 ring-offset-1' : ''
            }`}
            style={{ ringColor: color.main }}
            onClick={() => setCurrentWeek(week.weekNumber)}
          >
            {/* Week Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: color.light }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color.main }}>
                  {toArabicNumerals(week.weekNumber)}
                </span>
                <span className="text-base font-semibold text-gray-800">الأسبوع {toArabicNumerals(week.weekNumber)}</span>
              </div>
              {selectedLevel === 1 && (
                <span className="text-2xl font-bold" style={{ color: color.main }}>{week.letter}</span>
              )}
            </div>

            {/* Focus */}
            <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-50 leading-relaxed">
              {getLevelFocus(week)}
            </div>

            {/* Sessions - only show days teacher is assigned to */}
            <div className="p-3 space-y-2">
              {week.sessions.filter(s => canSeeSession(selectedLevel, s.session)).map((session) => (
                <Link
                  key={session.session}
                  to={`/scenario/${selectedLevel}/${week.weekNumber}/${session.session}`}
                  className="block px-4 py-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      {session.session === 1 ? 'الثلاثاء' : 'الخميس'} - الفقرة {toArabicNumerals(session.session)}
                    </span>
                    <span className="text-gray-300 group-hover:text-primary">←</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
