import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/tips-faq.json';

const categories = [...new Set(data.tips.map((t) => t.category))];

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredTips = activeCategory === 'الكل' ? data.tips : data.tips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">نصائح وأسئلة شائعة</h1>
        <p className="text-base text-gray-500 mt-1">إرشادات عملية للمعلمات</p>
      </div>

      {/* Tips */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">💡 نصائح</h2>
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-print">
          <button onClick={() => setActiveCategory('الكل')} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${activeCategory === 'الكل' ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الكل</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTips.map((tip, i) => (
            <motion.div key={tip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.2) }} className="bg-white rounded-2xl border border-border p-6">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{tip.category}</span>
              <h3 className="font-semibold text-base text-gray-800 mt-2 mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-500 leading-loose">{tip.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">❓ أسئلة شائعة</h2>
        <div className="space-y-2">
          {data.faq.map((item, i) => (
            <div key={item.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-4 py-3 flex items-center gap-2 text-right hover:bg-gray-50">
                <span className="text-primary font-bold text-sm">س</span>
                <span className="flex-1 text-sm font-medium text-gray-700">{item.question}</span>
                <span className={`text-gray-300 text-xs transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="px-4 pb-4 pr-8">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 leading-loose">{item.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
