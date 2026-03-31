import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            أ
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مدرسة الأرض</h1>
          <p className="text-base text-gray-500">حقيبة معلمة اللغة العربية</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">تسجيل الدخول</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@school.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl text-base font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          للحصول على حساب، تواصلي مع إدارة المدرسة
        </p>
      </div>
    </div>
  );
}
