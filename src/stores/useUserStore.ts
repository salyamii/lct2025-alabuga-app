import { create } from 'zustand';
import { User, UserTask, UserMission, UserCompetency, UserSkill } from '../domain';
import userService from '../api/services/userService';
import { useRankStore } from './useRankStore';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserProfile: () => Promise<void>;
  fetchUserMission: (missionId: number) => Promise<void>;
  fetchAllUserMissions: (missionIds: number[]) => Promise<void>;
  clearUserData: () => void;
  updateUser: (user: User) => void;
  // Методы для управления выполнением задач и миссий (локально)
  completeTask: (missionId: number, taskId: number) => void;
  uncompleteTask: (missionId: number, taskId: number) => void;
  completeMission: (missionId: number) => void;
  uncompleteMission: (missionId: number) => void;
}

export const useUserStore = create<UserState & UserActions>((set: (partial: Partial<UserState & UserActions>) => void, get: () => UserState & UserActions) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      console.log('📥 Fetching user profile...');
      set({ isLoading: true, error: null });
      const response = await userService.getProfile();
      console.log('📦 Profile response:', response.data);
      const user = User.fromResponse(response.data);
      console.log('✅ User created:', {
        login: user.login,
        fullName: user.fullName,
        missions: user.missions.length
      });
      set({ user, isLoading: false });
    } catch (error: any) {
      console.error('❌ Error fetching profile:', error);
      set({ error: error.message || 'Не удалось получить профиль пользователя', isLoading: false });
    }
  },

  // Загрузить миссию пользователя с сервера
  fetchUserMission: async (missionId: number) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      const response = await userService.getUserMission(missionId);
      const userMissionData = response.data;

      // Создаем UserMission из ответа сервера
      const newUserMission = UserMission.fromResponse(userMissionData);

      // Обновляем или добавляем миссию в user.missions
      const existingIndex = currentUser.missions.findIndex(m => m.id === missionId);
      let updatedMissions = [...currentUser.missions];

      if (existingIndex >= 0) {
        updatedMissions[existingIndex] = newUserMission;
      } else {
        updatedMissions.push(newUserMission);
      }

      const updatedUser = new User(
        currentUser.login,
        currentUser.firstName,
        currentUser.lastName,
        currentUser.role,
        currentUser.rankId,
        currentUser.xp,
        currentUser.mana,
        updatedMissions,
        currentUser.artifacts,
        currentUser.competencies
      );

      set({ user: updatedUser });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить миссию пользователя' });
    }
  },

  // Загрузить все миссии пользователя по списку ID
  fetchAllUserMissions: async (missionIds: number[]) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      // Загружаем все миссии параллельно
      const missionPromises = missionIds.map(id => userService.getUserMission(id));
      const responses = await Promise.allSettled(missionPromises);

      // Собираем успешно загруженные миссии
      const userMissions: UserMission[] = [];
      responses.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const userMission = UserMission.fromResponse(result.value.data);
          userMissions.push(userMission);
        } else {
          console.error(`Не удалось загрузить миссию ${missionIds[index]}:`, result.reason);
        }
      });

      // Обновляем user.missions (заменяем все миссии на загруженные)
      const updatedUser = new User(
        currentUser.login,
        currentUser.firstName,
        currentUser.lastName,
        currentUser.role,
        currentUser.rankId,
        currentUser.xp,
        currentUser.mana,
        userMissions,
        currentUser.artifacts,
        currentUser.competencies
      );

      set({ user: updatedUser });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось загрузить миссии пользователя' });
    }
  },

  clearUserData: () => {
    set({ user: null, error: null });
  },

  updateUser: (user: User) => {
    set({ user });
  },

  // Пометить задачу как выполненную
  completeTask: (missionId: number, taskId: number) => {
    const currentUser = get().user;
    if (!currentUser) {
      console.error('❌ No user found');
      return;
    }

    let updatedMissions = [...currentUser.missions];
    const missionIndex = updatedMissions.findIndex(m => m.id === missionId);

    console.log('📝 Completing task:', {
      missionId,
      taskId,
      missionIndex,
      totalMissions: updatedMissions.length
    });

    if (missionIndex >= 0) {
      // Миссия уже есть - обновляем задачу
      const mission = updatedMissions[missionIndex];
      const updatedTasks = mission.tasks.map(task => 
        task.id === taskId 
          ? new UserTask(task.id, task.title, task.description, true)
          : task
      );

      console.log('✅ Task updated:', {
        taskId,
        newStatus: true,
        tasksCount: updatedTasks.length
      });

      updatedMissions[missionIndex] = new UserMission(
        mission.id,
        mission.title,
        mission.description,
        mission.rewardXp,
        mission.rewardMana,
        mission.rankRequirement,
        mission.seasonId,
        mission.category,
        mission.isCompleted,
        updatedTasks,
        mission.rewardArtifacts,
        mission.rewardCompetencies,
        mission.rewardSkills
      );
    } else {
      console.error('❌ Mission not found in user.missions:', missionId);
    }

    const updatedUser = new User(
      currentUser.login,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.role,
      currentUser.rankId,
      currentUser.xp,
      currentUser.mana,
      updatedMissions,
      currentUser.artifacts,
      currentUser.competencies
    );

    set({ user: updatedUser });
    console.log('✅ User updated in store');
  },

  // Отменить выполнение задачи
  uncompleteTask: (missionId: number, taskId: number) => {
    const currentUser = get().user;
    if (!currentUser) return;

    let updatedMissions = [...currentUser.missions];
    const missionIndex = updatedMissions.findIndex(m => m.id === missionId);

    if (missionIndex >= 0) {
      const mission = updatedMissions[missionIndex];
      const updatedTasks = mission.tasks.map(task => 
        task.id === taskId 
          ? new UserTask(task.id, task.title, task.description, false)
          : task
      );

      updatedMissions[missionIndex] = new UserMission(
        mission.id,
        mission.title,
        mission.description,
        mission.rewardXp,
        mission.rewardMana,
        mission.rankRequirement,
        mission.seasonId,
        mission.category,
        mission.isCompleted,
        updatedTasks,
        mission.rewardArtifacts,
        mission.rewardCompetencies,
        mission.rewardSkills
      );
    }

    const updatedUser = new User(
      currentUser.login,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.role,
      currentUser.rankId,
      currentUser.xp,
      currentUser.mana,
      updatedMissions,
      currentUser.artifacts,
      currentUser.competencies
    );

    set({ user: updatedUser });
  },

  // Завершить миссию с начислением наград
  completeMission: (missionId: number) => {
    const currentUser = get().user;
    if (!currentUser) return;

    let updatedMissions = [...currentUser.missions];
    const missionIndex = updatedMissions.findIndex(m => m.id === missionId);

    if (missionIndex < 0) {
      console.error('❌ Mission not found for completion:', missionId);
      return;
    }

    const mission = updatedMissions[missionIndex];
    
    // Помечаем миссию как завершенную
    updatedMissions[missionIndex] = new UserMission(
      mission.id,
      mission.title,
      mission.description,
      mission.rewardXp,
      mission.rewardMana,
      mission.rankRequirement,
      mission.seasonId,
      mission.category,
      true, // isCompleted = true
      mission.tasks,
      mission.rewardArtifacts,
      mission.rewardCompetencies,
      mission.rewardSkills
    );

    // Начисляем XP и Ману
    const newXP = currentUser.xp + mission.rewardXp;
    const newMana = currentUser.mana + mission.rewardMana;

    console.log('💰 Награды начислены:', {
      xp: `+${mission.rewardXp} (${currentUser.xp} → ${newXP})`,
      mana: `+${mission.rewardMana} (${currentUser.mana} → ${newMana})`
    });

    // Обновляем компетенции пользователя
    let updatedCompetencies = [...currentUser.competencies];

    mission.rewardCompetencies.forEach(compReward => {
      const compIndex = updatedCompetencies.findIndex(c => c.id === compReward.competency.id);
      
      if (compIndex >= 0) {
        const competency = updatedCompetencies[compIndex];
        const newLevel = Math.min(competency.userLevel + compReward.levelIncrease, competency.maxLevel);
        
        console.log(`📈 Компетенция "${competency.name}": +${compReward.levelIncrease} (${competency.userLevel} → ${newLevel})`);

        updatedCompetencies[compIndex] = new UserCompetency(
          competency.id,
          competency.name,
          competency.maxLevel,
          newLevel,
          competency.skills
        );
      }
    });

    // Обновляем навыки в компетенциях
    mission.rewardSkills.forEach(skillReward => {
      // Ищем компетенцию, которая содержит этот навык
      updatedCompetencies = updatedCompetencies.map(competency => {
        const skillIndex = competency.skills.findIndex(s => s.id === skillReward.skill.id);
        
        if (skillIndex >= 0) {
          const skill = competency.skills[skillIndex];
          const newLevel = Math.min(skill.userLevel + skillReward.levelIncrease, skill.maxLevel);
          
          console.log(`📊 Навык "${skill.name}" в компетенции "${competency.name}": +${skillReward.levelIncrease} (${skill.userLevel} → ${newLevel})`);

          const updatedSkills = [...competency.skills];
          updatedSkills[skillIndex] = new UserSkill(
            skill.id,
            skill.name,
            skill.maxLevel,
            newLevel
          );

          return new UserCompetency(
            competency.id,
            competency.name,
            competency.maxLevel,
            competency.userLevel,
            updatedSkills
          );
        }
        
        return competency;
      });
    });

    // Добавляем новые артефакты (только уникальные)
    const updatedArtifacts = [...currentUser.artifacts];
    mission.rewardArtifacts.forEach(artifact => {
      const alreadyHas = updatedArtifacts.some(a => a.id === artifact.id);
      if (!alreadyHas) {
        updatedArtifacts.push(artifact);
        console.log(`🏆 Получен артефакт: "${artifact.title}"`);
      } else {
        console.log(`ℹ️ Артефакт "${artifact.title}" уже в коллекции`);
      }
    });

    // Проверяем повышение ранга на основе нового XP
    const ranks = useRankStore.getState().ranks;
    let newRankId = currentUser.rankId;
    
    if (ranks.length > 0) {
      // Находим все доступные ранги для текущего XP
      const availableRanks = ranks.filter(rank => rank.requiredXp <= newXP);
      
      if (availableRanks.length > 0) {
        // Находим самый высокий ранг (с максимальным requiredXp)
        const highestRank = availableRanks.reduce((prev, current) => 
          (current.requiredXp > prev.requiredXp) ? current : prev
        );
        
        // Проверяем, повысился ли ранг
        if (highestRank.id !== currentUser.rankId) {
          newRankId = highestRank.id;
          console.log(`⬆️ ПОВЫШЕНИЕ РАНГА! "${ranks.find(r => r.id === currentUser.rankId)?.name || 'Unknown'}" → "${highestRank.name}"`);
        }
      }
    }

    const updatedUser = new User(
      currentUser.login,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.role,
      newRankId,
      newXP,
      newMana,
      updatedMissions,
      updatedArtifacts,
      updatedCompetencies
    );

    set({ user: updatedUser });
    
    console.log('✅ Миссия завершена и награды начислены!');
  },

  // Отменить выполнение миссии (и всех задач)
  uncompleteMission: (missionId: number) => {
    const currentUser = get().user;
    if (!currentUser) return;

    let updatedMissions = [...currentUser.missions];
    const missionIndex = updatedMissions.findIndex(m => m.id === missionId);

    if (missionIndex >= 0) {
      const mission = updatedMissions[missionIndex];
      
      // Переводим все задачи в незавершенное состояние
      const updatedTasks = mission.tasks.map(task => 
        new UserTask(task.id, task.title, task.description, false)
      );

      updatedMissions[missionIndex] = new UserMission(
        mission.id,
        mission.title,
        mission.description,
        mission.rewardXp,
        mission.rewardMana,
        mission.rankRequirement,
        mission.seasonId,
        mission.category,
        false, // isCompleted = false
        updatedTasks,
        mission.rewardArtifacts,
        mission.rewardCompetencies,
        mission.rewardSkills
      );
    }

    const updatedUser = new User(
      currentUser.login,
      currentUser.firstName,
      currentUser.lastName,
      currentUser.role,
      currentUser.rankId,
      currentUser.xp,
      currentUser.mana,
      updatedMissions,
      currentUser.artifacts,
      currentUser.competencies
    );

    set({ user: updatedUser });
  },
}));
