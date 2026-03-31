import { useState } from 'react';
import { motion } from 'framer-motion';
import materials from '../data/materials.json';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function MaterialsPage() {
  const [filterLevel, setFilterLevel] = useState(0);
  const [checklist, setChecklist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('materialsChecklist') || '{}');
    } catch { return {}; }
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
        <h1 className="text-2xl font-bold text-primary mb-2">الأدوات والمواد</h1>
        <p className="text-text-muted text-sm">قائمة شاملة بالمواد المطلوبة لتنفيذ الأنشطة</p>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 no-print">
        <button
          onClick={() => setFilterLevel(0)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filterLevel === 0 ? 'bg-primary text-white' : 'bg-surface border border-border text-text-light'}`}
        >
          جميع المستويات
        </button>
        {[1, 2, 3].map((l) => (
          <button
            key={l}
            onClick={() => setFilterLevel(l)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: filterLevel === l ? levelColors[l] : levelColors[l] + '15',
              color: filterLevel === l ? 'white' : levelColors[l],
            }}
          >
            م{l === 1 ? '١' : l === 2 ? '٢' : '٣'}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {materials.categories.map((cat, catIdx) => {
          const filteredItems = filterLevel === 0
            ? cat.items
            : cat.items.filter((item) => item.levels.includes(filterLevel));

          if (filteredItems.length === 0) return null;

          return (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="bg-surface rounded-2xl p-5 border border-border"
            >
              <h2 className="font-bold text-text text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                {cat.name}
              </h2>
              <div className="space-y-2">
                {filteredItems.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  return (
                    <label
                      key={itemIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        checklist[key] ? 'bg-level1-light' : 'hover:bg-surface-hover'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checklist[key]}
                        onChange={() => toggleCheck(catIdx, itemIdx)}
                        className="w-5 h-5 rounded accent-primary"
                      />
                      <div className="flex-1">
                        <span className={`text-sm ${checklist[key] ? 'line-through text-text-muted' : 'text-text'}`}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted">{item.quantity}</span>
                      <div className="flex gap-1">
                        {item.levels.map((l) => (
                          <span
                            key={l}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                            style={{ backgroundColor: levelColors[l] }}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
