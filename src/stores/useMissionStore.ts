import { create } from 'zustand';
import { Mission } from '../domain';
import missionService from '../api/services/missionService';
import { MissionCategoryEnum } from '../api/types/apiTypes';

interface MissionState {
  missions: Mission[];
  isLoading: boolean;
  error: string | null;
}

interface MissionActions {
  fetchMissions: () => Promise<void>;
  fetchMissionById: (id: number) => Promise<void>;
  getMissionsBySeasonId: (seasonId: number) => Mission[];
  createMission: (mission: Mission) => Promise<void>;
  updateMission: (mission: Mission) => Promise<void>;
  deleteMission: (id: number) => Promise<void>;
  clearMissions: () => void;
}

export const useMissionStore = create<MissionState & MissionActions>((set: (partial: Partial<MissionState & MissionActions>) => void, get: () => MissionState & MissionActions) => ({
  missions: [],
  isLoading: false,
  error: null,

  fetchMissions: async () => {
    try {
      set({ isLoading: true, error: null });
      const missions = await missionService.getMissions();
      set({ missions: missions.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить миссии', isLoading: false });
    }
  },

  fetchMissionById: async (id: number) => {
    try {
      const mission = await missionService.getMission(id);
      const currentMissions = get().missions;
      const exists = currentMissions.some((m: Mission) => m.id === mission.data.id);
      if (!exists) {
        set({ missions: [...currentMissions, mission.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить миссию' });
    }
  },

  getMissionsBySeasonId: (seasonId: number) => {
    return get().missions.filter((mission: Mission) => mission.seasonId === seasonId);
  },

  createMission: async (mission: Mission) => {
    try {
      const missionData = {
        title: mission.title,
        description: mission.description,
        rewardXp: mission.rewardXp,
        rewardMana: mission.rewardMana,
        rankRequirement: mission.rankRequirement,
        seasonId: mission.seasonId,
        category: mission.category as MissionCategoryEnum
      };
      const newMission = await missionService.createMission(missionData);
      set({ missions: [...get().missions, newMission.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать миссию' });
    }
  },

  updateMission: async (mission: Mission) => {
    try {
      const missionData = {
        title: mission.title,
        description: mission.description,
        rewardXp: mission.rewardXp,
        rewardMana: mission.rewardMana,
        rankRequirement: mission.rankRequirement,
        seasonId: mission.seasonId,
        category: mission.category as MissionCategoryEnum
      };
      const updatedMission = await missionService.updateMission(mission.id, missionData);
      set({ missions: get().missions.map((m: Mission) => m.id === mission.id ? updatedMission.data : m) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить миссию' });
    }
  },

  deleteMission: async (id: number) => {
    try {
      await missionService.deleteMission(id);
      set({ missions: get().missions.filter((m: Mission) => m.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить миссию' });
    }
  },

  clearMissions: () => {
    set({ missions: [], isLoading: false, error: null });
  },
}));
