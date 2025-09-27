import { create } from 'zustand';
import { Skill } from '../domain';
import skillService from '../api/services/skillService';

interface SkillState {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

interface SkillActions {
  fetchSkills: () => Promise<void>;
  fetchSkillById: (id: number) => Promise<void>;
  createSkill: (skill: Skill) => Promise<void>;
  updateSkill: (skill: Skill) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
}

export const useSkillStore = create<SkillState & SkillActions>((set, get) => ({
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
      const exists = currentSkills.some(s => s.id === skill.data.id);
      if (!exists) {
        set({ skills: [...currentSkills, skill.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить навык' });
    }
  },

  createSkill: async (skill: Skill) => {
    try {
      const skillData = {
        name: skill.name,
        maxLevel: skill.maxLevel
      };
      const newSkill = await skillService.createSkill(skillData);
      set({ skills: [...get().skills, newSkill.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать навык' });
    }
  },

  updateSkill: async (skill: Skill) => {
    try {
      const skillData = {
        name: skill.name,
        maxLevel: skill.maxLevel
      };
      const updatedSkill = await skillService.updateSkill(skill.id, skillData);
      set({ skills: get().skills.map(s => s.id === skill.id ? updatedSkill.data : s) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить навык' });
    }
  },

  deleteSkill: async (id: number) => {
    try {
      await skillService.deleteSkill(id);
      set({ skills: get().skills.filter(s => s.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить навык' });
    }
  },
}));
