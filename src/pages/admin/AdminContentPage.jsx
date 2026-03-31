import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScenarioEditor from './editors/ScenarioEditor';
import ActivityEditor from './editors/ActivityEditor';
import ObjectiveEditor from './editors/ObjectiveEditor';
import TipsEditor from './editors/TipsEditor';

const sections = [
  { key: 'scenarios', label: 'السيناريوهات', icon: '📖', desc: 'تعديل سيناريوهات الفقرات اليومية' },
  { key: 'activities', label: 'الأنشطة', icon: '🎮', desc: 'إضافة وتعديل الأنشطة التعليمية' },
  { key: 'objectives', label: 'الأهداف', icon: '🎯', desc: 'تعديل الأهداف التفصيلية' },
  { key: 'tips', label: 'النصائح', icon: '💡', desc: 'تعديل النصائح والأسئلة الشائعة' },
];

const editors = {
  scenarios: ScenarioEditor,
  activities: ActivityEditor,
  objectives: ObjectiveEditor,
  tips: TipsEditor,
};

export default function AdminContentPage() {
  const { section } = useParams();

  if (!section) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل المحتوى</h1>
          <p className="text-base text-gray-500">اختر القسم الذي تريد تعديله</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sections.map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/admin/content/${s.key}`} className="block bg-white rounded-2xl border border-border p-6 hover:shadow-sm hover:border-primary/20 transition-all group">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <h3 className="font-bold text-base text-gray-800 group-hover:text-primary mb-1">{s.label}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const Editor = editors[section];
  if (!Editor) return <p className="text-gray-500">القسم غير موجود</p>;

  return <Editor />;
}
