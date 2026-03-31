import { useState } from 'react';
import { motion } from 'framer-motion';
import materials from '../data/materials.json';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function MaterialsPage() {
  const [filterLevel, setFilterLevel] = useState(0);
  const [checklist, setChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('materialsChecklist') || '{}'); } catch { return {}; }
  });

  const toggleCheck = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem('materialsChecklist', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الأدوات والمواد</h1>
        <p className="text-base text-gray-500 mt-1">قائمة المواد المطلوبة لتنفيذ الأنشطة</p>
      </div>

      <div className="flex gap-2 no-print">
        <button onClick={() => setFilterLevel(0)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الكل</button>
        {[1, 2, 3].map((l) => (
          <button key={l} onClick={() => setFilterLevel(l)} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: filterLevel === l ? levelColors[l] : 'white', color: filterLevel === l ? 'white' : levelColors[l], border: `1px solid ${filterLevel === l ? levelColors[l] : '#e5e5e5'}` }}>
            م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
          </button>
        ))}
      </div>

      {materials.categories.map((cat, catIdx) => {
        const filteredItems = filterLevel === 0 ? cat.items : cat.items.filter((item) => item.levels.includes(filterLevel));
        if (filteredItems.length === 0) return null;
        return (
          <motion.div key={catIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: catIdx * 0.05 }} className="bg-white rounded-xl border border-border p-4">
            <h2 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-lg">{cat.icon}</span>{cat.name}
            </h2>
            <div className="space-y-1">
              {filteredItems.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                return (
                  <label key={itemIdx} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${checklist[key] ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={!!checklist[key]} onChange={() => toggleCheck(catIdx, itemIdx)} className="w-4 h-4 rounded accent-primary" />
                    <span className={`flex-1 text-sm ${checklist[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.name}</span>
                    <span className="text-xs text-gray-400">{item.quantity}</span>
                    <div className="flex gap-0.5">
                      {item.levels.map((l) => <span key={l} className="w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: levelColors[l] }}>{l}</span>)}
                    </div>
                  </label>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
