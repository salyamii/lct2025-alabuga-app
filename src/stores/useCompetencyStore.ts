import { create } from 'zustand';
import { Competency } from '../domain';
import competencyService from '../api/services/competencyService';

interface CompetencyState {
  competencies: Competency[];
  isLoading: boolean;
  error: string | null;
}

interface CompetencyActions {
  fetchCompetencies: () => Promise<void>;
  fetchCompetencyById: (id: number) => Promise<void>;
  createCompetency: (competency: Competency) => Promise<void>;
  updateCompetency: (competency: Competency) => Promise<void>;
  deleteCompetency: (id: number) => Promise<void>;
}

export const useCompetencyStore = create<CompetencyState & CompetencyActions>((set, get) => ({
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
      const exists = currentCompetencies.some(c => c.id === competency.data.id);
      if (!exists) {
        set({ competencies: [...currentCompetencies, competency.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить компетенцию', isLoading: false });
    }
  },

  createCompetency: async (competency: Competency) => {
    try {
      const newCompetency = await competencyService.createCompetency(competency);
      set({ competencies: [...get().competencies, newCompetency.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать компетенцию', isLoading: false });
    }
  },

  updateCompetency: async (competency: Competency) => {
    try {
      const updatedCompetency = await competencyService.updateCompetency(competency.id, competency);
      set({ competencies: get().competencies.map(c => c.id === competency.id ? updatedCompetency.data : c) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить компетенцию', isLoading: false });
    }
  },

  deleteCompetency: async (id: number) => {
    try {
      await competencyService.deleteCompetency(id);
      set({ competencies: get().competencies.filter(c => c.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить компетенцию', isLoading: false });
    }
  }
}));
