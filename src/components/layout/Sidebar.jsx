import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'الرئيسية', icon: '🏠' },
  { path: '/objectives/general', label: 'الأهداف العامة', icon: '🎯' },
  { path: '/objectives/detailed', label: 'الأهداف التفصيلية', icon: '📋' },
  { path: '/calendar', label: 'الخطة الزمنية', icon: '📅' },
  { path: '/scenario/1/1/1', label: 'سيناريو اليوم', icon: '📖' },
  { path: '/activities', label: 'مكتبة الأنشطة', icon: '🎮' },
  { path: '/assessment', label: 'التقييم', icon: '📊' },
  { path: '/materials', label: 'الأدوات والمواد', icon: '🎒' },
  { path: '/tips', label: 'نصائح وأسئلة شائعة', icon: '💡' },
];

export default function Sidebar({ onClose }) {
  return (
    <nav className="p-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-light hover:bg-surface-hover hover:text-text'
                }`
              }
              end={item.path === '/'}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
