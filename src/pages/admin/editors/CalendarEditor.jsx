import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { toArabicNumerals } from '../../../utils/arabicNumbers';
import localCalendar from '../../../data/unit-calendar.json';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };
const levelNames = { 1: 'المستوى الأول', 2: 'المستوى الثاني', 3: 'المستوى الثالث' };

// Default focus for Level 2 and 3 per week
const defaultL2Focus = [
  'مراجعة وتأسيس - تحليل أصوات بسيطة',
  'دمج صوتين - بداية الحركات',
  'الحركات الثلاث - فتحة وضمة وكسرة',
  'مواضع الحرف - أول ووسط وآخر',
  'قراءة مقاطع ثنائية - كتابة حروف',
  'دمج ثلاثة أصوات - كلمات بسيطة',
  'قراءة كلمات ثنائية وثلاثية',
  'كتابة كلمات بحروف منفصلة',
  'قراءة جمل قصيرة بالحركات',
  'تعزيز القراءة والكتابة',
  'مراجعة شاملة وتقييم',
  'مراجعة نهائية واحتفال',
];

const defaultL3Focus = [
  'حروف متشابهة - تمييز المخارج',
  'الصوت الطويل والقصير',
  'التاء المربوطة والهمزة',
  'الكتابة المتصلة - كلمات كاملة',
  'ترتيب كلمات لتكوين جمل',
  'المرادفات والأضداد',
  'الجذر المشترك - عائلة الكلمة',
  'قراءة فقرات قصيرة',
  'كتابة جمل وصفية',
  'قراءة مستقلة وطلاقة',
  'تأليف قصة قصيرة',
  'مراجعة شاملة واحتفال ختامي',
];

export default function CalendarEditor() {
  const [weeks, setWeeks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  // Store L2/L3 focus data separately (saved as general_objectives with special keys)
  const [l2Focus, setL2Focus] = useState([...defaultL2Focus]);
  const [l3Focus, setL3Focus] = useState([...defaultL3Focus]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    // Load weeks
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('unit_weeks').select('*').order('week_number');
      if (data?.length) setWeeks(data);
      else setWeeks(localCalendar.weeks.map(w => ({
        week_number: w.weekNumber, letter: w.letter, letter_name: w.letterName,
        theme: w.theme, session1_focus: w.sessions[0]?.focus, session2_focus: w.sessions[1]?.focus,
      })));

      // Load L2/L3 focus from general_objectives
      const { data: l2Data } = await supabase.from('general_objectives').select('data').eq('id', 'calendar_l2').single();
      if (l2Data?.data) setL2Focus(l2Data.data);

      const { data: l3Data } = await supabase.from('general_objectives').select('data').eq('id', 'calendar_l3').single();
      if (l3Data?.data) setL3Focus(l3Data.data);
    } else {
      setWeeks(localCalendar.weeks.map(w => ({
        week_number: w.weekNumber, letter: w.letter, letter_name: w.letterName,
        theme: w.theme, session1_focus: w.sessions[0]?.focus, session2_focus: w.sessions[1]?.focus,
      })));
    }
  }

  function updateWeek(weekNum, field, value) {
    setWeeks(prev => prev.map(w => w.week_number === weekNum ? { ...w, [field]: value } : w));
    setSaved(null);
  }

  function updateL2Focus(idx, value) {
    setL2Focus(prev => { const arr = [...prev]; arr[idx] = value; return arr; });
    setSaved(null);
  }

  function updateL3Focus(idx, value) {
    setL3Focus(prev => { const arr = [...prev]; arr[idx] = value; return arr; });
    setSaved(null);
  }

  async function saveAll() {
    if (!isSupabaseConfigured()) return;
    setSaving('all');
    try {
      // Save weeks (L1 data)
      const rows = weeks.map(w => ({ ...w, updated_at: new Date().toISOString() }));
      const { error: e1 } = await supabase.from('unit_weeks').upsert(rows);
      if (e1) throw e1;

      // Save L2/L3 focus
      await supabase.from('general_objectives').upsert({ id: 'calendar_l2', data: l2Focus });
      await supabase.from('general_objectives').upsert({ id: 'calendar_l3', data: l3Focus });

      setSaved('all');
    } catch (err) {
      alert('خطأ: ' + err.message);
    }
    setSaving(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل الخطة الزمنية</h1>
          <p className="text-base text-gray-500">تعديل عناوين وموضوعات الأسابيع لكل مستوى</p>
        </div>
        <button onClick={saveAll} disabled={saving === 'all'} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
          {saving === 'all' ? 'جارٍ الحفظ...' : 'حفظ الكل'}
        </button>
      </div>

      {saved === 'all' && <p className="text-green-600 text-sm font-semibold">تم حفظ جميع التعديلات ✓</p>}

      {/* Level Tabs */}
      <div className="flex gap-3">
        {[1, 2, 3].map(l => (
          <button key={l} onClick={() => setSelectedLevel(l)} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{
            backgroundColor: selectedLevel === l ? levelColors[l] : 'white',
            color: selectedLevel === l ? 'white' : levelColors[l],
            border: `2px solid ${levelColors[l]}`,
          }}>
            {levelNames[l]}
          </button>
        ))}
      </div>

      {/* Level 1: Full week editor */}
      {selectedLevel === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 bg-green-50 rounded-xl p-4 border border-green-100">
            المستوى الأول: حرف جديد كل أسبوع. عدّلي الحرف والموضوع وتركيز كل فقرة.
          </p>
          {weeks.map((week) => (
            <div key={week.week_number} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4" style={{ backgroundColor: levelColors[1] + '08' }}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: levelColors[1] }}>
                  {toArabicNumerals(week.week_number)}
                </span>
                <h3 className="font-bold text-lg text-gray-800">الأسبوع {toArabicNumerals(week.week_number)}</h3>
                {week.letter && <span className="text-3xl font-bold" style={{ color: levelColors[1] }}>{week.letter}</span>}
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 block mb-2">الحرف</label>
                    <input value={week.letter || ''} onChange={e => updateWeek(week.week_number, 'letter', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-2xl text-center font-bold" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500 block mb-2">اسم الحرف</label>
                    <input value={week.letter_name || ''} onChange={e => updateWeek(week.week_number, 'letter_name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-base" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500 block mb-2">الموضوع</label>
                    <input value={week.theme || ''} onChange={e => updateWeek(week.week_number, 'theme', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 block mb-2">📅 تركيز الثلاثاء</label>
                    <textarea value={week.session1_focus || ''} onChange={e => updateWeek(week.week_number, 'session1_focus', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500 block mb-2">📅 تركيز الخميس</label>
                    <textarea value={week.session2_focus || ''} onChange={e => updateWeek(week.week_number, 'session2_focus', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level 2: Focus per week */}
      {selectedLevel === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 bg-blue-50 rounded-xl p-4 border border-blue-100">
            المستوى الثاني: محور مختلف كل أسبوع (تحليل أصوات، حركات، مواضع، قراءة، كتابة). عدّلي المحور لكل أسبوع.
          </p>
          {l2Focus.map((focus, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6 flex items-start gap-5">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: levelColors[2] }}>
                {toArabicNumerals(i + 1)}
              </span>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-500 block mb-2">الأسبوع {toArabicNumerals(i + 1)} - محور المستوى الثاني</label>
                <textarea value={focus} onChange={e => updateL2Focus(i, e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-base resize-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level 3: Focus per week */}
      {selectedLevel === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 bg-orange-50 rounded-xl p-4 border border-orange-100">
            المستوى الثالث: محور مختلف كل أسبوع (حروف متشابهة، كتابة متصلة، جمل، لغويات). عدّلي المحور لكل أسبوع.
          </p>
          {l3Focus.map((focus, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-6 flex items-start gap-5">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: levelColors[3] }}>
                {toArabicNumerals(i + 1)}
              </span>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-500 block mb-2">الأسبوع {toArabicNumerals(i + 1)} - محور المستوى الثالث</label>
                <textarea value={focus} onChange={e => updateL3Focus(i, e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-base resize-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
