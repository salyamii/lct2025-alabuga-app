import { create } from 'zustand';
import { MissionChain } from '../domain';
import missionChainService from '../api/services/missionChainService';
import { MissionDependencyResponse } from '../api/types/apiTypes';

interface MissionChainState {
  missionChains: MissionChain[];
  isLoading: boolean;
  error: string | null;
}

interface MissionChainActions {
  fetchMissionChains: () => Promise<void>;
  fetchMissionChainById: (id: number) => Promise<void>;
  createMissionChain: (name: string, description: string, rewardXp: number, rewardMana: number) => Promise<void>;
  updateMissionChain: (id: number, name: string, description: string, rewardXp: number, rewardMana: number) => Promise<void>;
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

  createMissionChain: async (name: string, description: string, rewardXp: number, rewardMana: number) => {
    try {
      const chainData = {
        name,
        description,
        rewardXp,
        rewardMana
      };
      const newChain = await missionChainService.createMissionChain(chainData);
      set({ missionChains: [...get().missionChains, newChain.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать цепочку миссий' });
    }
  },

  updateMissionChain: async (id: number, name: string, description: string, rewardXp: number, rewardMana: number) => {
    try {
      const chainData = {
        name,
        description,
        rewardXp,
        rewardMana
      };
      const updatedChain = await missionChainService.updateMissionChain(id, chainData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === id ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить цепочку миссий' });
    }
  },

  deleteMissionChain: async (id: number) => {
    try {
      await missionChainService.deleteMissionChain(id);
      set({ missionChains: get().missionChains.filter((chain: MissionChain) => chain.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить цепочку миссий' });
    }
  },

  addMissionToChain: async (chainId: number, missionId: number) => {
    try {
      const updatedChain = await missionChainService.addMissionToChain(chainId, missionId);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить миссию в цепочку' });
    }
  },

  removeMissionFromChain: async (chainId: number, missionId: number) => {
    try {
      const updatedChain = await missionChainService.removeMissionFromChain(chainId, missionId);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить миссию из цепочки' });
    }
  },

  updateMissionOrderInChain: async (chainId: number, missionId: number, newOrder: number) => {
    try {
      const updatedChain = await missionChainService.updateMissionOrderInChain(chainId, missionId, newOrder);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить порядок миссии в цепочке' });
    }
  },

  addMissionDependency: async (chainId: number, dependencyData: MissionDependencyResponse) => {
    try {
      const updatedChain = await missionChainService.addMissionDependency(chainId, dependencyData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить зависимость между миссиями' });
    }
  },

  removeMissionDependency: async (chainId: number, dependencyData: MissionDependencyResponse) => {
    try {
      const updatedChain = await missionChainService.removeMissionDependency(chainId, dependencyData);
      set({ 
        missionChains: get().missionChains.map((chain: MissionChain) => 
          chain.id === chainId ? updatedChain.data : chain
        ) 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить зависимость между миссиями' });
    }
  },

  clearMissionChains: () => {
    set({ missionChains: [], isLoading: false, error: null });
  },
}));
