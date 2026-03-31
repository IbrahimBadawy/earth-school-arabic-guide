import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import localActivities from '../../../data/activities.json';
import { arabicSearch } from '../../../utils/searchUtils';

const skillOptions = [
  { value: 'phonological', label: 'وعي صوتي' },
  { value: 'visual', label: 'وعي بصري' },
  { value: 'pre-writing', label: 'ما قبل الكتابة' },
  { value: 'reading', label: 'قراءة' },
  { value: 'writing', label: 'كتابة' },
  { value: 'language', label: 'لغويات' },
  { value: 'drama', label: 'دراما' },
];

export default function ActivityEditor() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities() {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('activities').select('*').order('id');
      if (data?.length) {
        setActivities(data.map(a => ({
          id: a.id, name: a.name, targetSkill: a.target_skill, targetLevels: a.target_levels,
          duration: a.duration, groupSize: a.group_size, materials: a.materials,
          description: a.description, steps: a.steps, variations: a.variations,
          differentiationTips: { easier: a.differentiation_easier, harder: a.differentiation_harder },
          tags: a.tags,
        })));
        return;
      }
    }
    setActivities(localActivities);
  }

  const filtered = activities.filter(a => !search || arabicSearch(search, a.name) || arabicSearch(search, a.description));

  function openNew() {
    setEditing({
      id: `act-${String(activities.length + 1).padStart(2, '0')}`,
      name: '', targetSkill: 'phonological', targetLevels: [1],
      duration: 10, groupSize: 'المجموعة كاملة', materials: [''],
      description: '', steps: [''], variations: [''],
      differentiationTips: { easier: '', harder: '' }, tags: [''],
      _isNew: true,
    });
    setSaved(false);
  }

  function openEdit(act) {
    setEditing({ ...act, materials: [...(act.materials || [''])], steps: [...(act.steps || [''])], variations: [...(act.variations || [''])], tags: [...(act.tags || [''])] });
    setSaved(false);
  }

  function updateField(field, value) {
    setEditing(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function updateArrayItem(field, idx, value) {
    setEditing(prev => {
      const arr = [...(prev[field] || [])];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  }

  function addArrayItem(field) {
    setEditing(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  }

  function removeArrayItem(field, idx) {
    setEditing(prev => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  }

  function toggleLevel(level) {
    setEditing(prev => {
      const levels = prev.targetLevels.includes(level)
        ? prev.targetLevels.filter(l => l !== level)
        : [...prev.targetLevels, level].sort();
      return { ...prev, targetLevels: levels };
    });
  }

  async function handleSave() {
    if (!isSupabaseConfigured()) { alert('Supabase غير مفعل'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('activities').upsert({
        id: editing.id, name: editing.name, target_skill: editing.targetSkill,
        target_levels: editing.targetLevels, duration: editing.duration,
        group_size: editing.groupSize, materials: editing.materials.filter(Boolean),
        description: editing.description, steps: editing.steps.filter(Boolean),
        variations: editing.variations.filter(Boolean),
        differentiation_easier: editing.differentiationTips?.easier,
        differentiation_harder: editing.differentiationTips?.harder,
        tags: editing.tags.filter(Boolean),
      });
      if (error) throw error;
      setSaved(true);
      loadActivities();
    } catch (err) {
      alert('خطأ: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('حذف هذا النشاط؟')) return;
    await supabase.from('activities').delete().eq('id', id);
    loadActivities();
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل الأنشطة</h1>
          <p className="text-base text-gray-500">{activities.length} نشاط</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">+ إضافة نشاط</button>
      </div>

      <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-white text-base" />

      <div className="grid grid-cols-1 gap-3">
        {filtered.map(act => (
          <div key={act.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all ${editing?.id === act.id ? 'border-primary' : 'border-border'}`} onClick={() => openEdit(act)}>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">{act.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{act.description?.slice(0, 60)}...</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(act.id); }} className="text-red-400 hover:text-red-600 text-sm px-2">حذف</button>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border-2 border-primary/30 p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800">{editing._isNew ? 'إضافة نشاط جديد' : `تعديل: ${editing.name}`}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">اسم النشاط</label>
              <input value={editing.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">المهارة</label>
              <select value={editing.targetSkill} onChange={e => updateField('targetSkill', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm">
                {skillOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">المدة (دقيقة)</label>
              <input type="number" value={editing.duration} onChange={e => updateField('duration', parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">حجم المجموعة</label>
              <input value={editing.groupSize} onChange={e => updateField('groupSize', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">المستويات</label>
            <div className="flex gap-3">
              {[1, 2, 3].map(l => (
                <label key={l} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.targetLevels.includes(l)} onChange={() => toggleLevel(l)} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm">م{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">الوصف</label>
            <textarea value={editing.description} onChange={e => updateField('description', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-none" />
          </div>

          {/* Steps */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">الخطوات</label>
            {editing.steps.map((s, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <textarea value={s} onChange={e => updateArrayItem('steps', i, e.target.value)} rows={1} className="flex-1 px-3 py-2 rounded-lg border border-border text-sm resize-none" />
                <button onClick={() => removeArrayItem('steps', i)} className="text-red-400 text-sm">✕</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('steps')} className="text-xs text-primary hover:underline">+ خطوة</button>
          </div>

          {/* Differentiation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-green-600 mb-1 block">تبسيط</label>
              <textarea value={editing.differentiationTips?.easier || ''} onChange={e => updateField('differentiationTips', { ...editing.differentiationTips, easier: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-orange-600 mb-1 block">تحدي</label>
              <textarea value={editing.differentiationTips?.harder || ''} onChange={e => updateField('differentiationTips', { ...editing.differentiationTips, harder: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {saving ? 'حفظ...' : 'حفظ'}
            </button>
            <button onClick={() => setEditing(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm">إلغاء</button>
            {saved && <span className="text-green-600 text-sm self-center">تم ✓</span>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
