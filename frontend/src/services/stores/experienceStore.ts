import { supabase } from '@/lib/supabase';
import type { ExperienceItem } from '@/types/experience';

const STORAGE_KEY = 'prepunite_experiences';
const INITIAL_EXPERIENCES: ExperienceItem[] = [];

export class ExperienceStore {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22 || e?.code === 1014) {
        console.warn(`[experienceStore] LocalStorage quota exceeded while caching key "${key}".`);
      }
    }
  }

  async syncExperienceToSupabase(exp: ExperienceItem): Promise<void> {
    try {
      const { error } = await supabase.from('experiences').upsert({
        id: exp.id,
        company_slug: (exp.companyName || 'tcs').toLowerCase(),
        student_name: exp.studentName,
        role_title: exp.role,
        result: exp.verdict,
        rounds: exp.rounds,
        status: exp.status || 'PENDING',
      });

      if (error) {
        console.error('[experienceStore] Supabase experience sync error:', error);
      }
    } catch (err) {
      console.warn('[experienceStore] Supabase experience sync exception:', err);
    }
  }

  getExperiences(): ExperienceItem[] {
    const list = this.getStorage<ExperienceItem[]>(STORAGE_KEY, INITIAL_EXPERIENCES);
    const cleaned = list.filter(
      (e) =>
        !['exp-1', 'exp-2', 'exp-3', 'exp-4'].includes(e.id) &&
        !['Rahul Sharma', 'Priya Verma', 'Aniket Gupta', 'Sneha Reddy', 'Super Admin'].includes(e.studentName)
    );
    if (cleaned.length !== list.length) {
      this.setStorage(STORAGE_KEY, cleaned);
    }
    return cleaned;
  }

  addExperience(exp: Partial<ExperienceItem>): ExperienceItem {
    const list = this.getExperiences();
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      companyName: exp.companyName || 'TCS',
      role: exp.role || 'Software Engineer',
      studentName: exp.studentName || 'Anonymous Student',
      college: exp.college || 'NIT/IIT Campus',
      year: exp.year || 2026,
      difficulty: exp.difficulty || 'MEDIUM',
      verdict: exp.verdict || 'SELECTED',
      rounds: exp.rounds || [{ roundTitle: 'Online Assessment', details: 'Appeared in online assessment round.' }],
      status: exp.status || 'PENDING',
    };
    const updated = [newExp, ...list];
    this.setStorage(STORAGE_KEY, updated);
    this.syncExperienceToSupabase(newExp);
    return newExp;
  }

  updateExperienceStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): void {
    const experiences = this.getExperiences();
    const target = experiences.find((e) => e.id === id);
    if (target) {
      target.status = status;
      this.setStorage(STORAGE_KEY, experiences);
      this.syncExperienceToSupabase(target);
    }
  }

  updateExperience(id: string, updatedExp: Partial<ExperienceItem>): void {
    const experiences = this.getExperiences();
    const index = experiences.findIndex((e) => e.id === id);
    if (index > -1) {
      experiences[index] = { ...experiences[index], ...updatedExp };
      this.setStorage(STORAGE_KEY, experiences);
      this.syncExperienceToSupabase(experiences[index]);
    }
  }

  deleteExperience(id: string): void {
    const all = this.getExperiences().filter((e) => e.id !== id);
    this.setStorage(STORAGE_KEY, all);
    supabase
      .from('experiences')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('[experienceStore] Failed to delete experience from Supabase:', error);
        }
      });
  }
}

export const experienceStore = new ExperienceStore();
