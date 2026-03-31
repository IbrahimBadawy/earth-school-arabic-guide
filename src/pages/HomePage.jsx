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

const levelBorder = { 1: 'border-green-200', 2: 'border-blue-200', 3: 'border-orange-200' };
const levelBg = { 1: 'bg-green-50', 2: 'bg-blue-50', 3: 'bg-orange-50' };
const levelText = { 1: 'text-green-700', 2: 'text-blue-700', 3: 'text-orange-700' };
const levelDot = { 1: 'bg-green-500', 2: 'bg-blue-500', 3: 'bg-orange-500' };

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10"
      >
        <p className="text-base text-gray-400 mb-5">بسم الله الرحمن الرحيم</p>

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          أ
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">مدرسة الأرض</h1>
        <h2 className="text-xl text-primary font-semibold mb-5">حقيبة معلمة اللغة العربية</h2>

        <p className="text-base text-gray-500 max-w-lg mx-auto leading-loose">
          دليل شامل لتعليم اللغة العربية الفصحى للأطفال من ٣ إلى ٦ سنوات
          عبر ثلاثة مستويات مستقلة خلال ١٢ أسبوعًا
        </p>
      </motion.section>

      {/* Schedule Info */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-base text-gray-600 justify-center">
          <span>📅 الأيام: <strong className="text-gray-900">الثلاثاء والخميس</strong></span>
          <span>⏱️ المدة: <strong className="text-gray-900">٤٥ دقيقة / فقرة</strong></span>
          <span>📆 البداية: <strong className="text-gray-900">١ أبريل ٢٠٢٦</strong></span>
        </div>
      </div>

      {/* Three Levels */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-2">المستويات التعليمية</h3>
        <p className="text-base text-gray-500 mb-6">كل مستوى مستقل بمعلمته الخاصة ومحاوره المختلفة</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border-2 p-6 ${levelBorder[level.id]} ${levelBg[level.id]}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{level.icon}</span>
                <div>
                  <h4 className={`font-bold text-lg ${levelText[level.id]}`}>{level.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{level.ageRange}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1">{level.composition}</p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{level.description}</p>

              <ul className="space-y-2.5">
                {level.focusAreas.slice(0, 3).map((area, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-start gap-2.5">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${levelDot[level.id]}`} />
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Navigation Grid */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-6">محتويات الدليل</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navCards.map((card, i) => (
            <motion.div
              key={card.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Link
                to={card.path}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl mt-1">{card.icon}</span>
                <div>
                  <h4 className="font-bold text-base text-gray-800 group-hover:text-primary transition-colors mb-1">{card.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
