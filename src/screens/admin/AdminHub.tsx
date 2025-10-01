import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { AdminDashboard } from "./AdminDashboard";
import { AdminUsers } from "./AdminUsers";
import { AdminMission } from "./AdminMission";
import { AdminSeason } from "./AdminSeason";
import { AdminCompetency } from "./AdminCompetency";
import { AdminRank } from "./AdminRank";
import { AdminSkill } from "./AdminSkill"; // NEW
import { AdminSettings } from "./AdminSettings";
import { MissionCreationDrawer } from "./MissionCreationDrawer";
import { MissionEditDrawer } from "./MissionEditDrawer";
import { CompetencyCreationDrawer } from "./CompetencyCreationDrawer";
import { CompetencyEditDrawer } from "./CompetencyEditDrawer";
import { RankCreationDrawer } from "./RankCreationDrawer";
import { RankEditDrawer } from "./RankEditDrawer";
import { SkillCreationDrawer } from "./SkillCreationDrawer"; // NEW
import { SkillEditDrawer } from "./SkillEditDrawer"; // NEW
import { TaskCreationDrawer } from "./TaskCreationDrawer";
import { TaskEditDrawer } from "./TaskEditDrawer";
import { ArtifactCreationDrawer } from "./ArtifactCreationDrawer";
import { ArtifactEditDrawer } from "./ArtifactEditDrawer";
import { StoreItemCreationDrawer } from "./StoreItemCreationDrawer";
import { StoreItemEditDrawer } from "./StoreItemEditDrawer";
import { SeasonCreationDrawer } from "./SeasonCreationDrawer";
import { SeasonEditDrawer } from "./SeasonEditDrawer";
import { MissionChainCreationDrawer } from "./MissionChainCreationDrawer";
import { MissionChainEditDrawer } from "./MissionChainEditDrawer";
import { UserPreviewOverlay } from "./UserPreviewOverlay";
import { UserEditDrawer } from "./UserEditDrawer";
import { ArrowLeft, Shield } from "lucide-react";
import { useCallback } from "react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useMissionStore } from "../../stores/useMissionStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useRankStore } from "../../stores/useRankStore";
import { useSkillStore } from "../../stores/useSkillStore"; // NEW
import { useTaskStore } from "../../stores/useTaskStore";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useStoreStore } from "../../stores/useStoreStore";
import { useUserStore } from "../../stores/useUserStore";
import { Competency } from "../../domain/competency";
import { Rank } from "../../domain/rank";
import { Skill } from "../../domain/skill"; // NEW
import { Task } from "../../domain/task";
import { Artifact } from "../../domain/artifact";
import { StoreItem } from "../../domain/store";
import { toast } from "sonner";

interface AdminScreenProps {
  onBack: () => void;
}

export function AdminHubScreen({ onBack }: AdminScreenProps) {
  const {
    // Состояния оверлеев
    missionCreationOpen,
    missionEditOpen,
    competencyCreationOpen,
    competencyEditOpen,
    rankCreationOpen,
    rankEditOpen,
    skillCreationOpen, // NEW
    skillEditOpen, // NEW
    taskCreationOpen,
    taskEditOpen,
    artifactCreationOpen,
    artifactEditOpen,
    badgeCreationOpen,
    rewardCreationOpen,
    storeManagementOpen,
    chainCreationOpen,
    chainEditOpen,
    seasonCreationOpen,
    seasonEditOpen,
    userPreviewOpen,
    userEditOpen,
    selectedChain,
    selectedMission,
    selectedCompetency,
    selectedRank,
    selectedSkill, // NEW
    selectedTask,
    selectedArtifact,
    selectedStoreItem,
    selectedSeason,
    selectedUserLogin,

    // Действия
    openMissionCreation,
    closeMissionCreation,
    openMissionEdit,
    closeMissionEdit,
    openCompetencyCreation,
    closeCompetencyCreation,
    openCompetencyEdit,
    closeCompetencyEdit,
    openRankCreation,
    closeRankCreation,
    openRankEdit,
    closeRankEdit,
    openSkillCreation, // NEW
    closeSkillCreation, // NEW
    openSkillEdit, // NEW
    closeSkillEdit, // NEW
    openTaskCreation,
    closeTaskCreation,
    openTaskEdit,
    closeTaskEdit,
    openArtifactCreation,
    closeArtifactCreation,
    openArtifactEdit,
    closeArtifactEdit,
    openStoreItemCreation,
    closeStoreItemCreation,
    openStoreItemEdit,
    closeStoreItemEdit,
    openBadgeCreation,
    closeBadgeCreation,
    openRewardCreation,
    closeRewardCreation,
    openStoreManagement,
    closeStoreManagement,
    openChainCreation,
    closeChainCreation,
    openChainEdit,
    closeChainEdit,
    openSeasonCreation,
    closeSeasonCreation,
    openSeasonEdit,
    closeSeasonEdit,
    openUserPreview,
    closeUserPreview,
    openUserEdit,
    closeUserEdit,
    setSelectedChain,
    setSelectedMission,
    setSelectedCompetency,
    setSelectedRank,
    setSelectedSkill, // NEW
    setSelectedTask,
    setSelectedArtifact,
    setSelectedStoreItem,
    setSelectedSeason,
    setSelectedUserLogin,
  } = useOverlayStore();

  // Все сторы с данными и методами
  const seasonStore = useSeasonStore();
  const missionStore = useMissionStore();
  const missionChainStore = useMissionChainStore();
  const competencyStore = useCompetencyStore();
  const rankStore = useRankStore();
  const skillStore = useSkillStore();
  const taskStore = useTaskStore();
  const artifactStore = useArtifactStore();
  const storeItemStore = useStoreStore();
  const userStore = useUserStore();

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ СЕЗОНОВ
  // ===========================================
  const handleFetchSeasons = async () => {
    try {
      await seasonStore.fetchSeasons();
    } catch (error) {
      console.error("Ошибка при загрузке сезонов:", error);
      toast.error("Не удалось загрузить сезоны");
    }
  };

  const handleDeleteSeason = async (season: any) => {
    if (!season) return;
    try {
      await seasonStore.deleteSeason(season.id);
      toast.success("Сезон успешно удален! 🗑️", {
        description: `"${season.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении сезона:", error);
      toast.error("Ошибка при удалении сезона. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ МИССИЙ
  // ===========================================
  const handleFetchMissions = async () => {
    try {
      await missionStore.fetchMissions();
    } catch (error) {
      console.error("Ошибка при загрузке миссий:", error);
      toast.error("Не удалось загрузить миссии");
    }
  };

  const handleDeleteMission = async (mission: any) => {
    if (!mission) return;
    try {
      await missionStore.deleteMission(mission.id);
      toast.success("Миссия успешно удалена! 🗑️", {
        description: `"${mission.title}" была удалена из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении миссии:", error);
      toast.error("Ошибка при удалении миссии. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ ЦЕПОЧЕК МИССИЙ
  // ===========================================
  const handleFetchMissionChains = async () => {
    try {
      await missionChainStore.fetchMissionChains();
    } catch (error) {
      console.error("Ошибка при загрузке цепочек миссий:", error);
      toast.error("Не удалось загрузить цепочки миссий");
    }
  };

  const handleCreateChain = () => {
    openChainCreation();
  };

  const handleEditChain = (chain: any) => {
    setSelectedChain(chain);
    openChainEdit(chain);
  };

  const handleDeleteChain = async (chain: any) => {
    if (!chain) return;
    try {
      await missionChainStore.deleteMissionChain(chain.id);
      toast.success("Цепочка миссий успешно удалена! 🗑️", {
        description: `"${chain.name}" была удалена из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении цепочки:", error);
      toast.error("Ошибка при удалении цепочки. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ КОМПЕТЕНЦИЙ
  // ===========================================
  const handleFetchCompetencies = async () => {
    try {
      await competencyStore.fetchCompetencies();
    } catch (error) {
      console.error("Ошибка при загрузке компетенций:", error);
      toast.error("Не удалось загрузить компетенции");
    }
  };

  const handleDeleteCompetency = async (competency: Competency) => {
    if (!competency) return;
    try {
      await competencyStore.deleteCompetency(competency.id);
      toast.success("Компетенция успешно удалена! 🗑️", {
        description: `"${competency.name}" была удалена из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении компетенции:", error);
      toast.error("Ошибка при удалении компетенции. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ РАНГОВ
  // ===========================================
  const handleFetchRanks = async () => {
    try {
      await rankStore.fetchRanks();
    } catch (error) {
      console.error("Ошибка при загрузке рангов:", error);
      toast.error("Не удалось загрузить ранги");
    }
  };

  const handleDeleteRank = async (rank: Rank) => {
    if (!rank) return;
    try {
      await rankStore.deleteRank(rank.id);
      toast.success("Ранг успешно удален! 🗑️", {
        description: `"${rank.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении ранга:", error);
      toast.error("Ошибка при удалении ранга. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ НАВЫКОВ
  // ===========================================
  const handleFetchSkills = async () => {
    try {
      await skillStore.fetchSkills();
    } catch (error) {
      console.error("Ошибка при загрузке навыков:", error);
      toast.error("Не удалось загрузить навыки");
    }
  };

  const handleDeleteSkill = async (skill: Skill) => {
    if (!skill) return;
    try {
      await skillStore.deleteSkill(skill.id);
      toast.success("Навык успешно удален! 🗑️", {
        description: `"${skill.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении навыка:", error);
      toast.error("Ошибка при удалении навыка. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ ЗАДАНИЙ
  // ===========================================
  const handleFetchTasks = async () => {
    try {
      await taskStore.fetchTasks();
    } catch (error) {
      console.error("Ошибка при загрузке заданий:", error);
      toast.error("Не удалось загрузить задания");
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!task) return;
    try {
      await taskStore.deleteTask(task.id);
      toast.success("Задание успешно удалено! 🗑️", {
        description: `"${task.title}" было удалено из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении задания:", error);
      toast.error("Ошибка при удалении задания. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ АРТЕФАКТОВ
  // ===========================================
  const handleFetchArtifacts = async () => {
    try {
      await artifactStore.fetchArtifacts();
    } catch (error) {
      console.error("Ошибка при загрузке артефактов:", error);
      toast.error("Не удалось загрузить артефакты");
    }
  };

  const handleDeleteArtifact = async (artifact: Artifact) => {
    if (!artifact) return;
    try {
      await artifactStore.deleteArtifact(artifact.id);
      toast.success("Артефакт успешно удален! 🗑️", {
        description: `"${artifact.title}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении артефакта:", error);
      toast.error("Ошибка при удалении артефакта. Попробуйте еще раз.");
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ МАГАЗИНА
  // ===========================================
  const handleFetchStoreItems = async () => {
    try {
      await storeItemStore.fetchItems();
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
      toast.error("Не удалось загрузить товары");
    }
  };

  const handleDeleteStoreItem = async (item: StoreItem) => {
    if (
      window.confirm(`Вы уверены, что хотите удалить товар "${item.title}"?`)
    ) {
      try {
        await storeItemStore.deleteItem(item.id);
        toast.success("Товар успешно удален!");
      } catch (error) {
        console.error("Ошибка при удалении товара:", error);
        toast.error("Ошибка при удалении товара");
      }
    }
  };

  // ===========================================
  // ХЕНДЛЕРЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
  // ===========================================
  const handleFetchAllUsers = async () => {
    try {
      await userStore.fetchAllUsers();
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      toast.error("Не удалось загрузить пользователей");
    }
  };

  const handleFetchUserMissionsByLogin = async (userLogin: string) => {
    try {
      return await userStore.fetchUserMissionsByLogin(userLogin);
    } catch (error) {
      console.error("Ошибка при загрузке миссий пользователя:", error);
      toast.error("Не удалось загрузить миссии пользователя");
      return [];
    }
  };

  const handleApproveUserMission = async (
    missionId: number,
    userLogin: string
  ) => {
    try {
      await userStore.approveUserMission(missionId, userLogin);
      toast.success("Миссия успешно подтверждена! ✅");
    } catch (error) {
      console.error("Ошибка при подтверждении миссии:", error);
      toast.error("Не удалось подтвердить миссию");
    }
  };

  // Обработчики для заданий
  const handleCreateTask = () => {
    openTaskCreation();
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    openTaskEdit(task);
  };

  // Обработчики для артефактов
  const handleCreateArtifact = () => {
    openArtifactCreation();
  };

  const handleEditArtifact = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    openArtifactEdit(artifact);
  };

  // Обработчики для товаров магазина
  const handleCreateStoreItem = () => {
    openStoreItemCreation();
  };

  const handleEditStoreItem = (item: StoreItem) => {
    setSelectedStoreItem(item);
    openStoreItemEdit(item);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">
                  Панель администратора
                </h1>
                <p className="text-sm text-muted-foreground">
                  Управление миссиями, пользователями и настройками платформы
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="inline-flex w-full max-w-7xl overflow-x-auto">
            <TabsTrigger value="dashboard">Сводка</TabsTrigger>
            <TabsTrigger value="missions">Миссии</TabsTrigger>
            <TabsTrigger value="seasons">Сезоны</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <AdminDashboard />

          <AdminMission
            handleFetchMissions={handleFetchMissions}
            handleFetchMissionChains={handleFetchMissionChains}
            handleCreateMission={openMissionCreation}
            handleEditMission={(mission) => openMissionEdit(mission)}
            handleDeleteMission={handleDeleteMission}
            setSelectedMission={setSelectedMission}
            handleCreateChain={handleCreateChain}
            handleEditChain={handleEditChain}
            handleDeleteChain={handleDeleteChain}
            setSelectedChain={setSelectedChain}
          />

          <AdminSeason
            handleFetchSeasons={handleFetchSeasons}
            handleCreateSeason={openSeasonCreation}
            handleEditSeason={(season) => openSeasonEdit(season)}
            handleDeleteSeason={handleDeleteSeason}
            setSelectedSeason={setSelectedSeason}
          />

          <AdminUsers
            handleFetchAllUsers={handleFetchAllUsers}
            handleFetchUserMissionsByLogin={handleFetchUserMissionsByLogin}
            handleApproveUserMission={handleApproveUserMission}
            onUserEditOpen={(userLogin) => {
              setSelectedUserLogin(userLogin);
              openUserEdit(userLogin);
            }}
            onUserPreviewOpen={(userLogin) => {
              setSelectedUserLogin(userLogin);
              openUserPreview(userLogin);
            }}
          />

          <AdminSettings
            // Common Handlers (Data Loaders)
            handleFetchCompetencies={handleFetchCompetencies}
            handleFetchRanks={handleFetchRanks}
            handleFetchMissions={handleFetchMissions}
            handleFetchSkills={handleFetchSkills}
            handleFetchTasks={handleFetchTasks}
            handleFetchArtifacts={handleFetchArtifacts}
            handleFetchStoreItems={handleFetchStoreItems}
            // Competency Handlers
            handleCreateCompetency={openCompetencyCreation}
            handleEditCompetency={(competency) =>
              openCompetencyEdit(competency)
            }
            handleDeleteCompetency={handleDeleteCompetency}
            setSelectedCompetency={setSelectedCompetency}
            // Rank Handlers
            handleCreateRank={openRankCreation}
            handleEditRank={(rank) => openRankEdit(rank)}
            handleDeleteRank={handleDeleteRank}
            setSelectedRank={setSelectedRank}
            // Skill Handlers
            handleCreateSkill={openSkillCreation}
            handleEditSkill={(skill) => openSkillEdit(skill)}
            handleDeleteSkill={handleDeleteSkill}
            setSelectedSkill={setSelectedSkill}
            // Task Handlers
            handleCreateTask={handleCreateTask}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            setSelectedTask={setSelectedTask}
            // Artifact Handlers
            handleCreateArtifact={handleCreateArtifact}
            handleEditArtifact={handleEditArtifact}
            handleDeleteArtifact={handleDeleteArtifact}
            setSelectedArtifact={setSelectedArtifact}
            // Store Item Handlers
            handleCreateStoreItem={handleCreateStoreItem}
            handleEditStoreItem={handleEditStoreItem}
            handleDeleteStoreItem={handleDeleteStoreItem}
            setSelectedStoreItem={setSelectedStoreItem}
          />
        </Tabs>
      </div>

      {/* Drawers */}
      <MissionCreationDrawer
        open={missionCreationOpen}
        onOpenChange={(open) =>
          open ? openMissionCreation() : closeMissionCreation()
        }
      />

      <MissionEditDrawer // NEW
        open={missionEditOpen}
        onOpenChange={(open) => (open ? openMissionEdit() : closeMissionEdit())}
        mission={selectedMission}
      />

      <BadgeCreationDrawer
        open={badgeCreationOpen}
        onOpenChange={(open) =>
          open ? openBadgeCreation() : closeBadgeCreation()
        }
      />

      <RewardCreationDrawer
        open={rewardCreationOpen}
        onOpenChange={(open) =>
          open ? openRewardCreation() : closeRewardCreation()
        }
      />

      <StoreManagementDrawer
        open={storeManagementOpen}
        onOpenChange={(open) =>
          open ? openStoreManagement() : closeStoreManagement()
        }
      />

      <MissionChainCreationDrawer
        open={chainCreationOpen}
        onOpenChange={(open) =>
          open ? openChainCreation() : closeChainCreation()
        }
      />

      <MissionChainEditDrawer
        open={chainEditOpen}
        onOpenChange={(open) => (open ? openChainEdit() : closeChainEdit())}
        chain={selectedChain}
      />

      <SeasonCreationDrawer
        open={seasonCreationOpen}
        onOpenChange={(open) =>
          open ? openSeasonCreation() : closeSeasonCreation()
        }
      />

      <SeasonEditDrawer
        open={seasonEditOpen}
        onOpenChange={(open) => (open ? openSeasonEdit() : closeSeasonEdit())}
        season={selectedSeason}
      />

      <CompetencyCreationDrawer />

      <CompetencyEditDrawer competency={selectedCompetency} />

      <RankCreationDrawer />

      <RankEditDrawer rank={selectedRank} />

      <SkillCreationDrawer />

      <SkillEditDrawer skill={selectedSkill} />

      <TaskCreationDrawer />

      <TaskEditDrawer task={selectedTask} />

      <ArtifactCreationDrawer />

      <ArtifactEditDrawer artifact={selectedArtifact} />

      <StoreItemCreationDrawer />

      <StoreItemEditDrawer item={selectedStoreItem} />

      <UserPreviewOverlay
        open={userPreviewOpen}
        onOpenChange={(open) =>
          open ? openUserPreview(selectedUserLogin || "") : closeUserPreview()
        }
        userLogin={selectedUserLogin}
      />

      <UserEditDrawer />
    </div>
  );
}

// Заглушки для компонентов Drawer
const BadgeCreationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const RewardCreationDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;
const StoreManagementDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;

// Закомментированные данные ветвей и цепей миссий (перенесены из AdminSeason.tsx)
/*
// Mock data for branches
const branches = [
  {
    id: "branch-1",
    title: "Frontend Development Path",
    description: "Complete frontend development skills from basics to advanced",
    category: "Frontend",
    rule: {
      type: "MAND_AND_ANY" as const,
      display: "MAND 2 + ANY 1",
      mandatoryCount: 2,
      anyCount: 1,
    },
    progress: {
      completed: 3,
      total: 5,
    },
    status: "active",
    season: "Delta Constellation",
    createdDate: "2024-03-01",
    participants: 147,
    completionRate: 78,
    rewards: {
      xp: 800,
      mana: 1200,
      artifacts: ["Frontend Expert", "UI Master"],
    },
  },
  {
    id: "branch-2",
    title: "Backend Infrastructure",
    description: "Build robust backend systems and APIs",
    category: "Backend",
    rule: {
      type: "ALL" as const,
      display: "ALL",
      mandatoryCount: 0,
      anyCount: 0,
    },
    progress: {
      completed: 2,
      total: 4,
    },
    status: "active",
    season: "Delta Constellation",
    createdDate: "2024-02-28",
    participants: 93,
    completionRate: 65,
    rewards: {
      xp: 1000,
      mana: 1500,
      artifacts: ["Backend Architect"],
    },
  },
  {
    id: "branch-3",
    title: "DevOps & Deployment",
    description: "Master deployment pipelines and infrastructure",
    category: "DevOps",
    rule: {
      type: "ANY" as const,
      display: "ANY 3",
      mandatoryCount: 0,
      anyCount: 3,
    },
    progress: {
      completed: 1,
      total: 6,
    },
    status: "draft",
    season: "Delta Constellation",
    createdDate: "2024-03-05",
    participants: 0,
    completionRate: 0,
    rewards: {
      xp: 1200,
      mana: 1800,
      artifacts: ["DevOps Engineer", "Cloud Specialist", "Pipeline Master"],
    },
  },
];

// Mock data for mission chains
const chains = [
  {
    id: "chain-1",
    title: "React Mastery Journey",
    description: "Complete step-by-step progression through React fundamentals to advanced patterns",
    category: "Frontend",
    season: "Delta Constellation",
    isLinear: true,
    autoUnlock: true,
    requiresSequentialCompletion: true,
    status: "active",
    createdDate: "2024-03-01",
    participants: 234,
    completionRate: 82,
    totalMissions: 4,
    currentMissionIndex: 2,
    estimatedTotalDuration: "8 hours",
    completionRewards: {
      xp: 1500,
      mana: 2000,
      artifacts: ["React Master"],
      badges: ["Frontend Specialist"],
    },
    missions: [
      {
        id: "chain-1-mission-1",
        title: "React Fundamentals",
        description: "Learn JSX, components, and props",
        difficulty: "Beginner",
        type: "Individual",
        status: "completed",
        estimatedDuration: "2 hours",
        xpReward: 200,
        manaReward: 300,
      },
      {
        id: "chain-1-mission-2",
        title: "State Management Basics",
        description: "Master useState and useEffect hooks",
        difficulty: "Intermediate",
        type: "Individual",
        status: "completed",
        estimatedDuration: "2 hours",
        xpReward: 300,
        manaReward: 450,
      },
      {
        id: "chain-1-mission-3",
        title: "Component Architecture",
        description: "Build reusable component systems",
        difficulty: "Advanced",
        type: "Group",
        status: "in_progress",
        estimatedDuration: "2 hours",
        xpReward: 400,
        manaReward: 600,
      },
      {
        id: "chain-1-mission-4",
        title: "Advanced React Patterns",
        description: "Master context, custom hooks, and performance optimization",
        difficulty: "Expert",
        type: "Individual",
        status: "locked",
        estimatedDuration: "2 hours",
        xpReward: 500,
        manaReward: 750,
      },
    ],
  },
  {
    id: "chain-2",
    title: "Full-Stack Development Path",
    description: "End-to-end web development from frontend to deployment",
    category: "Full-Stack",
    season: "Delta Constellation",
    isLinear: true,
    autoUnlock: false,
    requiresSequentialCompletion: true,
    status: "draft",
    createdDate: "2024-03-05",
    participants: 0,
    completionRate: 0,
    totalMissions: 6,
    currentMissionIndex: 0,
    estimatedTotalDuration: "15 hours",
    completionRewards: {
      xp: 2500,
      mana: 3500,
      artifacts: ["Full-Stack Developer", "System Architect"],
      badges: ["Complete Developer"],
    },
    missions: [
      {
        id: "chain-2-mission-1",
        title: "Frontend Foundations",
        description: "HTML, CSS, and JavaScript essentials",
        difficulty: "Beginner",
        type: "Individual",
        status: "todo",
        estimatedDuration: "3 hours",
        xpReward: 250,
        manaReward: 400,
      },
      {
        id: "chain-2-mission-2",
        title: "React Framework",
        description: "Component-based development",
        difficulty: "Intermediate",
        type: "Individual",
        status: "locked",
        estimatedDuration: "3 hours",
        xpReward: 350,
        manaReward: 500,
      },
      {
        id: "chain-2-mission-3",
        title: "Backend API Development",
        description: "RESTful APIs and database integration",
        difficulty: "Advanced",
        type: "Individual",
        status: "locked",
        estimatedDuration: "3 hours",
        xpReward: 450,
        manaReward: 650,
      },
    ],
  },
  {
    id: "chain-3",
    title: "Leadership Excellence Journey",
    description: "Develop essential leadership and team management skills",
    category: "Leadership",
    season: "Delta Constellation",
    isLinear: false,
    autoUnlock: true,
    requiresSequentialCompletion: false,
    status: "active",
    createdDate: "2024-02-28",
    participants: 89,
    completionRate: 67,
    totalMissions: 3,
    currentMissionIndex: 1,
    estimatedTotalDuration: "6 hours",
    completionRewards: {
      xp: 1200,
      mana: 1600,
      artifacts: ["Leadership Badge"],
      badges: ["Team Leader"],
    },
    missions: [
      {
        id: "chain-3-mission-1",
        title: "Communication Fundamentals",
        description: "Effective team communication strategies",
        difficulty: "Intermediate",
        type: "Group",
        status: "completed",
        estimatedDuration: "2 hours",
        xpReward: 300,
        manaReward: 400,
      },
      {
        id: "chain-3-mission-2",
        title: "Project Management",
        description: "Agile methodologies and team coordination",
        difficulty: "Advanced",
        type: "Group",
        status: "in_progress",
        estimatedDuration: "2 hours",
        xpReward: 400,
        manaReward: 600,
      },
      {
        id: "chain-3-mission-3",
        title: "Mentorship Skills",
        description: "Guide and develop junior team members",
        difficulty: "Expert",
        type: "Event",
        status: "locked",
        estimatedDuration: "2 hours",
        xpReward: 500,
        manaReward: 750,
      },
    ],
  },
];
*/
