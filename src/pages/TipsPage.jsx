import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/tips-faq.json';

const categories = [...new Set(data.tips.map((t) => t.category))];

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredTips = activeCategory === 'الكل' ? data.tips : data.tips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">نصائح وأسئلة شائعة</h1>
        <p className="text-base text-gray-500">إرشادات عملية للمعلمات</p>
      </div>

      {/* Tips */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">💡 نصائح</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 no-print">
          <button onClick={() => setActiveCategory('الكل')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeCategory === 'الكل' ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الكل</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredTips.map((tip, i) => (
            <motion.div key={tip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 0.2) }} className="bg-white rounded-2xl border border-border p-6">
              <span className="text-xs px-3 py-1.5 rounded bg-gray-100 text-gray-500 font-medium">{tip.category}</span>
              <h3 className="font-semibold text-base text-gray-800 mt-3 mb-2">{tip.title}</h3>
              <p className="text-base text-gray-500 leading-loose">{tip.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4">❓ أسئلة شائعة</h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={item.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center gap-3 text-right hover:bg-gray-50">
                <span className="text-primary font-bold text-base">س</span>
                <span className="flex-1 text-base font-medium text-gray-700">{item.question}</span>
                <span className={`text-gray-300 text-sm transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="px-6 pb-5 pr-12">
                      <div className="bg-blue-50 rounded-xl p-5">
                        <p className="text-base text-gray-600 leading-loose">{item.answer}</p>
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
