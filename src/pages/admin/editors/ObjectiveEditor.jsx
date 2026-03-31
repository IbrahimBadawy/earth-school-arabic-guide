import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import localObjectives from '../../../data/detailed-objectives.json';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function ObjectiveEditor() {
  const [objectives, setObjectives] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('detailed_objectives').select('*').order('id');
      setObjectives(data?.length ? data : localObjectives);
    } else {
      setObjectives(localObjectives);
    }
  }

  function openNew() {
    setEditing({ id: '', level: 1, domain: '', objective: '', measurable: '', assessment_method: '', week_introduced: 1, _isNew: true });
    setSaved(false);
  }

  function openEdit(obj) {
    setEditing({ ...obj, assessment_method: obj.assessment_method || obj.assessmentMethod, week_introduced: obj.week_introduced || obj.weekIntroduced });
    setSaved(false);
  }

  async function handleSave() {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('detailed_objectives').upsert({
        id: editing.id, level: editing.level, domain: editing.domain,
        objective: editing.objective, measurable: editing.measurable,
        assessment_method: editing.assessment_method, week_introduced: editing.week_introduced,
      });
      if (error) throw error;
      setSaved(true);
      loadData();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('حذف هذا الهدف؟')) return;
    await supabase.from('detailed_objectives').delete().eq('id', id);
    loadData();
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل الأهداف التفصيلية</h1>
          <p className="text-base text-gray-500">{objectives.length} هدف</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">+ إضافة هدف</button>
      </div>

      <div className="space-y-3">
        {objectives.map(obj => (
          <div key={obj.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:border-primary/30 ${editing?.id === obj.id ? 'border-primary' : 'border-border'}`} onClick={() => openEdit(obj)}>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: levelColors[obj.level] }}>م{obj.level}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{obj.objective}</p>
                <p className="text-xs text-gray-400">{obj.domain} | {obj.id}</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(obj.id); }} className="text-red-400 hover:text-red-600 text-sm px-2">حذف</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border-2 border-primary/30 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">{editing._isNew ? 'إضافة هدف' : 'تعديل'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">الرقم التعريفي</label>
              <input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" placeholder="L1-صو-01" dir="ltr" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">المستوى</label>
              <select value={editing.level} onChange={e => setEditing({ ...editing, level: parseInt(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-border text-sm">
                <option value={1}>المستوى الأول</option>
                <option value={2}>المستوى الثاني</option>
                <option value={3}>المستوى الثالث</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">المحور</label>
              <input value={editing.domain} onChange={e => setEditing({ ...editing, domain: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">الهدف</label>
            <textarea value={editing.objective} onChange={e => setEditing({ ...editing, objective: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">معيار القياس</label>
            <textarea value={editing.measurable || ''} onChange={e => setEditing({ ...editing, measurable: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">طريقة التقييم</label>
              <input value={editing.assessment_method || ''} onChange={e => setEditing({ ...editing, assessment_method: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">أسبوع البدء</label>
              <input type="number" value={editing.week_introduced || ''} onChange={e => setEditing({ ...editing, week_introduced: parseInt(e.target.value) || null })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{saving ? 'حفظ...' : 'حفظ'}</button>
            <button onClick={() => setEditing(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm">إلغاء</button>
            {saved && <span className="text-green-600 text-sm self-center">تم ✓</span>}
          </div>
        </div>
      )}
    </div>
  );
}
