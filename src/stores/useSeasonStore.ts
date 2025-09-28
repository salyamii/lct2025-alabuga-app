import { create } from 'zustand';
import { Season } from '../domain';
import seasonService from '../api/services/seasonService';

interface SeasonState {
  seasons: Season[];
  currentSeason: Season | null;
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
  setCurrentSeason: (season: Season | null) => void;
}

export const useSeasonStore = create<SeasonState & SeasonActions>((set: (partial: Partial<SeasonState & SeasonActions>) => void, get: () => SeasonState & SeasonActions) => ({
  seasons: [],
  currentSeason: null,
  isLoading: false,
  error: null,

  setCurrentSeason: (season: Season | null) => {
    set({ currentSeason: season });
  },

  fetchSeasons: async () => {
    try {
      set({ isLoading: true, error: null });
      const seasons = await seasonService.getSeasons();
      set({ 
        seasons: seasons.data,
        currentSeason: seasons.data.length > 0 ? seasons.data[0] : null
      });
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
        const newSeasons = [...currentSeasons, season.data];
        set({ 
          seasons: newSeasons,
          currentSeason: newSeasons.length === 1 ? season.data : get().currentSeason
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить сезон' });
    }
  },

  createSeason: async (season: Season) => {
    try {
      const seasonData = Season.toCreateRequest(season);
      const newSeason = await seasonService.createSeason(seasonData);
      const updatedSeasons = [...get().seasons, newSeason.data];
      set({ 
        seasons: updatedSeasons,
        currentSeason: updatedSeasons.length === 1 ? newSeason.data : get().currentSeason
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать сезон' });
    }
  },

  updateSeason: async (season: Season) => {
    try {
      const seasonData = Season.toUpdateRequest(season);
      const updatedSeason = await seasonService.updateSeason(season.id, seasonData);
      const prevCurrentSeason = get().currentSeason;
      set({ 
        seasons: get().seasons.map((s: Season) => s.id === season.id ? updatedSeason.data : s),
        currentSeason: (prevCurrentSeason && prevCurrentSeason.id === season.id) ? updatedSeason.data : prevCurrentSeason
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить сезон' });
    }
  },

  deleteSeason: async (id: number) => {
    try {
      await seasonService.deleteSeason(id);
      const filteredSeasons = get().seasons.filter((s: Season) => s.id !== id);
      const prevCurrentSeason = get().currentSeason;
      let newCurrentSeason: Season | null = prevCurrentSeason;
      if (prevCurrentSeason && prevCurrentSeason.id === id) {
        newCurrentSeason = filteredSeasons.length > 0 ? filteredSeasons[0] : null;
      }
      set({ 
        seasons: filteredSeasons,
        currentSeason: newCurrentSeason
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить сезон' });
    }
  },

  clearSeasons: () => {
    set({ seasons: [], isLoading: false, error: null, currentSeason: null });
  },
}));
