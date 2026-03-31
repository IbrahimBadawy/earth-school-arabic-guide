import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedLevel, setSelectedLevel] = useState(() => {
    return parseInt(localStorage.getItem('selectedLevel') || '1');
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(() => {
    return parseInt(localStorage.getItem('currentWeek') || '1');
  });

  useEffect(() => {
    localStorage.setItem('selectedLevel', selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    localStorage.setItem('currentWeek', currentWeek);
  }, [currentWeek]);

  const levelColors = {
    1: { main: '#4CAF50', light: '#E8F5E9', name: 'المستوى الأول' },
    2: { main: '#2196F3', light: '#E3F2FD', name: 'المستوى الثاني' },
    3: { main: '#FF9800', light: '#FFF3E0', name: 'المستوى الثالث' },
  };

  return (
    <AppContext.Provider value={{
      selectedLevel, setSelectedLevel,
      sidebarOpen, setSidebarOpen,
      currentWeek, setCurrentWeek,
      levelColors,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
