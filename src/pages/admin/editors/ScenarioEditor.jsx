import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { toArabicNumerals } from '../../../utils/arabicNumbers';
import scenariosLocal from '../../../data/daily-scenarios/index';

export default function ScenarioEditor() {
  const [level, setLevel] = useState(1);
  const [week, setWeek] = useState(1);
  const [session, setSession] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const key = `L${level}-W${week}-S${session}`;
  const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

  useEffect(() => { loadScenario(); }, [key]);

  async function loadScenario() {
    setLoading(true);
    setSaved(false);
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('scenarios').select('*').eq('id', key).single();
      setScenario(data || scenariosLocal[key] || null);
    } else {
      setScenario(scenariosLocal[key] || null);
    }
    setLoading(false);
  }

  function updateBlock(blockIdx, field, value) {
    const updated = { ...scenario };
    updated.blocks = [...updated.blocks];
    updated.blocks[blockIdx] = { ...updated.blocks[blockIdx], [field]: value };
    setScenario(updated);
    setSaved(false);
  }

  function updateBlockArrayItem(blockIdx, field, itemIdx, value) {
    const updated = { ...scenario };
    updated.blocks = [...updated.blocks];
    const arr = [...(updated.blocks[blockIdx][field] || [])];
    arr[itemIdx] = value;
    updated.blocks[blockIdx] = { ...updated.blocks[blockIdx], [field]: arr };
    setScenario(updated);
    setSaved(false);
  }

  function addBlockArrayItem(blockIdx, field) {
    const updated = { ...scenario };
    updated.blocks = [...updated.blocks];
    const arr = [...(updated.blocks[blockIdx][field] || []), ''];
    updated.blocks[blockIdx] = { ...updated.blocks[blockIdx], [field]: arr };
    setScenario(updated);
  }

  function removeBlockArrayItem(blockIdx, field, itemIdx) {
    const updated = { ...scenario };
    updated.blocks = [...updated.blocks];
    const arr = [...updated.blocks[blockIdx][field]];
    arr.splice(itemIdx, 1);
    updated.blocks[blockIdx] = { ...updated.blocks[blockIdx], [field]: arr };
    setScenario(updated);
  }

  async function handleSave() {
    if (!isSupabaseConfigured()) { alert('Supabase غير مفعل'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('scenarios').upsert({
        id: key, level, week, session,
        letter: scenario.letter,
        total_duration: scenario.totalDuration || 45,
        blocks: scenario.blocks,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSaved(true);
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل السيناريوهات</h1>
        <p className="text-base text-gray-500">اختر المستوى والأسبوع واليوم ثم عدّل المحتوى</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">المستوى:</span>
          {[1, 2, 3].map(l => (
            <button key={l} onClick={() => setLevel(l)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: l === level ? levelColors[l] : 'white', color: l === level ? 'white' : levelColors[l], border: `2px solid ${levelColors[l]}` }}>
              م{toArabicNumerals(l)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">الأسبوع:</span>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
            <button key={w} onClick={() => setWeek(w)} className="w-9 h-9 rounded-lg text-sm font-semibold" style={{ backgroundColor: w === week ? levelColors[level] : 'white', color: w === week ? 'white' : '#666', border: `1.5px solid ${w === week ? levelColors[level] : '#e5e5e5'}` }}>
              {toArabicNumerals(w)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-600">اليوم:</span>
          {[1, 2].map(s => (
            <button key={s} onClick={() => setSession(s)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: s === session ? levelColors[level] : 'white', color: s === session ? 'white' : levelColors[level], border: `2px solid ${levelColors[level]}` }}>
              {s === 1 ? 'الثلاثاء' : 'الخميس'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">جارٍ التحميل...</p>
      ) : !scenario ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-border">
          <p className="text-gray-500">لا يوجد سيناريو لهذا الاختيار</p>
        </div>
      ) : (
        <div className="space-y-5">
          {scenario.blocks?.map((block, blockIdx) => (
            <motion.div key={blockIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: levelColors[level] }}>{toArabicNumerals(blockIdx + 1)}</span>
                <input type="text" value={block.title} onChange={(e) => updateBlock(blockIdx, 'title', e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-border text-base font-bold" />
                <input type="number" value={block.duration} onChange={(e) => updateBlock(blockIdx, 'duration', parseInt(e.target.value) || 0)} className="w-20 px-3 py-2 rounded-lg border border-border text-sm text-center" />
                <span className="text-xs text-gray-400">دقيقة</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">الوصف:</label>
                <textarea value={block.description || ''} onChange={(e) => updateBlock(blockIdx, 'description', e.target.value)} rows={2} className="w-full px-4 py-3 rounded-lg border border-border text-sm resize-none" />
              </div>

              {/* Steps */}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">الخطوات:</label>
                {(block.steps || []).map((step, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white mt-1 flex-shrink-0" style={{ backgroundColor: levelColors[level] + 'CC' }}>{toArabicNumerals(i + 1)}</span>
                    <textarea value={step} onChange={(e) => updateBlockArrayItem(blockIdx, 'steps', i, e.target.value)} rows={1} className="flex-1 px-3 py-2 rounded-lg border border-border text-sm resize-none" />
                    <button onClick={() => removeBlockArrayItem(blockIdx, 'steps', i)} className="text-red-400 hover:text-red-600 text-sm mt-1">✕</button>
                  </div>
                ))}
                <button onClick={() => addBlockArrayItem(blockIdx, 'steps')} className="text-xs text-primary hover:underline">+ إضافة خطوة</button>
              </div>

              {/* Materials */}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">الأدوات:</label>
                {(block.materials || []).map((mat, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <input type="text" value={mat} onChange={(e) => updateBlockArrayItem(blockIdx, 'materials', i, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm" />
                    <button onClick={() => removeBlockArrayItem(blockIdx, 'materials', i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                  </div>
                ))}
                <button onClick={() => addBlockArrayItem(blockIdx, 'materials')} className="text-xs text-primary hover:underline">+ إضافة أداة</button>
              </div>

              {/* Tips */}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-2">نصائح:</label>
                {(block.tips || []).map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <textarea value={tip} onChange={(e) => updateBlockArrayItem(blockIdx, 'tips', i, e.target.value)} rows={1} className="flex-1 px-3 py-2 rounded-lg border border-border text-sm resize-none" />
                    <button onClick={() => removeBlockArrayItem(blockIdx, 'tips', i)} className="text-red-400 hover:text-red-600 text-sm mt-1">✕</button>
                  </div>
                ))}
                <button onClick={() => addBlockArrayItem(blockIdx, 'tips')} className="text-xs text-primary hover:underline">+ إضافة نصيحة</button>
              </div>
            </motion.div>
          ))}

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4">
            <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-primary text-white rounded-xl text-base font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
              {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
            </button>
            {saved && <span className="text-green-600 text-sm font-semibold">تم الحفظ بنجاح ✓</span>}
          </div>
        </div>
      )}
    </div>
  );
}
