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
import { SeasonCreationDrawer } from "./SeasonCreationDrawer";
import { SeasonEditDrawer } from "./SeasonEditDrawer";
import { ArrowLeft, Shield } from "lucide-react";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useMissionStore } from "../../stores/useMissionStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useRankStore } from "../../stores/useRankStore";
import { useSkillStore } from "../../stores/useSkillStore"; // NEW
import { Competency } from "../../domain/competency";
import { Rank } from "../../domain/rank";
import { Skill } from "../../domain/skill"; // NEW
import { toast } from "sonner";

interface AdminScreenProps {
  onBack: () => void;
  onUserDetailOpen: (userId: string) => void;
}

export function AdminScreen({ onBack, onUserDetailOpen }: AdminScreenProps) {
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
    badgeCreationOpen,
    rewardCreationOpen,
    storeManagementOpen,
    chainCreationOpen,
    seasonCreationOpen,
    seasonEditOpen,
    selectedChain,
    selectedMission,
    selectedCompetency,
    selectedRank,
    selectedSkill, // NEW
    selectedSeason,
    
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
    openBadgeCreation,
    closeBadgeCreation,
    openRewardCreation,
    closeRewardCreation,
    openStoreManagement,
    closeStoreManagement,
    openChainCreation,
    closeChainCreation,
    openSeasonCreation,
    closeSeasonCreation,
    openSeasonEdit,
    closeSeasonEdit,
    setSelectedChain,
    setSelectedMission,
    setSelectedCompetency,
    setSelectedRank,
    setSelectedSkill, // NEW
    setSelectedSeason,
  } = useOverlayStore();

  const { deleteSeason } = useSeasonStore();
  const { deleteMission } = useMissionStore();
  const { deleteCompetency } = useCompetencyStore();
  const { deleteRank } = useRankStore();
  const { deleteSkill } = useSkillStore(); // NEW

  // Обработчик удаления сезона
  const handleDeleteSeason = async (season: any) => {
    if (!season) return;

    try {
      await deleteSeason(season.id);
      toast.success("Сезон успешно удален! 🗑️", {
        description: `"${season.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении сезона:", error);
      toast.error("Ошибка при удалении сезона. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления миссии
  const handleDeleteMission = async (mission: any) => {
    if (!mission) return;

    try {
      await deleteMission(mission.id);
      toast.success("Миссия успешно удалена! 🗑️", {
        description: `"${mission.title}" была удалена из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении миссии:", error);
      toast.error("Ошибка при удалении миссии. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления компетенции
  const handleDeleteCompetency = async (competency: Competency) => {
    if (!competency) return;

    try {
      await deleteCompetency(competency.id);
      toast.success("Компетенция успешно удалена! 🗑️", {
        description: `"${competency.name}" была удалена из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении компетенции:", error);
      toast.error("Ошибка при удалении компетенции. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления ранга
  const handleDeleteRank = async (rank: Rank) => {
    if (!rank) return;
    try {
      await deleteRank(rank.id);
      toast.success("Ранг успешно удален! 🗑️", {
        description: `"${rank.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении ранга:", error);
      toast.error("Ошибка при удалении ранга. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления навыка // NEW
  const handleDeleteSkill = async (skill: Skill) => {
    if (!skill) return;
    try {
      await deleteSkill(skill.id);
      toast.success("Навык успешно удален! 🗑️", {
        description: `"${skill.name}" был удален из системы`,
      });
    } catch (error) {
      console.error("Ошибка при удалении навыка:", error);
      toast.error("Ошибка при удалении навыка. Попробуйте еще раз.");
    }
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
                handleCreateMission={openMissionCreation}
                handleEditMission={(mission) => openMissionEdit(mission)}
                handleDeleteMission={handleDeleteMission} // NEW
                handleCreateChain={() => openChainCreation()}
                setSelectedChain={setSelectedChain}
                setSelectedMission={setSelectedMission}
                setChainCreationOpen={(open) => open ? openChainCreation() : closeChainCreation()}
              />
          
          <AdminSeason 
            handleCreateSeason={openSeasonCreation}
            handleEditSeason={(season) => openSeasonEdit(season)}
            handleDeleteSeason={handleDeleteSeason}
            setSelectedSeason={setSelectedSeason}
          />

          <AdminUsers onUserDetailOpen={onUserDetailOpen} />

          <AdminSettings
            handleCreateReward={openRewardCreation}
            handleCreateBadge={openBadgeCreation}
            handleManageStore={openStoreManagement}
            handleCreateCompetency={openCompetencyCreation}
            handleEditCompetency={(competency) => openCompetencyEdit(competency)}
            handleDeleteCompetency={handleDeleteCompetency}
            setSelectedCompetency={setSelectedCompetency}
            handleCreateRank={openRankCreation}
            handleEditRank={(rank) => openRankEdit(rank)}
            handleDeleteRank={handleDeleteRank}
            setSelectedRank={setSelectedRank}
            handleCreateSkill={openSkillCreation}
            handleEditSkill={(skill) => openSkillEdit(skill)}
            handleDeleteSkill={handleDeleteSkill}
            setSelectedSkill={setSelectedSkill}
          />
        </Tabs>
      </div>

          {/* Drawers */}
          <MissionCreationDrawer
            open={missionCreationOpen}
            onOpenChange={(open) => open ? openMissionCreation() : closeMissionCreation()}
          />

          <MissionEditDrawer // NEW
            open={missionEditOpen}
            onOpenChange={(open) => open ? openMissionEdit() : closeMissionEdit()}
            mission={selectedMission}
          />

      <BadgeCreationDrawer
        open={badgeCreationOpen}
        onOpenChange={(open) => open ? openBadgeCreation() : closeBadgeCreation()}
      />

      <RewardCreationDrawer
        open={rewardCreationOpen}
        onOpenChange={(open) => open ? openRewardCreation() : closeRewardCreation()}
      />

      <StoreManagementDrawer
        open={storeManagementOpen}
        onOpenChange={(open) => open ? openStoreManagement() : closeStoreManagement()}
      />

      <MissionChainCreationDrawer
        open={chainCreationOpen}
        onOpenChange={(open) => open ? openChainCreation() : closeChainCreation()}
        editChain={selectedChain}
      />

      <SeasonCreationDrawer
        open={seasonCreationOpen}
        onOpenChange={(open) => open ? openSeasonCreation() : closeSeasonCreation()}
      />

          <SeasonEditDrawer
            open={seasonEditOpen}
            onOpenChange={(open) => open ? openSeasonEdit() : closeSeasonEdit()}
            season={selectedSeason}
          />

          <CompetencyCreationDrawer // NEW
            open={competencyCreationOpen}
            onOpenChange={(open) => open ? openCompetencyCreation() : closeCompetencyCreation()}
          />

          <CompetencyEditDrawer
            open={competencyEditOpen}
            onOpenChange={(open) => open ? openCompetencyEdit() : closeCompetencyEdit()}
            competency={selectedCompetency}
          />

          <RankCreationDrawer // NEW
            open={rankCreationOpen}
            onOpenChange={(open) => open ? openRankCreation() : closeRankCreation()}
          />

          <RankEditDrawer
            open={rankEditOpen}
            onOpenChange={(open) => open ? openRankEdit() : closeRankEdit()}
            rank={selectedRank}
          />

          <SkillCreationDrawer // NEW
            open={skillCreationOpen}
            onOpenChange={(open) => open ? openSkillCreation() : closeSkillCreation()}
          />

          <SkillEditDrawer // NEW
            open={skillEditOpen}
            onOpenChange={(open) => open ? openSkillEdit() : closeSkillEdit()}
            skill={selectedSkill}
          />
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
const MissionChainCreationDrawer = ({
  open,
  onOpenChange,
  editChain,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editChain?: any;
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
