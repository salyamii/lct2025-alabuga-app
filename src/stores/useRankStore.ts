import { create } from 'zustand';
import { Rank } from '../domain';
import rankService from '../api/services/rankService';

interface RankState {
  ranks: Rank[];
  isLoading: boolean;
  error: string | null;
}

interface RankActions {
  fetchRanks: () => Promise<void>;
  fetchRankById: (id: number) => Promise<void>;
  createRank: (rank: Rank) => Promise<void>;
  updateRank: (rank: Rank) => Promise<void>;
  deleteRank: (id: number) => Promise<void>;
}

export const useRankStore = create<RankState & RankActions>((set, get) => ({
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
      const exists = currentRanks.some(r => r.id === rank.data.id);
      if (!exists) {
        set({ ranks: [...currentRanks, rank.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить ранг' });
    }
  },

  createRank: async (rank: Rank) => {
    try {
      const rankData = {
        name: rank.name,
        requiredXp: rank.requiredXp
      };
      const newRank = await rankService.createRank(rankData);
      set({ ranks: [...get().ranks, newRank.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать ранг' });
    }
  },

  updateRank: async (rank: Rank) => {
    try {
      const rankData = {
        name: rank.name,
        requiredXp: rank.requiredXp
      };
      const updatedRank = await rankService.updateRank(rank.id, rankData);
      set({ ranks: get().ranks.map(r => r.id === rank.id ? updatedRank.data : r) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить ранг' });
    }
  },

  deleteRank: async (id: number) => {
    try {
      await rankService.deleteRank(id);
      set({ ranks: get().ranks.filter(r => r.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить ранг' });
    }
  },
}));
