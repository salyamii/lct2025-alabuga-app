import { create } from 'zustand';
import { User, UserTask, UserMission, UserCompetency, UserSkill } from '../domain';
import userService from '../api/services/userService';
import { useRankStore } from './useRankStore';

interface UserState {
  user: User | null;
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserProfile: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  fetchUser: (userLogin: string) => Promise<User | null>;
  updateUserProfile: (userData: any) => Promise<void>;
  updateUserByLogin: (userLogin: string, userData: any) => Promise<void>;
  fetchUserMission: (missionId: number) => Promise<void>;
  fetchAllUserMissions: (missionIds: number[]) => Promise<void>;
  fetchUserMissionsByLogin: (userLogin: string) => Promise<UserMission[]>;
  approveUserMission: (missionId: number, userLogin: string) => Promise<void>;
  addArtifactToUser: (userLogin: string, artifactId: number) => Promise<void>;
  removeArtifactFromUser: (userLogin: string, artifactId: number) => Promise<void>;
  addCompetencyToUser: (userLogin: string, competencyId: number, level?: number) => Promise<void>;
  updateUserCompetencyLevel: (userLogin: string, competencyId: number, level: number) => Promise<void>;
  removeCompetencyFromUser: (userLogin: string, competencyId: number) => Promise<void>;
  addSkillToUser: (userLogin: string, competencyId: number, skillId: number, level?: number) => Promise<void>;
  updateUserSkillLevel: (userLogin: string, competencyId: number, skillId: number, level: number) => Promise<void>;
  removeSkillFromUser: (userLogin: string, competencyId: number, skillId: number) => Promise<void>;
  completeTask: (taskId: number) => Promise<void>;
  clearUserData: () => void;
  updateUser: (user: User) => void;
  // Методы для управления выполнением задач и миссий (локально)
  completeTaskLocal: (missionId: number, taskId: number) => void;
  uncompleteTask: (missionId: number, taskId: number) => void;
  completeMission: (missionId: number) => void;
  uncompleteMission: (missionId: number) => void;
}

export const useUserStore = create<UserState & UserActions>((set: (partial: Partial<UserState & UserActions>) => void, get: () => UserState & UserActions) => ({
  user: null,
  allUsers: [],
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      console.log('📥 Fetching user profile...');
      set({ isLoading: true, error: null });
      const response = await userService.getProfile();
      console.log('📦 Profile response:', response.data);
      const user = User.fromDetailedResponse(response.data);
      console.log('✅ User created:', {
        login: user.login,
        fullName: user.fullName,
        rankId: user.rankId,
        xp: user.xp,
        mana: user.mana,
        artifacts: user.artifacts.length,
        competencies: user.competencies.length
      });
      set({ user, isLoading: false });
    } catch (error: any) {
      console.error('❌ Error fetching profile:', error);
      set({ error: error.message || 'Не удалось получить профиль пользователя', isLoading: false });
    }
  },

  // Загрузить всех пользователей (только для HR)
  fetchAllUsers: async () => {
    try {
      const currentUser = get().user;
      if (!currentUser || currentUser.role !== 'hr') {
        console.log('🔒 Доступ к списку пользователей запрещен (только для HR)');
        return;
      }

      console.log('📥 Fetching all users...');
      const response = await userService.getUsers();
      const users = response.data.users?.map(userData => User.fromResponse(userData)) || [];
      console.log(`✅ Loaded ${users.length} users`);
      set({ allUsers: users });
    } catch (error: any) {
      console.error('❌ Error fetching all users:', error);
      set({ error: error.message || 'Не удалось получить список пользователей' });
    }
  },

  // Загрузить конкретного пользователя по логину
  fetchUser: async (userLogin: string): Promise<User | null> => {
    try {
      const response = await userService.getUser(userLogin);
      const user = User.fromDetailedResponse(response.data);
      console.log('✅ User loaded:', user);
      return user;
    } catch (error: any) {
      set({ error: error.message || `Не удалось получить данные пользователя ${userLogin}` });
      return null;
    }
  },

  // Обновить профиль пользователя
  updateUserProfile: async (userData: any) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      console.log('📝 Updating user profile...');
      const response = await userService.updateUser(currentUser.login, userData);
      const updatedUser = User.fromResponse(response.data);
      
      // Обновляем текущего пользователя с новыми данными
      const userWithMissions = new User(
        updatedUser.login,
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.role,
        currentUser.rankId,
        currentUser.xp,
        currentUser.mana,
        currentUser.missions,
        currentUser.artifacts,
        currentUser.competencies
      );
      
      set({ user: userWithMissions });
      console.log('✅ User profile updated');
    } catch (error: any) {
      console.error('❌ Error updating user profile:', error);
      set({ error: error.message || 'Не удалось обновить профиль пользователя' });
    }
  },

  // Обновить пользователя по логину (для HR/Admin)
  updateUserByLogin: async (userLogin: string, userData: any) => {
    try {
      await userService.updateUser(userLogin, userData);
      
      // Если обновляем текущего пользователя, обновляем локальный стор
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      // Если обновляем пользователя из списка allUsers, обновляем его там
      const allUsers = get().allUsers;
      if (allUsers.some(u => u.login === userLogin)) {
        await get().fetchAllUsers();
      }
      
    } catch (error: any) {
      set({ error: error.message || `Не удалось обновить данные пользователя ${userLogin}` });
      throw error;
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

  // Загрузить миссии пользователя по логину
  fetchUserMissionsByLogin: async (userLogin: string) => {
    try {
      console.log(`📥 Fetching missions for user: ${userLogin}`);
      const response = await userService.getUserMissionsByLogin(userLogin);
      const userMissions = response.data.missions?.map(missionData => UserMission.fromResponse(missionData)) || [];
      console.log(`✅ Loaded ${userMissions.length} missions for user ${userLogin}`);
      return userMissions;
    } catch (error: any) {
      console.error(`❌ Error fetching missions for user ${userLogin}:`, error);
      set({ error: error.message || `Не удалось получить миссии пользователя ${userLogin}` });
      return [];
    }
  },

  // Одобрить миссию пользователя (только для HR)
  approveUserMission: async (missionId: number, userLogin: string) => {
    try {
      const currentUser = get().user;
      if (!currentUser || currentUser.role !== 'HR') {
        console.log('🔒 Доступ к одобрению миссий запрещен (только для HR)');
        return;
      }

      console.log(`✅ Approving mission ${missionId} for user ${userLogin}`);
      await userService.approveUserMission(missionId, userLogin);
      console.log('✅ Mission approved successfully');
    } catch (error: any) {
      console.error('❌ Error approving mission:', error);
      set({ error: error.message || 'Не удалось одобрить миссию' });
    }
  },

  // Добавить артефакт пользователю
  addArtifactToUser: async (userLogin: string, artifactId: number) => {
    try {
      console.log(`🏆 Adding artifact ${artifactId} to user ${userLogin}`);
      await userService.addArtifactToUser(userLogin, artifactId);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        // Перезагружаем профиль для получения обновленных данных
        await get().fetchUserProfile();
      }
      
      console.log('✅ Artifact added successfully');
    } catch (error: any) {
      console.error('❌ Error adding artifact:', error);
      set({ error: error.message || 'Не удалось добавить артефакт' });
    }
  },

  // Удалить артефакт у пользователя
  removeArtifactFromUser: async (userLogin: string, artifactId: number) => {
    try {
      console.log(`🗑️ Removing artifact ${artifactId} from user ${userLogin}`);
      await userService.removeArtifactFromUser(userLogin, artifactId);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        // Перезагружаем профиль для получения обновленных данных
        await get().fetchUserProfile();
      }
      
      console.log('✅ Artifact removed successfully');
    } catch (error: any) {
      console.error('❌ Error removing artifact:', error);
      set({ error: error.message || 'Не удалось удалить артефакт' });
    }
  },

  // Добавить компетенцию пользователю
  addCompetencyToUser: async (userLogin: string, competencyId: number, level: number = 0) => {
    try {
      console.log(`📚 Adding competency ${competencyId} (level ${level}) to user ${userLogin}`);
      await userService.addCompetencyToUser(userLogin, competencyId, level);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Competency added successfully');
    } catch (error: any) {
      console.error('❌ Error adding competency:', error);
      set({ error: error.message || 'Не удалось добавить компетенцию' });
    }
  },

  // Обновить уровень компетенции пользователя
  updateUserCompetencyLevel: async (userLogin: string, competencyId: number, level: number) => {
    try {
      console.log(`📈 Updating competency ${competencyId} to level ${level} for user ${userLogin}`);
      await userService.updateUserCompetencyLevel(userLogin, competencyId, level);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Competency level updated successfully');
    } catch (error: any) {
      console.error('❌ Error updating competency level:', error);
      set({ error: error.message || 'Не удалось обновить уровень компетенции' });
    }
  },

  // Удалить компетенцию у пользователя
  removeCompetencyFromUser: async (userLogin: string, competencyId: number) => {
    try {
      console.log(`🗑️ Removing competency ${competencyId} from user ${userLogin}`);
      await userService.removeCompetencyFromUser(userLogin, competencyId);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Competency removed successfully');
    } catch (error: any) {
      console.error('❌ Error removing competency:', error);
      set({ error: error.message || 'Не удалось удалить компетенцию' });
    }
  },

  // Добавить навык пользователю в компетенции
  addSkillToUser: async (userLogin: string, competencyId: number, skillId: number, level: number = 0) => {
    try {
      console.log(`🔧 Adding skill ${skillId} (level ${level}) to user ${userLogin} in competency ${competencyId}`);
      await userService.addSkillToUser(userLogin, competencyId, skillId, level);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Skill added successfully');
    } catch (error: any) {
      console.error('❌ Error adding skill:', error);
      set({ error: error.message || 'Не удалось добавить навык' });
    }
  },

  // Обновить уровень навыка пользователя в компетенции
  updateUserSkillLevel: async (userLogin: string, competencyId: number, skillId: number, level: number) => {
    try {
      console.log(`📊 Updating skill ${skillId} to level ${level} for user ${userLogin} in competency ${competencyId}`);
      await userService.updateUserSkillLevel(userLogin, competencyId, skillId, level);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Skill level updated successfully');
    } catch (error: any) {
      console.error('❌ Error updating skill level:', error);
      set({ error: error.message || 'Не удалось обновить уровень навыка' });
    }
  },

  // Удалить навык у пользователя в компетенции
  removeSkillFromUser: async (userLogin: string, competencyId: number, skillId: number) => {
    try {
      console.log(`🗑️ Removing skill ${skillId} from user ${userLogin} in competency ${competencyId}`);
      await userService.removeSkillFromUser(userLogin, competencyId, skillId);
      
      // Обновляем локальные данные если это текущий пользователь
      const currentUser = get().user;
      if (currentUser && currentUser.login === userLogin) {
        await get().fetchUserProfile();
      }
      
      console.log('✅ Skill removed successfully');
    } catch (error: any) {
      console.error('❌ Error removing skill:', error);
      set({ error: error.message || 'Не удалось удалить навык' });
    }
  },

  // Завершить задачу пользователем
  completeTask: async (taskId: number) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      console.log(`✅ Completing task ${taskId} for user ${currentUser.login}`);
      await userService.completeTask(taskId, currentUser.login);
      console.log('✅ Task completed successfully');
    } catch (error: any) {
      console.error('❌ Error completing task:', error);
      set({ error: error.message || 'Не удалось завершить задачу' });
    }
  },

  clearUserData: () => {
    set({ user: null, allUsers: [], error: null });
  },

  updateUser: (user: User) => {
    set({ user });
  },

  // Пометить задачу как выполненную (локально)
  completeTaskLocal: (missionId: number, taskId: number) => {
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
        mission.isApproved,
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
        mission.isApproved,
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
      mission.isApproved, // isApproved остается без изменений
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
        mission.isApproved, // isApproved остается без изменений
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
