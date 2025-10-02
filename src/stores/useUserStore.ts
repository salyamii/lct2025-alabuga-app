import { create } from "zustand";
import {
  User,
  DetailedUser,
  UserTask,
  UserMission,
  UserCompetency,
  UserSkill,
} from "../domain";
import userService from "../api/services/userService";
import { useRankStore } from "./useRankStore";

interface UserState {
  // Текущий пользователь (детальная информация)
  user: DetailedUser | null;
  // Список всех пользователей (базовая информация для админа)
  allUsers: User[];
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  // ===== ПОЛЬЗОВАТЕЛЬСКИЕ МЕТОДЫ =====
  // Загрузка профиля текущего пользователя
  fetchUserProfile: () => Promise<void>;
  // Загрузка миссии пользователя
  fetchUserMission: (missionId: number) => Promise<void>;
  // Загрузка всех миссий пользователя по списку ID
  fetchAllUserMissions: (missionIds: number[]) => Promise<void>;
  // Завершение задачи
  completeTask: (taskId: number) => Promise<void>;
  // Очистка данных пользователя
  clearUserData: () => void;
  // Обновление пользователя в сторе
  updateUser: (user: DetailedUser) => void;

  // ===== АДМИНСКИЕ МЕТОДЫ =====
  // Загрузка всех пользователей
  fetchAllUsers: () => Promise<void>;
  // Загрузка конкретного пользователя по логину
  fetchUser: (userLogin: string) => Promise<User | null>;
  // Обновление пользователя по логину
  updateUserByLogin: (userLogin: string, userData: any) => Promise<void>;
  // Загрузка миссий пользователя по логину
  fetchUserMissionsByLogin: (userLogin: string) => Promise<UserMission[]>;
  // Одобрение миссии пользователя
  approveUserMission: (missionId: number, userLogin: string) => Promise<void>;

  // Управление артефактами пользователя
  addArtifactToUser: (userLogin: string, artifactId: number) => Promise<void>;
  removeArtifactFromUser: (
    userLogin: string,
    artifactId: number
  ) => Promise<void>;

  // Управление компетенциями пользователя
  addCompetencyToUser: (
    userLogin: string,
    competencyId: number,
    level?: number
  ) => Promise<void>;
  updateUserCompetencyLevel: (
    userLogin: string,
    competencyId: number,
    level: number
  ) => Promise<void>;
  removeCompetencyFromUser: (
    userLogin: string,
    competencyId: number
  ) => Promise<void>;

  // Управление навыками пользователя в компетенциях
  addSkillToUser: (
    userLogin: string,
    competencyId: number,
    skillId: number,
    level?: number
  ) => Promise<void>;
  updateUserSkillLevel: (
    userLogin: string,
    competencyId: number,
    skillId: number,
    level: number
  ) => Promise<void>;
  removeSkillFromUser: (
    userLogin: string,
    competencyId: number,
    skillId: number
  ) => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>(
  (
    set: (partial: Partial<UserState & UserActions>) => void,
    get: () => UserState & UserActions
  ) => ({
  user: null,
  allUsers: [],
  isLoading: false,
  error: null,

    // ===== ПОЛЬЗОВАТЕЛЬСКИЕ МЕТОДЫ =====

    // Загрузить профиль текущего пользователя
  fetchUserProfile: async () => {
    try {
        console.log("📥 Загружаем профиль пользователя...");
      set({ isLoading: true, error: null });
      const response = await userService.getProfile();

        // Создаем пользователя из детального ответа
        const user = DetailedUser.fromDetailedResponse(response.data);

        // Загружаем миссии пользователя отдельно
        try {
          const missionsResponse = await userService.getUserMissions();
          const userMissions =
            missionsResponse.data.missions?.map((missionData) =>
              UserMission.fromResponse(missionData)
            ) || [];

          // Создаем пользователя с миссиями
          const userWithMissions = new DetailedUser(
            user.login,
            user.firstName,
            user.lastName,
            user.role,
            user.rankId,
            user.xp,
            user.mana,
            userMissions,
            user.artifacts,
            user.competencies
          );

          set({ user: userWithMissions, isLoading: false });
          console.log("✅ Профиль пользователя загружен");
        } catch (missionsError) {
          console.warn(
            "⚠️ Не удалось загрузить миссии пользователя, используем профиль без миссий"
          );
          set({ user, isLoading: false });
        }
    } catch (error: any) {
        console.error("❌ Ошибка при загрузке профиля:", error);
        set({
          error: error.message || "Не удалось получить профиль пользователя",
          isLoading: false,
        });
      }
    },


  // Загрузить миссию пользователя с сервера
  fetchUserMission: async (missionId: number) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      const response = await userService.getUserMission(missionId);
      const userMissionData = response.data;
      const newUserMission = UserMission.fromResponse(userMissionData);

      // Обновляем или добавляем миссию в user.missions
        const existingIndex = currentUser.missions.findIndex(
          (m) => m.id === missionId
        );
      let updatedMissions = [...currentUser.missions];

      if (existingIndex >= 0) {
        updatedMissions[existingIndex] = newUserMission;
      } else {
        updatedMissions.push(newUserMission);
      }

        const updatedUser = new DetailedUser(
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
        set({
          error: error.message || "Не удалось загрузить миссию пользователя",
        });
    }
  },

  // Загрузить все миссии пользователя по списку ID
  fetchAllUserMissions: async (missionIds: number[]) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;

      // Загружаем все миссии параллельно
        const missionPromises = missionIds.map((id) =>
          userService.getUserMission(id)
        );
      const responses = await Promise.allSettled(missionPromises);

      // Собираем успешно загруженные миссии
      const userMissions: UserMission[] = [];
      responses.forEach((result, index) => {
          if (result.status === "fulfilled") {
          const userMission = UserMission.fromResponse(result.value.data);
          userMissions.push(userMission);
        } else {
            console.error(
              `Не удалось загрузить миссию ${missionIds[index]}:`,
              result.reason
            );
        }
      });

      // Обновляем user.missions (заменяем все миссии на загруженные)
        const updatedUser = new DetailedUser(
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
        set({
          error: error.message || "Не удалось загрузить миссии пользователя",
        });
      }
    },

    // Завершить задачу пользователем
    completeTask: async (taskId: number) => {
      try {
        const currentUser = get().user;
        if (!currentUser) return;

        await userService.completeTask(taskId, currentUser.login);

        // Перезагружаем профиль для получения обновленных данных
        await get().fetchUserProfile();
      } catch (error: any) {
        set({ error: error.message || "Не удалось завершить задачу" });
      }
    },

    clearUserData: () => {
      set({ user: null, allUsers: [], error: null, isLoading: false });
    },

    updateUser: (user: DetailedUser) => {
      set({ user });
    },

    // Завершить миссию с начислением наград
    completeMission: async (missionId: number) => {
      // Метод удален
    },

    // ===== АДМИНСКИЕ МЕТОДЫ =====

    // Загрузить всех пользователей (только для HR)
    fetchAllUsers: async () => {
      try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }

        const response = await userService.getUsers();
        const users =
          response.data.users?.map((userData) => User.fromResponse(userData)) ||
          [];
        set({ allUsers: users });
      } catch (error: any) {
        set({
          error: error.message || "Не удалось получить список пользователей",
        });
      }
    },

    // Загрузить конкретного пользователя по логину
    fetchUser: async (userLogin: string): Promise<User | null> => {
      try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return null;
        }
        const response = await userService.getUser(userLogin);
        const user = User.fromResponse(response.data);
        return user;
      } catch (error: any) {
        set({
          error:
            error.message ||
            `Не удалось получить данные пользователя ${userLogin}`,
        });
        return null;
      }
    },

    // Обновить пользователя по логину (для HR/Admin)
    updateUserByLogin: async (userLogin: string, userData: any) => {
      try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }

        await userService.updateUser(userLogin, userData);

        // Если обновляем пользователя из списка allUsers, обновляем его там
        const allUsers = get().allUsers;
        if (allUsers.some((u) => u.login === userLogin)) {
          await get().fetchAllUsers();
        }
      } catch (error: any) {
        set({
          error:
            error.message ||
            `Не удалось обновить данные пользователя ${userLogin}`,
        });
        throw error;
    }
  },

  // Загрузить миссии пользователя по логину
  fetchUserMissionsByLogin: async (userLogin: string) => {
    try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return [];
        }
      const response = await userService.getUserMissionsByLogin(userLogin);
        const userMissions =
          response.data.missions?.map((missionData) =>
            UserMission.fromResponse(missionData)
          ) || [];
      return userMissions;
    } catch (error: any) {
        set({
          error:
            error.message ||
            `Не удалось получить миссии пользователя ${userLogin}`,
        });
      return [];
    }
  },

  // Одобрить миссию пользователя (только для HR)
  approveUserMission: async (missionId: number, userLogin: string) => {
    try {
      const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
        return;
      }

      await userService.approveUserMission(missionId, userLogin);
    } catch (error: any) {
        set({ error: error.message || "Не удалось одобрить миссию" });
    }
  },

  // Добавить артефакт пользователю
  addArtifactToUser: async (userLogin: string, artifactId: number) => {
    try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
      await userService.addArtifactToUser(userLogin, artifactId);
      } catch (error: any) {
        set({ error: error.message || "Не удалось добавить артефакт" });
    }
  },

  // Удалить артефакт у пользователя
  removeArtifactFromUser: async (userLogin: string, artifactId: number) => {
    try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
      await userService.removeArtifactFromUser(userLogin, artifactId);
      } catch (error: any) {
        set({ error: error.message || "Не удалось удалить артефакт" });
    }
  },

  // Добавить компетенцию пользователю
    addCompetencyToUser: async (
      userLogin: string,
      competencyId: number,
      level: number = 0
    ) => {
      try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
      await userService.addCompetencyToUser(userLogin, competencyId, level);
      } catch (error: any) {
        set({ error: error.message || "Не удалось добавить компетенцию" });
    }
  },

  // Обновить уровень компетенции пользователя
    updateUserCompetencyLevel: async (
      userLogin: string,
      competencyId: number,
      level: number
    ) => {
      try {
      const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
        await userService.updateUserCompetencyLevel(
          userLogin,
          competencyId,
          level
        );
      } catch (error: any) {
        set({
          error: error.message || "Не удалось обновить уровень компетенции",
        });
    }
  },

  // Удалить компетенцию у пользователя
    removeCompetencyFromUser: async (
      userLogin: string,
      competencyId: number
    ) => {
    try {
        const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
      await userService.removeCompetencyFromUser(userLogin, competencyId);
      } catch (error: any) {
        set({ error: error.message || "Не удалось удалить компетенцию" });
    }
  },

  // Добавить навык пользователю в компетенции
    addSkillToUser: async (
      userLogin: string,
      competencyId: number,
      skillId: number,
      level: number = 0
    ) => {
      try {
      const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
        await userService.addSkillToUser(
          userLogin,
          competencyId,
          skillId,
          level
        );
      } catch (error: any) {
        set({ error: error.message || "Не удалось добавить навык" });
    }
  },

  // Обновить уровень навыка пользователя в компетенции
    updateUserSkillLevel: async (
      userLogin: string,
      competencyId: number,
      skillId: number,
      level: number
    ) => {
      try {
      const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
          return;
        }
        await userService.updateUserSkillLevel(
          userLogin,
          competencyId,
          skillId,
          level
        );
      } catch (error: any) {
        set({ error: error.message || "Не удалось обновить уровень навыка" });
    }
  },

  // Удалить навык у пользователя в компетенции
    removeSkillFromUser: async (
      userLogin: string,
      competencyId: number,
      skillId: number
    ) => {
    try {
      const currentUser = get().user;
        if (!currentUser || !currentUser.isAdmin) {
      return;
        }
        await userService.removeSkillFromUser(userLogin, competencyId, skillId);
      } catch (error: any) {
        set({ error: error.message || "Не удалось удалить навык" });
      }
    },
  })
);
