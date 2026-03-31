import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import levels from '../data/levels.json';
import { toArabicNumerals } from '../utils/arabicNumbers';

const navCards = [
  { path: '/objectives/general', title: 'الأهداف العامة', desc: 'أهداف المنهج لكل مستوى', icon: '🎯', color: '#2D6A4F' },
  { path: '/objectives/detailed', title: 'الأهداف التفصيلية', desc: 'أهداف قابلة للقياس', icon: '📋', color: '#40916C' },
  { path: '/calendar', title: 'الخطة الزمنية', desc: '١٢ أسبوع - حرف كل أسبوع', icon: '📅', color: '#D4A574' },
  { path: '/scenario/1/1/1', title: 'سيناريو اليوم', desc: 'دليل الفقرة خطوة بخطوة', icon: '📖', color: '#7EC8E3' },
  { path: '/activities', title: 'مكتبة الأنشطة', desc: 'أنشطة وألعاب تعليمية', icon: '🎮', color: '#FF9800' },
  { path: '/assessment', title: 'التقييم', desc: 'أدوات ومعايير التقييم', icon: '📊', color: '#9C27B0' },
  { path: '/materials', title: 'الأدوات والمواد', desc: 'قائمة المواد المطلوبة', icon: '🎒', color: '#E91E63' },
  { path: '/tips', title: 'نصائح وأسئلة شائعة', desc: 'إرشادات للمعلمات', icon: '💡', color: '#00BCD4' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } },
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8 md:py-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
        <div className="relative z-10">
          <p className="text-primary/60 text-sm mb-4 font-medium">بسم الله الرحمن الرحيم</p>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            أ
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">مدرسة الأرض</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-secondary mb-4">حقيبة معلمة اللغة العربية</h2>
          <p className="text-text-light max-w-xl mx-auto leading-relaxed">
            دليل شامل ومتكامل لتعليم اللغة العربية الفصحى للأطفال من عمر ٣ إلى ٦ سنوات
            عبر ثلاثة مستويات تصاعدية خلال ١٢ أسبوعًا
          </p>
        </div>
      </motion.section>

      {/* Quick Navigation Grid */}
      <motion.section variants={container} initial="hidden" animate="show">
        <h3 className="text-lg font-bold text-text mb-4">استكشفي الدليل</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {navCards.map((card) => (
            <motion.div key={card.path} variants={item}>
              <Link
                to={card.path}
                className="block p-4 md:p-5 rounded-2xl bg-surface hover:bg-surface-hover border border-border hover:border-transparent transition-all duration-300 group hover:shadow-lg"
                style={{ '--card-color': card.color }}
              >
                <span className="text-3xl md:text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </span>
                <h4 className="font-bold text-sm md:text-base text-text mb-1">{card.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Level Overview Cards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-text mb-4">المستويات التعليمية</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="rounded-2xl p-5 border-2 transition-shadow hover:shadow-lg"
              style={{
                backgroundColor: level.colorLight,
                borderColor: level.color + '40',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{level.icon}</span>
                <div>
                  <h4 className="font-bold text-base" style={{ color: level.color }}>{level.name}</h4>
                  <p className="text-xs text-text-muted">{level.ageRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3 text-sm text-text-light">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: level.color + '20', color: level.color }}>
                  {toArabicNumerals(level.childrenCount)} طفل
                </span>
                <span className="text-text-muted">{level.composition}</span>
              </div>
              <p className="text-sm text-text-light leading-relaxed mb-3">{level.description}</p>
              <ul className="space-y-1.5">
                {level.focusAreas.slice(0, 3).map((area, j) => (
                  <li key={j} className="text-xs text-text-light flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: level.color }} />
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Schedule Info */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-primary/5 rounded-2xl p-5 border border-primary/10"
      >
        <h3 className="text-lg font-bold text-primary mb-3">📅 مواعيد الفقرات</h3>
        <div className="flex flex-wrap gap-4 text-sm text-text-light">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>الأيام: <strong className="text-text">الثلاثاء والخميس</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span>المدة: <strong className="text-text">٤٥ دقيقة لكل فقرة</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span>البداية: <strong className="text-text">الثلاثاء ١ أبريل ٢٠٢٦</strong></span>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: 'أسبوع', value: '١٢', icon: '📅' },
          { label: 'فقرة', value: '٢٤', icon: '📖' },
          { label: 'نشاط', value: '٣٠', icon: '🎮' },
          { label: 'حرف', value: '١٣', icon: '✍️' },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center p-4 rounded-xl bg-surface border border-border"
          >
            <span className="text-2xl block mb-1">{stat.icon}</span>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.section>
    </div>
  );
}
