import { useParams, Link } from 'react-router-dom';
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
        <p className="text-gray-400">النشاط غير موجود</p>
        <Link to="/activities" className="text-primary text-sm mt-2 inline-block">← العودة</Link>
      </div>
    );
  }

  const skill = skillLabels[activity.targetSkill] || { label: activity.targetSkill, color: '#888' };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <Link to="/activities" className="text-sm text-primary hover:underline no-print">← مكتبة الأنشطة</Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{activity.name}</h1>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: skill.color + '15', color: skill.color }}>{skill.label}</span>
          {activity.targetLevels.map((l) => (
            <span key={l} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: levelColors[l] + '15', color: levelColors[l] }}>{levelNames[l]}</span>
          ))}
          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">⏱ {toArabicNumerals(activity.duration)} دقيقة</span>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">👥 {activity.groupSize}</span>
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{activity.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <h2 className="font-bold text-sm text-gray-800 mb-3">📝 خطوات التنفيذ</h2>
        <ol className="space-y-2">
          {activity.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center text-[10px] font-bold mt-0.5">{toArabicNumerals(i + 1)}</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <h2 className="font-bold text-sm text-gray-800 mb-2">🎒 الأدوات</h2>
        <div className="flex flex-wrap gap-1.5">
          {activity.materials.map((mat, i) => <span key={i} className="px-2 py-1 rounded-md text-xs bg-amber-50 text-amber-700 border border-amber-100">{mat}</span>)}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <h2 className="font-bold text-sm text-gray-800 mb-2">🔄 تنويعات</h2>
        <ul className="space-y-1.5">
          {activity.variations.map((v, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5"><span className="text-primary">◆</span>{v}</li>)}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <h3 className="font-bold text-sm text-green-700 mb-1">🌱 تبسيط</h3>
          <p className="text-xs text-green-600 leading-relaxed">{activity.differentiationTips.easier}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
          <h3 className="font-bold text-sm text-orange-700 mb-1">🌟 تحدي</h3>
          <p className="text-xs text-orange-600 leading-relaxed">{activity.differentiationTips.harder}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {activity.tags.map((tag, i) => <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">#{tag}</span>)}
      </div>
    </div>
  );
}
