import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import activities from '../data/activities.json';
import { arabicSearch } from '../utils/searchUtils';
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

export default function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState('الكل');
  const [filterLevel, setFilterLevel] = useState(0);

  const filtered = activities.filter((act) => {
    if (search && !arabicSearch(search, act.name) && !arabicSearch(search, act.description)) return false;
    if (filterSkill !== 'الكل' && act.targetSkill !== filterSkill) return false;
    if (filterLevel !== 0 && !act.targetLevels.includes(filterLevel)) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">مكتبة الأنشطة</h1>
        <p className="text-base text-gray-500 mt-1">{toArabicNumerals(activities.length)} نشاط وألعاب تعليمية متنوعة</p>
      </div>

      <div className="space-y-4 no-print">
        <input type="text" placeholder="ابحثي عن نشاط..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400" />

        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterSkill('الكل')} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${filterSkill === 'الكل' ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الكل</button>
          {Object.entries(skillLabels).map(([key, { label, color }]) => (
            <button key={key} onClick={() => setFilterSkill(key)} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: filterSkill === key ? color : 'white', color: filterSkill === key ? 'white' : color, border: `1px solid ${filterSkill === key ? color : '#e5e5e5'}` }}>{label}</button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button onClick={() => setFilterLevel(0)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>كل المستويات</button>
          {[1, 2, 3].map((l) => (
            <button key={l} onClick={() => setFilterLevel(l)} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: filterLevel === l ? levelColors[l] : 'white', color: filterLevel === l ? 'white' : levelColors[l], border: `1px solid ${filterLevel === l ? levelColors[l] : '#e5e5e5'}` }}>م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{toArabicNumerals(filtered.length)} نتيجة</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((act, i) => {
          const skill = skillLabels[act.targetSkill] || { label: act.targetSkill, color: '#888' };
          return (
            <motion.div key={act.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
              <Link to={`/activities/${act.id}`} className="block bg-white rounded-2xl border border-border p-6 hover:shadow-sm hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base text-gray-800 group-hover:text-primary">{act.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: skill.color + '15', color: skill.color }}>{skill.label}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{act.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-gray-400">
                  <span>⏱ {toArabicNumerals(act.duration)} د</span>
                  <span>👥 {act.groupSize}</span>
                  <div className="flex gap-0.5 mr-auto">
                    {act.targetLevels.map((l) => (
                      <span key={l} className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: levelColors[l] }}>{l}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
