import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { toArabicNumerals } from '../../../utils/arabicNumbers';
import localCalendar from '../../../data/unit-calendar.json';

const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };

export default function CalendarEditor() {
  const [weeks, setWeeks] = useState([]);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => { loadWeeks(); }, []);

  async function loadWeeks() {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('unit_weeks').select('*').order('week_number');
      if (data?.length) {
        setWeeks(data);
        return;
      }
    }
    setWeeks(localCalendar.weeks.map(w => ({
      week_number: w.weekNumber, letter: w.letter,
      letter_name: w.letterName, theme: w.theme,
      session1_focus: w.sessions[0]?.focus,
      session2_focus: w.sessions[1]?.focus,
    })));
  }

  function updateWeek(weekNum, field, value) {
    setWeeks(prev => prev.map(w =>
      w.week_number === weekNum ? { ...w, [field]: value } : w
    ));
    setSaved(null);
  }

  async function saveWeek(weekNum) {
    if (!isSupabaseConfigured()) return;
    setSaving(weekNum);
    const week = weeks.find(w => w.week_number === weekNum);
    const { error } = await supabase.from('unit_weeks').upsert({
      ...week, updated_at: new Date().toISOString(),
    });
    if (error) alert('خطأ: ' + error.message);
    else setSaved(weekNum);
    setSaving(null);
  }

  async function saveAll() {
    if (!isSupabaseConfigured()) return;
    setSaving('all');
    const rows = weeks.map(w => ({ ...w, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('unit_weeks').upsert(rows);
    if (error) alert('خطأ: ' + error.message);
    else setSaved('all');
    setSaving(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل الخطة الزمنية</h1>
          <p className="text-base text-gray-500">تعديل عناوين وموضوعات الأسابيع</p>
        </div>
        <button onClick={saveAll} disabled={saving === 'all'} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
          {saving === 'all' ? 'جارٍ الحفظ...' : 'حفظ الكل'}
        </button>
      </div>

      {saved === 'all' && <p className="text-green-600 text-sm font-semibold">تم حفظ جميع التعديلات ✓</p>}

      <div className="space-y-5">
        {weeks.map((week) => (
          <div key={week.week_number} className="bg-white rounded-2xl border border-border overflow-hidden">
            {/* Week Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4" style={{ backgroundColor: levelColors[1] + '08' }}>
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: levelColors[1] }}>
                {toArabicNumerals(week.week_number)}
              </span>
              <h3 className="font-bold text-lg text-gray-800">الأسبوع {toArabicNumerals(week.week_number)}</h3>
              {week.letter && <span className="text-3xl font-bold" style={{ color: levelColors[1] }}>{week.letter}</span>}

              <div className="mr-auto flex gap-2">
                <button onClick={() => saveWeek(week.week_number)} disabled={saving === week.week_number} className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 disabled:opacity-50">
                  {saving === week.week_number ? 'حفظ...' : 'حفظ'}
                </button>
                {saved === week.week_number && <span className="text-green-600 text-xs self-center">✓</span>}
              </div>
            </div>

            {/* Fields */}
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
                  <label className="text-sm font-semibold text-gray-500 block mb-2">📅 تركيز الثلاثاء (الفقرة ١)</label>
                  <textarea value={week.session1_focus || ''} onChange={e => updateWeek(week.week_number, 'session1_focus', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 block mb-2">📅 تركيز الخميس (الفقرة ٢)</label>
                  <textarea value={week.session2_focus || ''} onChange={e => updateWeek(week.week_number, 'session2_focus', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
