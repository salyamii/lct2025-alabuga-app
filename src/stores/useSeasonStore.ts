import { create } from 'zustand';
import { Season } from '../domain';
import seasonService from '../api/services/seasonService';

interface SeasonState {
  seasons: Season[];
  isLoading: boolean;
  error: string | null;
}

interface SeasonActions {
  fetchSeasons: () => Promise<void>;
  fetchSeasonById: (id: number) => Promise<void>;
  createSeason: (season: Season) => Promise<void>;
  updateSeason: (season: Season) => Promise<void>;
  deleteSeason: (id: number) => Promise<void>;
  clearSeasons: () => void;
}

export const useSeasonStore = create<SeasonState & SeasonActions>((set: (partial: Partial<SeasonState & SeasonActions>) => void, get: () => SeasonState & SeasonActions) => ({
  seasons: [],
  isLoading: false,
  error: null,

  fetchSeasons: async () => {
    try {
      set({ isLoading: true, error: null });
      const seasons = await seasonService.getSeasons();
      set({ seasons: seasons.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить сезоны', isLoading: false });
    }
  },

  fetchSeasonById: async (id: number) => {
    try {
      const season = await seasonService.getSeason(id);
      const currentSeasons = get().seasons;
      const exists = currentSeasons.some((s: Season) => s.id === season.data.id);
      if (!exists) {
        set({ seasons: [...currentSeasons, season.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить сезон' });
    }
  },

  createSeason: async (season: Season) => {
    try {
      const seasonData = Season.toCreateRequest(season);
      const newSeason = await seasonService.createSeason(seasonData);
      set({ seasons: [...get().seasons, newSeason.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать сезон' });
    }
  },

  updateSeason: async (season: Season) => {
    try {
      const seasonData = Season.toUpdateRequest(season);
      const updatedSeason = await seasonService.updateSeason(season.id, seasonData);
      set({ seasons: get().seasons.map((s: Season) => s.id === season.id ? updatedSeason.data : s) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить сезон' });
    }
  },

  deleteSeason: async (id: number) => {
    try {
      await seasonService.deleteSeason(id);
      set({ seasons: get().seasons.filter((s: Season) => s.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить сезон' });
    }
  },

  clearSeasons: () => {
    set({ seasons: [], isLoading: false, error: null });
  },
}));
