import { useState } from 'react';
import { motion } from 'framer-motion';
import detailedObjectives from '../data/detailed-objectives.json';
import { useAppContext } from '../context/AppContext';
import { toArabicNumerals } from '../utils/arabicNumbers';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };
const domains = [...new Set(detailedObjectives.map((o) => o.domain))];

export default function DetailedObjectivesPage() {
  const { selectedLevel } = useAppContext();
  const [filterLevel, setFilterLevel] = useState(selectedLevel);
  const [filterDomain, setFilterDomain] = useState('الكل');

  const filtered = detailedObjectives.filter((o) => {
    if (filterLevel !== 0 && o.level !== filterLevel) return false;
    if (filterDomain !== 'الكل' && o.domain !== filterDomain) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">الأهداف التفصيلية</h1>
        <p className="text-text-muted text-sm">أهداف محددة وقابلة للقياس مع معايير التقييم</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 no-print">
        <div className="flex gap-1 items-center">
          <span className="text-sm text-text-muted ml-2">المستوى:</span>
          <button
            onClick={() => setFilterLevel(0)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border hover:bg-surface-hover'}`}
          >
            الكل
          </button>
          {[1, 2, 3].map((l) => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: filterLevel === l ? levelColors[l] : levelColors[l] + '15',
                color: filterLevel === l ? 'white' : levelColors[l],
              }}
            >
              م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
            </button>
          ))}
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-sm text-text-muted ml-2">المحور:</span>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="الكل">الكل</option>
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-text-muted">عدد الأهداف: {toArabicNumerals(filtered.length)}</p>

      {/* Objectives */}
      <div className="space-y-3">
        {filtered.map((obj, i) => (
          <motion.div
            key={obj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.5) }}
            className="bg-surface rounded-2xl p-5 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 px-2 py-1 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: levelColors[obj.level] }}
              >
                م{obj.level === 1 ? '١' : obj.level === 2 ? '٢' : '٣'}
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
                    {obj.domain}
                  </span>
                  <span className="text-xs text-text-muted">{obj.id}</span>
                  {obj.weekIntroduced && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
                      الأسبوع {toArabicNumerals(obj.weekIntroduced)}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-text leading-relaxed">{obj.objective}</p>

                {obj.measurable && (
                  <div className="bg-level1-light/50 rounded-xl p-3">
                    <p className="text-xs text-text-light">
                      <span className="font-bold text-level1">📏 معيار القياس:</span> {obj.measurable}
                    </p>
                  </div>
                )}

                {obj.assessmentMethod && (
                  <p className="text-xs text-text-muted">
                    <span className="font-bold">🔍 طريقة التقييم:</span> {obj.assessmentMethod}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
