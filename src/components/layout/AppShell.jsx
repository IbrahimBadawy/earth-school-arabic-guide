import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'الرئيسية', icon: '🏠', end: true },
  { path: '/objectives/general', label: 'الأهداف العامة', icon: '🎯' },
  { path: '/objectives/detailed', label: 'الأهداف التفصيلية', icon: '📋' },
  { path: '/calendar', label: 'الخطة الزمنية', icon: '📅' },
  { path: '/scenario/1/1/1', label: 'سيناريو اليوم', icon: '📖' },
  { path: '/activities', label: 'مكتبة الأنشطة', icon: '🎮' },
  { path: '/assessment', label: 'التقييم', icon: '📊' },
  { path: '/materials', label: 'الأدوات والمواد', icon: '🎒' },
  { path: '/tips', label: 'نصائح للمعلمات', icon: '💡' },
];

const mobileNav = [
  { path: '/', label: 'الرئيسية', icon: '🏠', end: true },
  { path: '/calendar', label: 'الخطة', icon: '📅' },
  { path: '/scenario/1/1/1', label: 'السيناريو', icon: '📖' },
  { path: '/activities', label: 'الأنشطة', icon: '🎮' },
  { path: '/tips', label: 'نصائح', icon: '💡' },
];

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg">
      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 h-14 bg-white border-b border-border z-40 no-print">
        <div className="h-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">أ</div>
            <span className="font-bold text-primary text-sm hidden sm:block">مدرسة الأرض</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex" style={{ paddingTop: '3.5rem' }}>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 fixed right-0 bottom-0 bg-white border-l border-border overflow-y-auto no-print z-30" style={{ top: '3.5rem' }}>
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 lg:hidden"
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ x: 280 }}
                animate={{ x: 0 }}
                exit={{ x: 280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-primary">القائمة</span>
                  <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <nav className="p-3 space-y-0.5">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content - proper margin to avoid sidebar */}
        <main className="flex-1 pb-20 lg:pb-8" style={{ minHeight: 'calc(100vh - 3.5rem)' }} id="main-content">
          <div className="max-w-4xl mx-auto px-8 sm:px-12 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 right-0 left-0 h-14 bg-white border-t border-border z-30 no-print">
        <div className="h-full flex items-center justify-around">
          {mobileNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs ${isActive ? 'text-primary font-semibold' : 'text-gray-400'}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
