import { create } from 'zustand';
import { Season } from '../domain';
import seasonService from '../api/services/seasonService';
import { SeasonCreateRequest, SeasonUpdateRequest } from '../api/types/apiTypes';

interface SeasonState {
  seasons: Season[];
  currentSeason: Season | null;
  isLoading: boolean;
  error: string | null;
}

interface SeasonActions {
  fetchSeasons: () => Promise<void>;
  fetchSeasonById: (id: number) => Promise<void>;
  createSeason: (seasonData: SeasonCreateRequest) => Promise<Season>;
  updateSeason: (id: number, seasonData: SeasonUpdateRequest) => Promise<Season>;
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

  createSeason: async (seasonData: SeasonCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newSeason = await seasonService.createSeason(seasonData);
      const updatedSeasons = [...get().seasons, newSeason.data];
      set({ 
        seasons: updatedSeasons,
        currentSeason: updatedSeasons.length === 1 ? newSeason.data : get().currentSeason,
        isLoading: false
      });
      return newSeason.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать сезон', isLoading: false });
      throw error;
    }
  },

  updateSeason: async (id: number, seasonData: SeasonUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      // Проверяем, существует ли сезон в сторе
      const existingSeason = get().seasons.find((s: Season) => s.id === id);
      if (!existingSeason) {
        throw new Error(`Сезон с ID ${id} не найден в локальном хранилище`);
      }
      
      const updatedSeason = await seasonService.updateSeason(id, seasonData);
      const prevCurrentSeason = get().currentSeason;
      
      // Заменяем сезон в массиве seasons
      const updatedSeasons = get().seasons.map((s: Season) => 
        s.id === id ? updatedSeason.data : s
      );
      
      set({ 
        seasons: updatedSeasons,
        currentSeason: (prevCurrentSeason && prevCurrentSeason.id === id) ? updatedSeason.data : prevCurrentSeason,
        isLoading: false
      });
      
      return updatedSeason.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить сезон', isLoading: false });
      throw error;
    }
  },

  deleteSeason: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await seasonService.deleteSeason(id);
      const filteredSeasons = get().seasons.filter((s: Season) => s.id !== id);
      const prevCurrentSeason = get().currentSeason;
      let newCurrentSeason: Season | null = prevCurrentSeason;
      if (prevCurrentSeason && prevCurrentSeason.id === id) {
        newCurrentSeason = filteredSeasons.length > 0 ? filteredSeasons[0] : null;
      }
      set({ 
        seasons: filteredSeasons,
        currentSeason: newCurrentSeason,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить сезон', isLoading: false });
      throw error;
    }
  },

  clearSeasons: () => {
    set({ seasons: [], isLoading: false, error: null, currentSeason: null });
  },
}));
