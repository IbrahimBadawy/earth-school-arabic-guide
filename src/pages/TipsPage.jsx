import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/tips-faq.json';

const categories = [...new Set(data.tips.map((t) => t.category))];
const categoryIcons = {
  'إدارة الفصل': '🏫',
  'التمايز': '🎯',
  'القصة': '📚',
  'المحتوى الإسلامي': '🕌',
  'التقييم': '📊',
  'التحفيز': '⭐',
  'الأطفال الجدد': '👋',
  'التواصل مع أولياء الأمور': '👨‍👩‍👧',
  'إدارة الوقت': '⏰',
};

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredTips = activeCategory === 'الكل'
    ? data.tips
    : data.tips.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">نصائح وأسئلة شائعة</h1>
        <p className="text-text-muted text-sm">إرشادات عملية وإجابات لأكثر الأسئلة شيوعًا</p>
      </div>

      {/* Tips Section */}
      <section>
        <h2 className="text-lg font-bold text-text mb-4">💡 نصائح للمعلمات</h2>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-print">
          <button
            onClick={() => setActiveCategory('الكل')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'الكل' ? 'bg-primary text-white' : 'bg-surface border border-border text-text-light'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-primary text-white' : 'bg-surface border border-border text-text-light'
              }`}
            >
              {categoryIcons[cat] || '📌'} {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="bg-surface rounded-2xl p-5 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{categoryIcons[tip.category] || '📌'}</span>
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tip.category}</span>
                  <h3 className="font-bold text-text mt-2 mb-2">{tip.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-lg font-bold text-text mb-4">❓ أسئلة شائعة</h2>

        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="bg-surface rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-right hover:bg-surface-hover transition-colors"
              >
                <span className="text-primary font-bold">س</span>
                <span className="flex-1 font-medium text-text text-sm">{item.question}</span>
                <span className={`text-text-muted transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pr-10">
                      <div className="bg-accent/10 rounded-xl p-3">
                        <p className="text-sm text-text-light leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
