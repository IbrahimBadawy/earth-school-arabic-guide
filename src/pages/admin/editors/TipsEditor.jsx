import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import localData from '../../../data/tips-faq.json';

export default function TipsEditor() {
  const [tips, setTips] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [tab, setTab] = useState('tips');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    if (isSupabaseConfigured()) {
      const [tRes, fRes] = await Promise.all([
        supabase.from('tips').select('*').order('sort_order'),
        supabase.from('faq').select('*').order('sort_order'),
      ]);
      setTips(tRes.data?.length ? tRes.data : localData.tips);
      setFaqs(fRes.data?.length ? fRes.data : localData.faq);
    } else {
      setTips(localData.tips);
      setFaqs(localData.faq);
    }
  }

  function openNewTip() {
    setEditing({ id: `tip-${String(tips.length + 1).padStart(2, '0')}`, category: '', title: '', content: '', levels: [1, 2, 3], sort_order: tips.length, _type: 'tip', _isNew: true });
    setSaved(false);
  }

  function openNewFaq() {
    setEditing({ id: `faq-${String(faqs.length + 1).padStart(2, '0')}`, question: '', answer: '', sort_order: faqs.length, _type: 'faq', _isNew: true });
    setSaved(false);
  }

  async function handleSave() {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    try {
      const table = editing._type === 'tip' ? 'tips' : 'faq';
      const data = { ...editing };
      delete data._type;
      delete data._isNew;
      const { error } = await supabase.from(table).upsert(data);
      if (error) throw error;
      setSaved(true);
      loadData();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(type, id) {
    if (!confirm('حذف؟')) return;
    await supabase.from(type === 'tip' ? 'tips' : 'faq').delete().eq('id', id);
    loadData();
    if (editing?.id === id) setEditing(null);
  }

  const items = tab === 'tips' ? tips : faqs;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل النصائح والأسئلة</h1>
          <p className="text-base text-gray-500">{tips.length} نصيحة | {faqs.length} سؤال</p>
        </div>
        <button onClick={tab === 'tips' ? openNewTip : openNewFaq} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
          + إضافة {tab === 'tips' ? 'نصيحة' : 'سؤال'}
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setTab('tips')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${tab === 'tips' ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>النصائح ({tips.length})</button>
        <button onClick={() => setTab('faq')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${tab === 'faq' ? 'bg-primary text-white' : 'bg-white border border-border text-gray-600'}`}>الأسئلة ({faqs.length})</button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:border-primary/30 ${editing?.id === item.id ? 'border-primary' : 'border-border'}`} onClick={() => { setEditing({ ...item, _type: tab === 'tips' ? 'tip' : 'faq' }); setSaved(false); }}>
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title || item.question}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.category || ''} {item.id}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(tab === 'tips' ? 'tip' : 'faq', item.id); }} className="text-red-400 hover:text-red-600 text-sm px-2">حذف</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border-2 border-primary/30 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">{editing._isNew ? 'إضافة' : 'تعديل'}</h2>
          {editing._type === 'tip' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">الفئة</label>
                  <input value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">العنوان</label>
                  <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">المحتوى</label>
                <textarea value={editing.content || ''} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">السؤال</label>
                <textarea value={editing.question || ''} onChange={e => setEditing({ ...editing, question: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">الإجابة</label>
                <textarea value={editing.answer || ''} onChange={e => setEditing({ ...editing, answer: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-border text-sm resize-none" />
              </div>
            </>
          )}
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
