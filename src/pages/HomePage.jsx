import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import levels from '../data/levels.json';

const navCards = [
  { path: '/objectives/general', title: 'الأهداف العامة', desc: 'أهداف المنهج لكل مستوى', icon: '🎯' },
  { path: '/objectives/detailed', title: 'الأهداف التفصيلية', desc: 'أهداف قابلة للقياس مع معايير التقييم', icon: '📋' },
  { path: '/calendar', title: 'الخطة الزمنية', desc: '١٢ أسبوع لكل مستوى', icon: '📅' },
  { path: '/scenario/1/1/1', title: 'سيناريو اليوم', desc: 'دليل الفقرة خطوة بخطوة بالدقيقة', icon: '📖' },
  { path: '/activities', title: 'مكتبة الأنشطة', desc: '٣٠ نشاطًا وألعابًا تعليمية متنوعة', icon: '🎮' },
  { path: '/assessment', title: 'التقييم', desc: 'معايير تحديد المستوى وسلالم التقدير', icon: '📊' },
  { path: '/materials', title: 'الأدوات والمواد', desc: 'قائمة تحضير المواد لكل مستوى', icon: '🎒' },
  { path: '/tips', title: 'نصائح للمعلمات', desc: 'إرشادات عملية وأسئلة شائعة', icon: '💡' },
];

const levelColorMap = { 1: 'border-level1/30 bg-level1-light', 2: 'border-level2/30 bg-level2-light', 3: 'border-level3/30 bg-level3-light' };
const levelTextMap = { 1: 'text-level1', 2: 'text-level2', 3: 'text-level3' };

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <p className="text-sm text-gray-400 mb-3">بسم الله الرحمن الرحيم</p>
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold">أ</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">مدرسة الأرض</h1>
        <h2 className="text-lg text-primary font-semibold mb-3">حقيبة معلمة اللغة العربية</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          دليل شامل لتعليم اللغة العربية الفصحى للأطفال من ٣ إلى ٦ سنوات
          عبر ثلاثة مستويات مستقلة خلال ١٢ أسبوعًا
        </p>
      </motion.section>

      {/* Schedule Info */}
      <div className="bg-white rounded-xl border border-border p-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
        <span>📅 الأيام: <strong className="text-gray-900">الثلاثاء والخميس</strong></span>
        <span>⏱️ المدة: <strong className="text-gray-900">٤٥ دقيقة/فقرة</strong></span>
        <span>📆 البداية: <strong className="text-gray-900">١ أبريل ٢٠٢٦</strong></span>
      </div>

      {/* Three Levels */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4">المستويات التعليمية</h3>
        <p className="text-xs text-gray-500 mb-4">كل مستوى مستقل بمعلمته الخاصة ومحاوره المختلفة</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border-2 p-4 ${levelColorMap[level.id]}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{level.icon}</span>
                <div>
                  <h4 className={`font-bold text-sm ${levelTextMap[level.id]}`}>{level.name}</h4>
                  <p className="text-xs text-gray-500">{level.ageRange} | {level.composition}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{level.description}</p>
              <ul className="space-y-1">
                {level.focusAreas.slice(0, 3).map((area, j) => (
                  <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${level.id === 1 ? 'bg-level1' : level.id === 2 ? 'bg-level2' : 'bg-level3'}`} />
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Navigation Grid */}
      <section>
        <h3 className="text-base font-bold text-gray-800 mb-4">محتويات الدليل</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {navCards.map((card, i) => (
            <motion.div
              key={card.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Link
                to={card.path}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl mt-0.5">{card.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">{card.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
