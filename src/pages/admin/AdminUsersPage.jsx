import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const levelNames = { 1: 'المستوى الأول', 2: 'المستوى الثاني', 3: 'المستوى الثالث' };
const levelColors = { 1: '#4CAF50', 2: '#2196F3', 3: '#FF9800' };
const dayNames = { tuesday: 'الثلاثاء', thursday: 'الخميس' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'teacher' });
  const [assignForm, setAssignForm] = useState({ level1_tue: false, level1_thu: false, level2_tue: false, level2_thu: false, level3_tue: false, level3_thu: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*, teacher_assignments(*)').order('created_at');
    setUsers(data || []);
    setLoading(false);
  }

  function openCreate() {
    setForm({ email: '', password: '', full_name: '', role: 'teacher' });
    setAssignForm({ level1_tue: false, level1_thu: false, level2_tue: false, level2_thu: false, level3_tue: false, level3_thu: false });
    setEditingUser(null);
    setShowForm(true);
    setError('');
  }

  function openEdit(user) {
    setForm({ email: user.email, password: '', full_name: user.full_name, role: user.role });
    const assigns = user.teacher_assignments || [];
    setAssignForm({
      level1_tue: assigns.some(a => a.level === 1 && a.day === 'tuesday'),
      level1_thu: assigns.some(a => a.level === 1 && a.day === 'thursday'),
      level2_tue: assigns.some(a => a.level === 2 && a.day === 'tuesday'),
      level2_thu: assigns.some(a => a.level === 2 && a.day === 'thursday'),
      level3_tue: assigns.some(a => a.level === 3 && a.day === 'tuesday'),
      level3_thu: assigns.some(a => a.level === 3 && a.day === 'thursday'),
    });
    setEditingUser(user);
    setShowForm(true);
    setError('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      let userId;

      if (editingUser) {
        // Update existing user
        userId = editingUser.id;
        await supabase.from('profiles').update({ full_name: form.full_name, role: form.role }).eq('id', userId);
      } else {
        // Create new user via Supabase Auth
        const { data, error: authErr } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.full_name, role: form.role } }
        });
        if (authErr) throw authErr;
        userId = data.user?.id;
        if (!userId) throw new Error('فشل في إنشاء المستخدم');
      }

      // Update assignments
      if (form.role === 'teacher') {
        await supabase.from('teacher_assignments').delete().eq('teacher_id', userId);
        const assignments = [];
        if (assignForm.level1_tue) assignments.push({ teacher_id: userId, level: 1, day: 'tuesday' });
        if (assignForm.level1_thu) assignments.push({ teacher_id: userId, level: 1, day: 'thursday' });
        if (assignForm.level2_tue) assignments.push({ teacher_id: userId, level: 2, day: 'tuesday' });
        if (assignForm.level2_thu) assignments.push({ teacher_id: userId, level: 2, day: 'thursday' });
        if (assignForm.level3_tue) assignments.push({ teacher_id: userId, level: 3, day: 'tuesday' });
        if (assignForm.level3_thu) assignments.push({ teacher_id: userId, level: 3, day: 'thursday' });
        if (assignments.length > 0) {
          await supabase.from('teacher_assignments').insert(assignments);
        }
      }

      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`هل تريد حذف ${user.full_name}؟`)) return;
    await supabase.from('profiles').delete().eq('id', user.id);
    fetchUsers();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
          <p className="text-base text-gray-500">إضافة وتعديل المعلمات وتعيين المستويات والأيام</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
          + إضافة معلمة
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <p className="text-center text-gray-400 py-10">جارٍ التحميل...</p>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <span className="text-5xl block mb-4">👥</span>
          <p className="text-base text-gray-500">لا يوجد مستخدمون بعد</p>
          <button onClick={openCreate} className="mt-4 px-5 py-2.5 bg-primary text-white rounded-xl text-sm">إضافة أول معلمة</button>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-base text-gray-800">{user.full_name}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role === 'admin' ? 'مدير' : 'معلمة'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3" dir="ltr">{user.email}</p>

                  {/* Assignments */}
                  {user.teacher_assignments?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {user.teacher_assignments.map((a, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: levelColors[a.level] + '15', color: levelColors[a.level] }}>
                          {levelNames[a.level]} - {dayNames[a.day]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(user)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    تعديل
                  </button>
                  {user.role !== 'admin' && (
                    <button onClick={() => handleDelete(user)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors">
                      حذف
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-gray-800">{editingUser ? 'تعديل المستخدم' : 'إضافة معلمة جديدة'}</h2>
            </div>

            <div className="p-6 space-y-5">
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">الاسم الكامل</label>
                <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base" placeholder="مثال: سارة أحمد" />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">البريد الإلكتروني</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base" placeholder="sara@school.com" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">كلمة المرور</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base" placeholder="٦ أحرف على الأقل" dir="ltr" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">الصلاحية</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base">
                  <option value="teacher">معلمة</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              {form.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-3">تعيين المستويات والأيام</label>
                  <div className="space-y-4">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className="p-4 rounded-xl border border-border" style={{ backgroundColor: levelColors[level] + '08' }}>
                        <p className="font-bold text-sm mb-3" style={{ color: levelColors[level] }}>{levelNames[level]}</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={assignForm[`level${level}_tue`]} onChange={(e) => setAssignForm({ ...assignForm, [`level${level}_tue`]: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                            <span className="text-sm text-gray-700">الثلاثاء</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={assignForm[`level${level}_thu`]} onChange={(e) => setAssignForm({ ...assignForm, [`level${level}_thu`]: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                            <span className="text-sm text-gray-700">الخميس</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
                {saving ? 'جارٍ الحفظ...' : editingUser ? 'حفظ التعديلات' : 'إنشاء المستخدم'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
