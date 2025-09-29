import { create } from 'zustand';
import { Competency } from '../domain';
import competencyService from '../api/services/competencyService';
import { CompetencyCreateRequest, CompetencyUpdateRequest } from '../api/types/apiTypes';

interface CompetencyState {
  competencies: Competency[];
  isLoading: boolean;
  error: string | null;
}

interface CompetencyActions {
  fetchCompetencies: () => Promise<void>;
  fetchCompetencyById: (id: number) => Promise<void>;
  createCompetency: (competencyData: CompetencyCreateRequest) => Promise<Competency>;
  updateCompetency: (id: number, competencyData: CompetencyUpdateRequest) => Promise<Competency>;
  deleteCompetency: (id: number) => Promise<void>;
  addSkillToCompetency: (competencyId: number, skillId: number) => Promise<Competency>;
  removeSkillFromCompetency: (competencyId: number, skillId: number) => Promise<Competency>;
  clearCompetencies: () => void;
}

export const useCompetencyStore = create<CompetencyState & CompetencyActions>((set: (partial: Partial<CompetencyState & CompetencyActions>) => void, get: () => CompetencyState & CompetencyActions) => ({
  competencies: [],
  isLoading: false,
  error: null,
  
  fetchCompetencies: async () => {
    try {
      set({ isLoading: true, error: null });
      const competencies = await competencyService.getCompetencies();
      set({ competencies: competencies.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить компетенции', isLoading: false });
    }
  },

  fetchCompetencyById: async (id: number) => {
    try {
      const competency = await competencyService.getCompetency(id);
      const currentCompetencies = get().competencies;
      const exists = currentCompetencies.some((c: Competency) => c.id === competency.data.id);
      if (!exists) {
        set({ competencies: [...currentCompetencies, competency.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить компетенцию', isLoading: false });
    }
  },

  createCompetency: async (competencyData: CompetencyCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newCompetency = await competencyService.createCompetency(competencyData);
      set({ competencies: [...get().competencies, newCompetency.data], isLoading: false });
      return newCompetency.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать компетенцию', isLoading: false });
      throw error;
    }
  },

  updateCompetency: async (id: number, competencyData: CompetencyUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCompetency = await competencyService.updateCompetency(id, competencyData);
      set({ 
        competencies: get().competencies.map((c: Competency) => c.id === id ? updatedCompetency.data : c),
        isLoading: false 
      });
      return updatedCompetency.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить компетенцию', isLoading: false });
      throw error;
    }
  },

  deleteCompetency: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await competencyService.deleteCompetency(id);
      set({ 
        competencies: get().competencies.filter((c: Competency) => c.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить компетенцию', isLoading: false });
      throw error;
    }
  },

  addSkillToCompetency: async (competencyId: number, skillId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCompetency = await competencyService.addSkillToCompetency(competencyId, skillId);
      set({ 
        competencies: get().competencies.map((c: Competency) => c.id === competencyId ? updatedCompetency.data : c),
        isLoading: false 
      });
      return updatedCompetency.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить навык к компетенции', isLoading: false });
      throw error;
    }
  },

  removeSkillFromCompetency: async (competencyId: number, skillId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedCompetency = await competencyService.removeSkillFromCompetency(competencyId, skillId);
      set({ 
        competencies: get().competencies.map((c: Competency) => c.id === competencyId ? updatedCompetency.data : c),
        isLoading: false 
      });
      return updatedCompetency.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить навык из компетенции', isLoading: false });
      throw error;
    }
  },

  clearCompetencies: () => {
    set({ competencies: [], isLoading: false, error: null });
  },
}));
