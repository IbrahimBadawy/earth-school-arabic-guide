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
        <h1 className="text-xl font-bold text-gray-900">الأهداف التفصيلية</h1>
        <p className="text-sm text-gray-500 mt-1">أهداف قابلة للقياس مع معايير التقييم</p>
      </div>

      <div className="flex flex-wrap gap-3 no-print">
        <div className="flex gap-1.5 items-center">
          <span className="text-xs text-gray-500">المستوى:</span>
          <button onClick={() => setFilterLevel(0)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الكل</button>
          {[1, 2, 3].map((l) => (
            <button key={l} onClick={() => setFilterLevel(l)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: filterLevel === l ? levelColors[l] : 'white', color: filterLevel === l ? 'white' : levelColors[l], border: filterLevel === l ? 'none' : '1px solid #e5e5e5' }}>
              م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 items-center">
          <span className="text-xs text-gray-500">المحور:</span>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs border border-border bg-white text-gray-700">
            <option value="الكل">الكل</option>
            {domains.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400">{toArabicNumerals(filtered.length)} هدف</p>

      <div className="space-y-3">
        {filtered.map((obj, i) => (
          <motion.div key={obj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.4) }} className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 px-2 py-1 rounded-md text-xs font-bold text-white" style={{ backgroundColor: levelColors[obj.level] }}>م{obj.level === 1 ? '١' : obj.level === 2 ? '٢' : '٣'}</span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{obj.domain}</span>
                  <span className="text-xs text-gray-400">{obj.id}</span>
                  {obj.weekIntroduced && <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">أسبوع {toArabicNumerals(obj.weekIntroduced)}</span>}
                </div>
                <p className="text-sm text-gray-800">{obj.objective}</p>
                {obj.measurable && (
                  <div className="bg-green-50 rounded-lg p-2.5 text-xs text-gray-600">
                    <strong className="text-green-700">معيار القياس:</strong> {obj.measurable}
                  </div>
                )}
                {obj.assessmentMethod && (
                  <p className="text-xs text-gray-400"><strong>طريقة التقييم:</strong> {obj.assessmentMethod}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
