import { create } from 'zustand';
import { MissionChain } from '../domain';
import missionChainService from '../api/services/missionChainService';
import { MissionDependencyResponse, MissionChainCreateRequest, MissionChainUpdateRequest } from '../api/types/apiTypes';

interface MissionChainState {
  missionChains: MissionChain[];
  isLoading: boolean;
  error: string | null;
}

interface MissionChainActions {
  fetchMissionChains: () => Promise<void>;
  fetchMissionChainById: (id: number) => Promise<void>;
  createMissionChain: (chainData: MissionChainCreateRequest) => Promise<MissionChain>;
  updateMissionChain: (id: number, chainData: MissionChainUpdateRequest) => Promise<MissionChain>;
  deleteMissionChain: (id: number) => Promise<void>;
  addMissionToChain: (chainId: number, missionId: number) => Promise<void>;
  removeMissionFromChain: (chainId: number, missionId: number) => Promise<void>;
  updateMissionOrderInChain: (chainId: number, missionId: number, newOrder: number) => Promise<void>;
  addMissionDependency: (chainId: number, dependencyData: MissionDependencyResponse) => Promise<void>;
  removeMissionDependency: (chainId: number, dependencyData: MissionDependencyResponse) => Promise<void>;
  clearMissionChains: () => void;
}

export const useMissionChainStore = create<MissionChainState & MissionChainActions>((set: (partial: Partial<MissionChainState & MissionChainActions>) => void, get: () => MissionChainState & MissionChainActions) => ({
  missionChains: [],
  isLoading: false,
  error: null,

  fetchMissionChains: async () => {
    try {
      set({ isLoading: true, error: null });
      const missionChains = await missionChainService.getMissionChains();
      set({ missionChains: missionChains.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить цепочки миссий', isLoading: false });
    }
  },

  fetchMissionChainById: async (id: number) => {
    try {
      const missionChain = await missionChainService.getMissionChain(id);
      const currentChains = get().missionChains;
      const exists = currentChains.some((chain: MissionChain) => chain.id === missionChain.data.id);
      if (!exists) {
        set({ missionChains: [...currentChains, missionChain.data] });
      } else {
        // Обновляем существующую цепочку
        set({ 
          missionChains: currentChains.map((chain: MissionChain) => 
            chain.id === missionChain.data.id ? missionChain.data : chain
          ) 
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить цепочку миссий' });
    }
  },

  createMissionChain: async (chainData: MissionChainCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newChain = await missionChainService.createMissionChain(chainData);
      set({ missionChains: [...get().missionChains, newChain.data], isLoading: false });
      return newChain.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать цепочку миссий', isLoading: false });
      throw error;
    }
  },

  updateMissionChain: async (id: number, chainData: MissionChainUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.updateMissionChain(id, chainData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === id ? updatedChain.data : chain
        ),
        isLoading: false 
      });
      return updatedChain.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить цепочку миссий', isLoading: false });
      throw error;
    }
  },

  deleteMissionChain: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await missionChainService.deleteMissionChain(id);
      set({ 
        missionChains: get().missionChains.filter((chain: MissionChain) => chain.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить цепочку миссий', isLoading: false });
      throw error;
    }
  },

  addMissionToChain: async (chainId: number, missionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.addMissionToChain(chainId, missionId);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить миссию в цепочку', isLoading: false });
      throw error;
    }
  },

  removeMissionFromChain: async (chainId: number, missionId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.removeMissionFromChain(chainId, missionId);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить миссию из цепочки', isLoading: false });
      throw error;
    }
  },

  updateMissionOrderInChain: async (chainId: number, missionId: number, newOrder: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.updateMissionOrderInChain(chainId, missionId, newOrder);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить порядок миссии в цепочке', isLoading: false });
      throw error;
    }
  },

  addMissionDependency: async (chainId: number, dependencyData: MissionDependencyResponse) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.addMissionDependency(chainId, dependencyData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить зависимость между миссиями', isLoading: false });
      throw error;
    }
  },

  removeMissionDependency: async (chainId: number, dependencyData: MissionDependencyResponse) => {
    try {
      set({ isLoading: true, error: null });
      const updatedChain = await missionChainService.removeMissionDependency(chainId, dependencyData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить зависимость между миссиями', isLoading: false });
      throw error;
    }
  },

  clearMissionChains: () => {
    set({ missionChains: [], isLoading: false, error: null });
  },
}));
