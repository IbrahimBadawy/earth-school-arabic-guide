import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import calendar from '../data/unit-calendar.json';
import { useAppContext } from '../context/AppContext';
import { toArabicNumerals } from '../utils/arabicNumbers';

const levelFocus = {
  1: (w) => `حرف ${w.letter} - ${w.letterName}`,
  2: (w) => {
    const focuses = [
      'مراجعة وتأسيس - تحليل أصوات بسيطة',
      'دمج صوتين - بداية الحركات',
      'الحركات الثلاث - فتحة وضمة وكسرة',
      'مواضع الحرف - أول ووسط وآخر',
      'قراءة مقاطع ثنائية - كتابة حروف',
      'دمج ثلاثة أصوات - كلمات بسيطة',
      'قراءة كلمات ثنائية وثلاثية',
      'كتابة كلمات بحروف منفصلة',
      'قراءة جمل قصيرة بالحركات',
      'تعزيز القراءة والكتابة',
      'مراجعة شاملة وتقييم',
      'مراجعة نهائية واحتفال',
    ];
    return focuses[w.weekNumber - 1] || '';
  },
  3: (w) => {
    const focuses = [
      'حروف متشابهة - تمييز المخارج',
      'الصوت الطويل والقصير',
      'التاء المربوطة والهمزة',
      'الكتابة المتصلة - كلمات كاملة',
      'ترتيب كلمات لتكوين جمل',
      'المرادفات والأضداد',
      'الجذر المشترك - عائلة الكلمة',
      'قراءة فقرات قصيرة',
      'كتابة جمل وصفية',
      'قراءة مستقلة وطلاقة',
      'تأليف قصة قصيرة',
      'مراجعة شاملة واحتفال ختامي',
    ];
    return focuses[w.weekNumber - 1] || '';
  },
};

export default function CalendarPage() {
  const { selectedLevel, setSelectedLevel, currentWeek, setCurrentWeek, levelColors } = useAppContext();
  const color = levelColors[selectedLevel];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الخطة الزمنية</h1>
        <p className="text-base text-gray-500 mt-1">
          ١٢ أسبوع × فقرتين (الثلاثاء والخميس) = ٢٤ فقرة | ٤٥ دقيقة لكل فقرة
        </p>
      </div>

      {/* Level Selector */}
      <div className="flex gap-2">
        {[1, 2, 3].map((l) => (
          <button
            key={l}
            onClick={() => setSelectedLevel(l)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
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
      <div className="bg-white rounded-xl border border-border p-4 text-sm text-gray-600">
        {selectedLevel === 1 && 'المستوى الأول: حرف جديد كل أسبوع مع مراجعة الحروف السابقة. المحاور: الوعي الصوتي والبصري وما قبل الكتابة.'}
        {selectedLevel === 2 && 'المستوى الثاني: التركيز على تحليل الأصوات ودمجها والحركات ومواضع الحروف والبدء بالقراءة والكتابة.'}
        {selectedLevel === 3 && 'المستوى الثالث: القراءة المستقلة والكتابة المتصلة وتكوين الجمل والمهارات اللغوية المتقدمة.'}
      </div>

      {/* Weeks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {calendar.weeks.map((week, i) => (
          <motion.div
            key={week.weekNumber}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-xl border bg-white overflow-hidden transition-all hover:shadow-sm ${
              currentWeek === week.weekNumber ? 'ring-2 ring-offset-1' : ''
            }`}
            style={{ ringColor: color.main }}
            onClick={() => setCurrentWeek(week.weekNumber)}
          >
            {/* Week Header */}
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: color.light }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color.main }}>
                  {toArabicNumerals(week.weekNumber)}
                </span>
                <span className="text-sm font-semibold text-gray-800">الأسبوع {toArabicNumerals(week.weekNumber)}</span>
              </div>
              {selectedLevel === 1 && (
                <span className="text-2xl font-bold" style={{ color: color.main }}>{week.letter}</span>
              )}
            </div>

            {/* Focus */}
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-50">
              {levelFocus[selectedLevel](week)}
            </div>

            {/* Sessions */}
            <div className="p-2 space-y-1.5">
              {week.sessions.map((session) => (
                <Link
                  key={session.session}
                  to={`/scenario/${selectedLevel}/${week.weekNumber}/${session.session}`}
                  className="block px-3 py-2 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs group"
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
