import { create } from 'zustand';
import { Mission } from '../domain';
import missionService from '../api/services/missionService';
import { MissionCreateRequest, MissionUpdateRequest } from '../api/types/apiTypes';
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
  createMission: (missionData: MissionCreateRequest) => Promise<Mission>;
  updateMission: (id: number, missionData: MissionUpdateRequest) => Promise<Mission>;
  deleteMission: (id: number) => Promise<void>;
  clearMissions: () => void;
  // Методы для работы с задачами миссии
  addTaskToMission: (missionId: number, taskId: number) => Promise<void>;
  removeTaskFromMission: (missionId: number, taskId: number) => Promise<void>;
  // Методы для работы с наградами компетенций
  addCompetencyRewardToMission: (missionId: number, competencyId: number, levelIncrease: number) => Promise<void>;
  removeCompetencyRewardFromMission: (missionId: number, competencyId: number) => Promise<void>;
  // Методы для работы с наградами навыков
  addSkillRewardToMission: (missionId: number, skillId: number, levelIncrease: number) => Promise<void>;
  removeSkillRewardFromMission: (missionId: number, skillId: number) => Promise<void>;
  // Методы для работы с артефактами
  addArtifactToMission: (missionId: number, artifactId: number) => Promise<void>;
  removeArtifactFromMission: (missionId: number, artifactId: number) => Promise<void>;
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
      set({ isLoading: true, error: null });
      const mission = await missionService.getMission(id);
      const currentMissions = get().missions;
      const exists = currentMissions.some((m: Mission) => m.id === mission.data.id);
      if (!exists) {
        set({ missions: [...currentMissions, mission.data], isLoading: false });
      } else {
        // Обновляем существующую миссию
        set({ 
          missions: currentMissions.map((m: Mission) => m.id === mission.data.id ? mission.data : m),
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить миссию', isLoading: false });
    }
  },

  getMissionsBySeasonId: (seasonId: number) => {
    return get().missions.filter((mission: Mission) => mission.seasonId === seasonId);
  },

  createMission: async (missionData: MissionCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      // Валидируем категорию
      const validCategory = Object.values(MissionCategoryEnum).includes(missionData.category as MissionCategoryEnum) 
        ? missionData.category as MissionCategoryEnum 
        : MissionCategoryEnum.QUEST; // значение по умолчанию
      
      const validatedMissionData = {
        ...missionData,
        category: validCategory
      };
      
      console.log('Отправляем данные миссии:', validatedMissionData);
      
      const newMission = await missionService.createMission(validatedMissionData);
      set({ missions: [...get().missions, newMission.data], isLoading: false });
      return newMission.data;
    } catch (error: any) {
      console.error('Ошибка при создании миссии:', error);
      set({ error: error.message || 'Не удалось создать миссию', isLoading: false });
      throw error; // Пробрасываем ошибку дальше
    }
  },

  updateMission: async (id: number, missionData: MissionUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      // Валидируем категорию
      const validCategory = Object.values(MissionCategoryEnum).includes(missionData.category as MissionCategoryEnum) 
        ? missionData.category as MissionCategoryEnum 
        : MissionCategoryEnum.QUEST;
      
      const validatedMissionData = {
        ...missionData,
        category: validCategory
      };
      
      const updatedMission = await missionService.updateMission(id, validatedMissionData);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === id ? updatedMission.data : m),
        isLoading: false 
      });
      return updatedMission.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить миссию', isLoading: false });
      throw error;
    }
  },

  deleteMission: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await missionService.deleteMission(id);
      set({ 
        missions: get().missions.filter((m: Mission) => m.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить миссию', isLoading: false });
      throw error;
    }
  },

  clearMissions: () => {
    set({ missions: [], isLoading: false, error: null });
  },

  // Методы для работы с задачами миссии
  addTaskToMission: async (missionId: number, taskId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.addTaskToMission(missionId, taskId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить задачу к миссии', isLoading: false });
      throw error;
    }
  },

  removeTaskFromMission: async (missionId: number, taskId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.removeTaskFromMission(missionId, taskId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить задачу из миссии', isLoading: false });
      throw error;
    }
  },

  // Методы для работы с наградами компетенций
  addCompetencyRewardToMission: async (missionId: number, competencyId: number, levelIncrease: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.addCompetencyRewardToMission(missionId, competencyId, { levelIncrease });
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить награду компетенции к миссии', isLoading: false });
      throw error;
    }
  },

  removeCompetencyRewardFromMission: async (missionId: number, competencyId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.removeCompetencyRewardFromMission(missionId, competencyId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить награду компетенции из миссии', isLoading: false });
      throw error;
    }
  },

  // Методы для работы с наградами навыков
  addSkillRewardToMission: async (missionId: number, skillId: number, levelIncrease: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.addSkillRewardToMission(missionId, skillId, { levelIncrease });
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить награду навыка к миссии', isLoading: false });
      throw error;
    }
  },

  removeSkillRewardFromMission: async (missionId: number, skillId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.removeSkillRewardFromMission(missionId, skillId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить награду навыка из миссии', isLoading: false });
      throw error;
    }
  },

  // Методы для работы с артефактами
  addArtifactToMission: async (missionId: number, artifactId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.addArtifactToMission(missionId, artifactId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось добавить артефакт к миссии', isLoading: false });
      throw error;
    }
  },

  removeArtifactFromMission: async (missionId: number, artifactId: number) => {
    try {
      set({ isLoading: true, error: null });
      const updatedMission = await missionService.removeArtifactFromMission(missionId, artifactId);
      set({ 
        missions: get().missions.map((m: Mission) => m.id === missionId ? updatedMission.data : m),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить артефакт из миссии', isLoading: false });
      throw error;
    }
  },
}));
