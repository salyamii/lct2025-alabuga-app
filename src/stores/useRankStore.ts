import { create } from 'zustand';
import { Rank } from '../domain';
import rankService from '../api/services/rankService';
import { RankCreateRequest, RankUpdateRequest } from '../api/types/apiTypes';

interface RankState {
  ranks: Rank[];
  isLoading: boolean;
  error: string | null;
}

interface RankActions {
  fetchRanks: () => Promise<void>;
  fetchRankById: (id: number) => Promise<void>;
  createRank: (rankData: RankCreateRequest) => Promise<Rank>;
  updateRank: (id: number, rankData: RankUpdateRequest) => Promise<Rank>;
  deleteRank: (id: number) => Promise<void>;
  addRequiredMissionToRank: (rankId: number, missionId: number) => Promise<Rank>;
  removeRequiredMissionFromRank: (rankId: number, missionId: number) => Promise<Rank>;
  addRequiredCompetencyToRank: (rankId: number, competencyId: number, minLevel: number) => Promise<Rank>;
  removeRequiredCompetencyFromRank: (rankId: number, competencyId: number) => Promise<Rank>;
  clearRanks: () => void;
}

export const useRankStore = create<RankState & RankActions>((set: (partial: Partial<RankState & RankActions>) => void, get: () => RankState & RankActions) => ({
  ranks: [],
  isLoading: false,
  error: null,

  fetchRanks: async () => {
    try {
      set({ isLoading: true, error: null });
      const ranks = await rankService.getRanks();
      set({ ranks: ranks.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить ранги', isLoading: false });
    }
  },

  fetchRankById: async (id: number) => {
    try {
      const rank = await rankService.getRank(id);
      const currentRanks = get().ranks;
      const exists = currentRanks.some((r: Rank) => r.id === rank.data.id);
      if (!exists) {
        set({ ranks: [...currentRanks, rank.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить ранг' });
    }
  },

  createRank: async (rankData: RankCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newRank = await rankService.createRank(rankData);
      set({ ranks: [...get().ranks, newRank.data], isLoading: false });
      return newRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать ранг', isLoading: false });
      throw error;
    }
  },

  updateRank: async (id: number, rankData: RankUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRank = await rankService.updateRank(id, rankData);
      set({ 
        ranks: get().ranks.map((r: Rank) => r.id === id ? updatedRank.data : r),
        isLoading: false 
      });
      return updatedRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить ранг', isLoading: false });
      throw error;
    }
  },

  deleteRank: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await rankService.deleteRank(id);
      set({ 
        ranks: get().ranks.filter((r: Rank) => r.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить ранг', isLoading: false });
      throw error;
    }
  },

  addRequiredMissionToRank: async (rankId: number, missionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRank = await rankService.addRequiredMissionToRank(rankId, missionId);
      set({ 
        ranks: get().ranks.map((r: Rank) => r.id === rankId ? updatedRank.data : r),
        isLoading: false 
      });
      return updatedRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить обязательную миссию к рангу', isLoading: false });
      throw error;
    }
  },

  removeRequiredMissionFromRank: async (rankId: number, missionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRank = await rankService.removeRequiredMissionFromRank(rankId, missionId);
      set({ 
        ranks: get().ranks.map((r: Rank) => r.id === rankId ? updatedRank.data : r),
        isLoading: false 
      });
      return updatedRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить обязательную миссию из ранга', isLoading: false });
      throw error;
    }
  },

  addRequiredCompetencyToRank: async (rankId: number, competencyId: number, minLevel: number) => {
    try {
      set({ isLoading: true, error: null });
      const requirementData = { minLevel };
      const updatedRank = await rankService.addRequiredCompetencyToRank(rankId, competencyId, requirementData);
      set({ 
        ranks: get().ranks.map((r: Rank) => r.id === rankId ? updatedRank.data : r),
        isLoading: false 
      });
      return updatedRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить обязательную компетенцию к рангу', isLoading: false });
      throw error;
    }
  },

  removeRequiredCompetencyFromRank: async (rankId: number, competencyId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRank = await rankService.removeRequiredCompetencyFromRank(rankId, competencyId);
      set({ 
        ranks: get().ranks.map((r: Rank) => r.id === rankId ? updatedRank.data : r),
        isLoading: false 
      });
      return updatedRank.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить обязательную компетенцию из ранга', isLoading: false });
      throw error;
    }
  },

  clearRanks: () => {
    set({ ranks: [], isLoading: false, error: null });
  },
}));
