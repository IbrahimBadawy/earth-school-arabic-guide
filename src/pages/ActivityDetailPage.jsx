import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import activities from '../data/activities.json';
import { toArabicNumerals } from '../utils/arabicNumbers';

const skillLabels = {
  phonological: { label: 'وعي صوتي', color: '#FF9800' },
  visual: { label: 'وعي بصري', color: '#9C27B0' },
  'pre-writing': { label: 'ما قبل الكتابة', color: '#E91E63' },
  reading: { label: 'قراءة', color: '#2196F3' },
  writing: { label: 'كتابة', color: '#00BCD4' },
  language: { label: 'لغويات', color: '#4CAF50' },
  drama: { label: 'دراما', color: '#FF5722' },
};

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };
const levelNames = { 1: 'المستوى الأول', 2: 'المستوى الثاني', 3: 'المستوى الثالث' };

export default function ActivityDetailPage() {
  const { id } = useParams();
  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl">🔍</span>
        <h2 className="text-xl font-bold text-primary mt-4">النشاط غير موجود</h2>
        <Link to="/activities" className="text-primary hover:underline text-sm mt-2 inline-block">← العودة لمكتبة الأنشطة</Link>
      </div>
    );
  }

  const skill = skillLabels[activity.targetSkill] || { label: activity.targetSkill, color: '#888' };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/activities" className="text-sm text-primary hover:underline no-print">← العودة لمكتبة الأنشطة</Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <h1 className="text-2xl font-bold text-primary">{activity.name}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: skill.color + '15', color: skill.color }}>
            {skill.label}
          </span>
          {activity.targetLevels.map((l) => (
            <span key={l} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: levelColors[l] + '15', color: levelColors[l] }}>
              {levelNames[l]}
            </span>
          ))}
          <span className="px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary font-medium">
            ⏱️ {toArabicNumerals(activity.duration)} دقيقة
          </span>
          <span className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent font-medium">
            👥 {activity.groupSize}
          </span>
        </div>
        <p className="text-text-light leading-relaxed">{activity.description}</p>
      </motion.div>

      {/* Steps */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-surface rounded-2xl p-5 border border-border">
        <h2 className="font-bold text-text mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">📝</span>
          خطوات التنفيذ
        </h2>
        <ol className="space-y-3">
          {activity.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {toArabicNumerals(i + 1)}
              </span>
              <span className="text-sm text-text-light leading-relaxed pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Materials */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-surface rounded-2xl p-5 border border-border">
        <h2 className="font-bold text-text mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">🎒</span>
          الأدوات والمواد
        </h2>
        <div className="flex flex-wrap gap-2">
          {activity.materials.map((mat, i) => (
            <span key={i} className="px-3 py-1.5 rounded-xl text-sm bg-secondary/10 text-secondary font-medium border border-secondary/20">
              {mat}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Variations */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-surface rounded-2xl p-5 border border-border">
        <h2 className="font-bold text-text mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">🔄</span>
          تنويعات
        </h2>
        <ul className="space-y-2">
          {activity.variations.map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-light">
              <span className="text-accent mt-0.5">◆</span>
              <span className="leading-relaxed">{v}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Differentiation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-level1-light rounded-2xl p-5 border border-level1/20">
          <h3 className="font-bold text-level1 mb-2 flex items-center gap-2">🌱 تبسيط</h3>
          <p className="text-sm text-text-light leading-relaxed">{activity.differentiationTips.easier}</p>
        </div>
        <div className="bg-level3-light rounded-2xl p-5 border border-level3/20">
          <h3 className="font-bold text-level3 mb-2 flex items-center gap-2">🌟 تحدي إضافي</h3>
          <p className="text-sm text-text-light leading-relaxed">{activity.differentiationTips.harder}</p>
        </div>
      </motion.div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {activity.tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 rounded-lg text-xs bg-bg text-text-muted border border-border">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
