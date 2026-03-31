import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setAssignments([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(prof);

      if (prof?.role === 'teacher') {
        const { data: assigns } = await supabase
          .from('teacher_assignments')
          .select('*')
          .eq('teacher_id', userId);
        setAssignments(assigns || []);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAssignments([]);
  }

  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const isAuthenticated = !!user && !!profile;

  // Get teacher's assigned levels and days
  const assignedLevels = [...new Set(assignments.map(a => a.level))];
  const assignedDays = [...new Set(assignments.map(a => a.day))];

  function hasAccess(level, day) {
    if (isAdmin) return true;
    if (!isTeacher) return false;
    return assignments.some(a =>
      a.level === level && (day ? a.day === day : true)
    );
  }

  return (
    <AuthContext.Provider value={{
      user, profile, assignments, loading,
      isAdmin, isTeacher, isAuthenticated,
      assignedLevels, assignedDays,
      hasAccess, signIn, signOut, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
