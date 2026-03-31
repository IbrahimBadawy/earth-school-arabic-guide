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
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">الأهداف التفصيلية</h1>
        <p className="text-base text-gray-500">أهداف قابلة للقياس مع معايير التقييم</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5 no-print">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">المستوى:</span>
          <button onClick={() => setFilterLevel(0)} className={`px-5 py-2.5 rounded-lg text-sm font-medium ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-gray-50 border border-border text-gray-600'}`}>الكل</button>
          {[1, 2, 3].map((l) => (
            <button key={l} onClick={() => setFilterLevel(l)} className="px-5 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: filterLevel === l ? levelColors[l] : '#f9fafb', color: filterLevel === l ? 'white' : levelColors[l], border: `1px solid ${filterLevel === l ? levelColors[l] : '#e5e5e5'}` }}>
              م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">المحور:</span>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="px-5 py-2.5 rounded-lg text-sm border border-border bg-gray-50 text-gray-700">
            <option value="الكل">الكل</option>
            {domains.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-400">{toArabicNumerals(filtered.length)} هدف</p>

      <div className="space-y-5">
        {filtered.map((obj, i) => (
          <motion.div key={obj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.4) }} className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: levelColors[obj.level] }}>م{obj.level === 1 ? '١' : obj.level === 2 ? '٢' : '٣'}</span>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium">{obj.domain}</span>
                  <span className="text-xs text-gray-400">{obj.id}</span>
                  {obj.weekIntroduced && <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">أسبوع {toArabicNumerals(obj.weekIntroduced)}</span>}
                </div>
                <p className="text-base text-gray-800 leading-relaxed">{obj.objective}</p>
                {obj.measurable && (
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <p className="text-base text-gray-700 leading-relaxed"><strong className="text-green-700">📏 معيار القياس:</strong> {obj.measurable}</p>
                  </div>
                )}
                {obj.assessmentMethod && (
                  <p className="text-base text-gray-500 leading-relaxed"><strong className="text-gray-600">🔍 طريقة التقييم:</strong> {obj.assessmentMethod}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
