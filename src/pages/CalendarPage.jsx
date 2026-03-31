import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import calendar from '../data/unit-calendar.json';
import { useAppContext } from '../context/AppContext';
import { toArabicNumerals } from '../utils/arabicNumbers';

export default function CalendarPage() {
  const { selectedLevel, currentWeek, setCurrentWeek, levelColors } = useAppContext();
  const color = levelColors[selectedLevel];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">الخطة الزمنية</h1>
        <p className="text-text-muted text-sm">
          {toArabicNumerals(12)} أسبوع × فقرتين أسبوعيًّا = {toArabicNumerals(24)} فقرة | مدة الفقرة: {toArabicNumerals(45)} دقيقة
        </p>
        <p className="text-text-muted text-sm mt-1">
          📅 الأيام: <strong className="text-primary">الثلاثاء والخميس</strong> | البداية: <strong className="text-primary">١ أبريل ٢٠٢٦</strong>
        </p>
      </div>

      {/* Weeks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calendar.weeks.map((week, i) => (
          <motion.div
            key={week.weekNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${
              currentWeek === week.weekNumber ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{
              borderColor: currentWeek === week.weekNumber ? color.main : '#E8DCC8',
              ringColor: color.main,
            }}
            onClick={() => setCurrentWeek(week.weekNumber)}
          >
            {/* Week Header */}
            <div
              className="p-3 flex items-center justify-between"
              style={{ backgroundColor: color.light }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: color.main }}
                >
                  {toArabicNumerals(week.weekNumber)}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">الأسبوع {toArabicNumerals(week.weekNumber)}</h3>
                  <p className="text-xs text-text-muted">{week.letterName}</p>
                </div>
              </div>
              <div
                className="text-4xl font-bold leading-none"
                style={{ color: color.main }}
              >
                {week.letter}
              </div>
            </div>

            {/* Theme */}
            <div className="px-3 py-2 text-xs text-text-light bg-surface">
              {week.theme}
            </div>

            {/* Sessions */}
            <div className="p-3 bg-white space-y-2">
              {week.sessions.map((session) => (
                <Link
                  key={session.session}
                  to={`/scenario/${selectedLevel}/${week.weekNumber}/${session.session}`}
                  className="block p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: color.main + 'CC' }}
                      >
                        {toArabicNumerals(session.session)}
                      </span>
                      <span className="text-sm font-medium text-text">الفقرة {toArabicNumerals(session.session)}</span>
                    </div>
                    <span className="text-text-muted text-xs group-hover:text-primary transition-colors">
                      ←
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 mr-8">{session.focus}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
