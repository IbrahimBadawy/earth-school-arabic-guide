import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Header({ onMenuToggle }) {
  const { selectedLevel, setSelectedLevel, levelColors } = useAppContext();

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white/90 backdrop-blur-md shadow-sm z-30 no-print border-b border-border">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Right: Logo & Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold shadow-md">
            أ
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-primary leading-tight">مدرسة الأرض</h1>
            <p className="text-xs text-text-muted">حقيبة معلمة اللغة العربية</p>
          </div>
        </Link>

        {/* Center: Level Selector */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className="px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedLevel === level ? levelColors[level].main : levelColors[level].light,
                color: selectedLevel === level ? 'white' : levelColors[level].main,
                boxShadow: selectedLevel === level ? `0 2px 8px ${levelColors[level].main}40` : 'none',
              }}
            >
              م{level === 1 ? '١' : level === 2 ? '٢' : '٣'}
            </button>
          ))}
        </div>

        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-text-light"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
