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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">مكتبة الأنشطة</h1>
        <p className="text-text-muted text-sm">أنشطة وألعاب تعليمية متنوعة لتحقيق أهداف المنهج</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 no-print">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحثي عن نشاط..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 items-center">
            <span className="text-xs text-text-muted ml-1">المهارة:</span>
            <button
              onClick={() => setFilterSkill('الكل')}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${filterSkill === 'الكل' ? 'bg-primary text-white' : 'bg-surface border border-border text-text-light'}`}
            >
              الكل
            </button>
            {Object.entries(skillLabels).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setFilterSkill(key)}
                className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: filterSkill === key ? color : color + '15',
                  color: filterSkill === key ? 'white' : color,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-text-muted ml-1">المستوى:</span>
            <button
              onClick={() => setFilterLevel(0)}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-surface border border-border text-text-light'}`}
            >
              الكل
            </button>
            {[1, 2, 3].map((l) => (
              <button
                key={l}
                onClick={() => setFilterLevel(l)}
                className="px-2 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: filterLevel === l ? levelColors[l] : levelColors[l] + '15',
                  color: filterLevel === l ? 'white' : levelColors[l],
                }}
              >
                م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted">{toArabicNumerals(filtered.length)} نشاط</p>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((act, i) => {
          const skill = skillLabels[act.targetSkill] || { label: act.targetSkill, color: '#888' };
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <Link
                to={`/activities/${act.id}`}
                className="block bg-surface rounded-2xl p-5 border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-text group-hover:text-primary transition-colors">{act.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: skill.color + '15', color: skill.color }}>
                    {skill.label}
                  </span>
                </div>
                <p className="text-sm text-text-light mb-3 line-clamp-2">{act.description}</p>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>⏱️ {toArabicNumerals(act.duration)} دقيقة</span>
                  <span>👥 {act.groupSize}</span>
                  <div className="flex gap-1 mr-auto">
                    {act.targetLevels.map((l) => (
                      <span
                        key={l}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: levelColors[l] }}
                      >
                        {l}
                      </span>
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
