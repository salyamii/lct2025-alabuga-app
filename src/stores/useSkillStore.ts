import { create } from 'zustand';
import { Skill } from '../domain';
import skillService from '../api/services/skillService';
import { SkillCreateRequest, SkillUpdateRequest } from '../api/types/apiTypes';

interface SkillState {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

interface SkillActions {
  fetchSkills: () => Promise<void>;
  fetchSkillById: (id: number) => Promise<void>;
  createSkill: (skillData: SkillCreateRequest) => Promise<Skill>;
  updateSkill: (id: number, skillData: SkillUpdateRequest) => Promise<Skill>;
  deleteSkill: (id: number) => Promise<void>;
  clearSkills: () => void;
}

export const useSkillStore = create<SkillState & SkillActions>((set: (partial: Partial<SkillState & SkillActions>) => void, get: () => SkillState & SkillActions) => ({
  skills: [],
  isLoading: false,
  error: null,

  fetchSkills: async () => {
    try {
      set({ isLoading: true, error: null });
      const skills = await skillService.getSkills();
      set({ skills: skills.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить навыки', isLoading: false });
    }
  },

  fetchSkillById: async (id: number) => {
    try {
      const skill = await skillService.getSkill(id);
      const currentSkills = get().skills;
      const exists = currentSkills.some((s: Skill) => s.id === skill.data.id);
      if (!exists) {
        set({ skills: [...currentSkills, skill.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить навык' });
    }
  },

  createSkill: async (skillData: SkillCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newSkill = await skillService.createSkill(skillData);
      set({ skills: [...get().skills, newSkill.data], isLoading: false });
      return newSkill.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать навык', isLoading: false });
      throw error;
    }
  },

  updateSkill: async (id: number, skillData: SkillUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSkill = await skillService.updateSkill(id, skillData);
      set({ 
        skills: get().skills.map((s: Skill) => s.id === id ? updatedSkill.data : s),
        isLoading: false 
      });
      return updatedSkill.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить навык', isLoading: false });
      throw error;
    }
  },

  deleteSkill: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await skillService.deleteSkill(id);
      set({ 
        skills: get().skills.filter((s: Skill) => s.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить навык', isLoading: false });
      throw error;
    }
  },

  clearSkills: () => {
    set({ skills: [], isLoading: false, error: null });
  },
}));
