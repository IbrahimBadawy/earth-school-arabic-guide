import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Fallback to local JSON data when Supabase is not configured
import localScenarios from '../data/daily-scenarios/index';
import localActivities from '../data/activities.json';
import localDetailedObjectives from '../data/detailed-objectives.json';
import localGeneralObjectives from '../data/general-objectives.json';
import localCalendar from '../data/unit-calendar.json';
import localAssessment from '../data/assessment.json';
import localMaterials from '../data/materials.json';
import localTipsFaq from '../data/tips-faq.json';
import localLevels from '../data/levels.json';

// Generic hook for fetching data from Supabase with local fallback
function useSupabaseData(table, localData, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filter, single, orderBy } = options;

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setData(localData);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from(table).select('*');
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      if (orderBy) query = query.order(orderBy);
      if (single) query = query.single();

      const { data: result, error: err } = await query;
      if (err) throw err;
      setData(result);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err);
      setData(localData); // Fallback to local data on error
    } finally {
      setLoading(false);
    }
  }, [table, JSON.stringify(filter)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// === Specific hooks ===

export function useScenario(level, week, session) {
  const key = `L${level}-W${week}-S${session}`;
  const local = localScenarios[key] || null;

  return useSupabaseData('scenarios', local, {
    filter: { id: key },
    single: true,
  });
}

export function useActivities() {
  return useSupabaseData('activities', localActivities, { orderBy: 'id' });
}

export function useActivity(id) {
  const local = localActivities.find(a => a.id === id) || null;
  return useSupabaseData('activities', local, { filter: { id }, single: true });
}

export function useDetailedObjectives() {
  return useSupabaseData('detailed_objectives', localDetailedObjectives, { orderBy: 'id' });
}

export function useGeneralObjectives() {
  // General objectives stored as a single JSONB document
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setData(localGeneralObjectives);
      setLoading(false);
      return;
    }

    supabase.from('general_objectives').select('*').then(({ data: rows, error }) => {
      if (error || !rows?.length) {
        setData(localGeneralObjectives);
      } else {
        // Reconstruct the original format from DB rows
        const result = { shared: null, levels: {} };
        rows.forEach(row => {
          if (row.id === 'shared') result.shared = row.data;
          else result.levels[row.id] = row.data;
        });
        setData(result);
      }
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useCalendar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setData(localCalendar);
      setLoading(false);
      return;
    }

    supabase.from('unit_weeks').select('*').order('week_number').then(({ data: weeks, error }) => {
      if (error || !weeks?.length) {
        setData(localCalendar);
      } else {
        setData({
          ...localCalendar,
          weeks: weeks.map(w => ({
            weekNumber: w.week_number,
            letter: w.letter,
            letterName: w.letter_name,
            theme: w.theme,
            sessions: [
              { session: 1, focus: w.session1_focus },
              { session: 2, focus: w.session2_focus },
            ]
          }))
        });
      }
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useAssessment() {
  return useSupabaseData('assessment_data', localAssessment);
}

export function useMaterials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setData(localMaterials);
      setLoading(false);
      return;
    }

    supabase.from('materials_categories').select('*').order('sort_order').then(({ data: cats, error }) => {
      if (error || !cats?.length) {
        setData(localMaterials);
      } else {
        setData({ categories: cats.map(c => ({ name: c.name, icon: c.icon, items: c.items })) });
      }
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useTipsFaq() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setData(localTipsFaq);
      setLoading(false);
      return;
    }

    Promise.all([
      supabase.from('tips').select('*').order('sort_order'),
      supabase.from('faq').select('*').order('sort_order'),
    ]).then(([tipsRes, faqRes]) => {
      setData({
        tips: tipsRes.data?.length ? tipsRes.data : localTipsFaq.tips,
        faq: faqRes.data?.length ? faqRes.data : localTipsFaq.faq,
      });
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useLevels() {
  return useSupabaseData('levels', localLevels, { orderBy: 'id' });
}

// === Admin CRUD operations ===

export async function upsertScenario(scenario) {
  const { error } = await supabase.from('scenarios').upsert(scenario);
  if (error) throw error;
}

export async function upsertActivity(activity) {
  const dbActivity = {
    id: activity.id,
    name: activity.name,
    target_skill: activity.targetSkill,
    target_levels: activity.targetLevels,
    duration: activity.duration,
    group_size: activity.groupSize,
    materials: activity.materials,
    description: activity.description,
    steps: activity.steps,
    variations: activity.variations,
    differentiation_easier: activity.differentiationTips?.easier,
    differentiation_harder: activity.differentiationTips?.harder,
    tags: activity.tags,
  };
  const { error } = await supabase.from('activities').upsert(dbActivity);
  if (error) throw error;
}

export async function deleteActivity(id) {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertObjective(obj) {
  const { error } = await supabase.from('detailed_objectives').upsert(obj);
  if (error) throw error;
}

export async function deleteObjective(id) {
  const { error } = await supabase.from('detailed_objectives').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertTip(tip) {
  const { error } = await supabase.from('tips').upsert(tip);
  if (error) throw error;
}

export async function deleteTip(id) {
  const { error } = await supabase.from('tips').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertFaq(faq) {
  const { error } = await supabase.from('faq').upsert(faq);
  if (error) throw error;
}

export async function deleteFaq(id) {
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) throw error;
}

// === Admin User Management ===

export async function createUser(email, password, fullName, role = 'teacher') {
  // Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
  if (error) throw error;
  return data.user;
}

export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*, teacher_assignments(*)').order('created_at');
  if (error) throw error;
  return data;
}

export async function updateUserProfile(id, updates) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}

export async function setTeacherAssignments(teacherId, assignments) {
  // Delete existing
  await supabase.from('teacher_assignments').delete().eq('teacher_id', teacherId);
  // Insert new
  if (assignments.length > 0) {
    const rows = assignments.map(a => ({ teacher_id: teacherId, level: a.level, day: a.day }));
    const { error } = await supabase.from('teacher_assignments').insert(rows);
    if (error) throw error;
  }
}

export async function deleteUser(id) {
  // Delete profile (cascades to assignments)
  await supabase.from('profiles').delete().eq('id', id);
  // Delete auth user
  await supabase.auth.admin.deleteUser(id);
}
