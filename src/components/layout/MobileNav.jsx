import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'الرئيسية', icon: '🏠' },
  { path: '/calendar', label: 'الخطة', icon: '📅' },
  { path: '/scenario/1/1/1', label: 'السيناريو', icon: '📖' },
  { path: '/activities', label: 'الأنشطة', icon: '🎮' },
  { path: '/assessment', label: 'التقييم', icon: '📊' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 right-0 left-0 h-16 bg-white/95 backdrop-blur-md border-t border-border z-30 no-print">
      <div className="h-full flex items-center justify-around px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-light'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
