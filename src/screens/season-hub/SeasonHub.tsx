import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Stars, Sparkles, Target, FileText, Zap, Clock, Trophy, Globe, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Satellite } from "lucide-react";
import { GitBranch } from "lucide-react";
import { Shield } from "lucide-react";
import { Star } from "lucide-react";
import { SeasonHubInfo } from "./SeasonHubInfo";
import { SeasonHubActiveEvents } from "./SeasonActiveEvents";
import { MissionChainCard } from "./MissionChainCard";
import { MissionCard } from "./MissionCard";
import { MissionChainOverlay } from "./MissionChainOverlay";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useUserStore } from "../../stores/useUserStore";
import { SeasonHubRightRail } from "./SeasonHubRightRail";
import { SeasonHubMissionChains } from "./SeasonHubMissionChains";
import { SeasonHubMissions, SeasonHubMissionsProps } from "./SeasonHubMissions";

interface SeasonHubProps {
    onMissionLaunch: (missionId: number) => void;
    onMissionDetails: (missionId: number) => void;
    onSquadronDetails: () => void;
    onShipLogOpen: () => void;
    onMentorRatingOpen?: () => void;
    onMissionChainOpen: (missionChainId: number) => void;
  }

  export function SeasonHub({ 
    onMissionLaunch, 
    onMissionDetails, 
    onSquadronDetails,
    onShipLogOpen,
    onMentorRatingOpen,
    onMissionChainOpen: onMissionChainOpen
  }: SeasonHubProps) {


    const { seasons, isLoading } = useSeasonStore();
    const { missionChains } = useMissionChainStore();
    const { user } = useUserStore();
    const { 
      missionChainViewOpen, 
      selectedMissionChainId, 
      openMissionChainView, 
      closeMissionChainView 
    } = useOverlayStore();

    // Сортируем сезоны по дате начала
    const sortedSeasons = [...seasons].sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );

    // Находим активный сезон - первый сезон, дата окончания которого >= текущей даты
    const now = new Date();
    const activeSeason = sortedSeasons.find(season => season.endDate >= now) || null;

    // Остальные сезоны (следующие сезоны)
    const upcomingSeasons = sortedSeasons.filter(season => 
      activeSeason ? season.id !== activeSeason.id && season.startDate > now : season.startDate > now
    );

    // Получаем миссии пользователя (из user.missions)
    const userMissions = user?.missions || [];

    // Фильтруем миссии по активному сезону
    const seasonUserMissions = activeSeason 
      ? userMissions.filter(m => m.seasonId === activeSeason.id)
      : userMissions;

    // Вычисляем реальные данные из пользователя для активного сезона
    const seasonCompletedCount = seasonUserMissions.filter(m => m.isCompleted).length;
    const seasonTotalCount = seasonUserMissions.length;
    const seasonProgress = seasonTotalCount > 0 
      ? Math.round((seasonCompletedCount / seasonTotalCount) * 100) 
      : 0;

    const displayedSeason = activeSeason ? {
        id: activeSeason.id.toString(),
        name: activeSeason.name,
        description: "Навигация через сложные космические задачи и установка новых торговых маршрутов",
        timeRemaining: `${activeSeason.getRemainingDays()} дней`,
        progress: seasonProgress, // ✅ Прогресс по активному сезону
        totalMissions: seasonTotalCount, // ✅ Миссии активного сезона
        completedMissions: seasonCompletedCount, // ✅ Выполненные миссии сезона
        participants: 2847, // Mock - количество участников сезона
        rewards: {
          seasonBadge: "Навигатор Дельты",
          finalReward: "Сертификат Командира Космических Операций",
          bonusMana: 2500
        }
      } : null;

  // Космические ивенты — лимитированные спец-миссии
  const cosmicEvents = [
    {
      id: "event-1",
      title: "Слияние Звёзд",
      description: "Редкое космическое явление — буст к XP-ревардам",
      timeLeft: "2ч 34м",
      bonusMultiplier: "2x XP",
      participants: 156,
      isActive: true,
      icon: Sparkles,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: "event-2", 
      title: "Сквадрон Ралли",
      description: "Глобальный командный ивент-соревнование",
      timeLeft: "1д 14ч",
      bonusMultiplier: "Team Rewards",
      participants: 89,
      isActive: true,
      icon: Users,
      gradient: "from-blue-400 to-purple-500"
    }
  ];

  // Сезонные миссии — разбиты по эпизодам
  const seasonMissions = [
    {
      id: "mission-1",
      title: "Мастерство Advanced React Patterns",
      purpose: "Прокачай compound components, render props и кастомные хуки для масштабируемых React-приложений.",
      tags: ["React", "JavaScript", "Архитектура"],
      timeEstimate: "3-4 часа",
      rewards: { mana: 350, xp: 150 },
      location: "Virtual Lab",
      participants: 24,
      difficulty: "Commander" as const,
      steps: 5,
      proofs: 3,
      episode: 1,
      isGroupMission: false,
      mentorRatingRequired: false
    },
    {
      id: "mission-2", 
      title: "Протокол Навигации Галактического Флота",
      purpose: "Веди сквад через сложные космо-навигационные челленджи. Требуется командная координация.",
      tags: ["Лидерство", "Навигация", "Teamwork"],
      timeEstimate: "2 часа",
      rewards: { mana: 450, xp: 200 },
      participants: 12,
      maxParticipants: 6,
      difficulty: "Admiral" as const,
      steps: 4,
      proofs: 2,
      episode: 1,
      isGroupMission: true,
      mentorRatingRequired: true,
      requiresTeam: true
    },
    {
      id: "mission-3",
      title: "Космический Менторский Цикл", 
      purpose: "Помоги джунам пройти первый навигационный челлендж и дай карьерный гайд.",
      tags: ["Менторство", "Обучение", "Навигация"],
      timeEstimate: "1.5 часа",
      rewards: { mana: 300, xp: 120 },
      isPaired: true,
      difficulty: "Navigator" as const,
      steps: 3,
      proofs: 2,
      episode: 1,
      isGroupMission: false,
      mentorRatingRequired: true
    },
    {
      id: "mission-4",
      title: "Периметр Безопасности Туманности",
      purpose: "Мульти-сквад операция по защите ключевых космо-маршрутов. Важна координация между командами.",
      tags: ["Security", "Операции", "Multi-Squad"],
      timeEstimate: "3-4 часа", 
      rewards: { mana: 600, xp: 300 },
      participants: 8,
      maxParticipants: 18,
      difficulty: "Fleet Admiral" as const,
      steps: 8,
      proofs: 5,
      episode: 2,
      isGroupMission: true,
      mentorRatingRequired: true,
      requiresTeam: true,
      isLocked: true
    }
  ];

  const currentEpisodeMissions = seasonMissions.filter(m => m.episode === 1 && !m.isLocked);

  // Обработчик открытия цепочки миссий
  const handleMissionChainOpen = (chainId: number) => {
    openMissionChainView(chainId.toString());
  };

  // Обработчик выбора миссии внутри цепочки (переход на экран деталей)
  const handleMissionSelect = (missionId: string) => {
    // Преобразуем строковый ID в number, если нужно
    const numericId = parseInt(missionId, 10);
    if (!isNaN(numericId)) {
      onMissionDetails(numericId); // Ведет на /mission-detail/:missionId
    }
  };

  // Обработчик запуска следующей миссии
  const handleStartNextMission = (missionId: string) => {
    const numericId = parseInt(missionId, 10);
    if (!isNaN(numericId)) {
      onMissionLaunch(numericId);
    }
  };

    return (
        <div className="min-h-screen bg-background relative">
          {/* Cosmic Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-soft-cyan/5 to-info/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-primary/5 to-navy-accent/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-br from-rewards-amber/10 to-transparent rounded-full blur-xl"></div>
          </div>
    
          <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                
                {/* Season Hero - Enhanced Cosmic Design */}
                {displayedSeason && (
                  <SeasonHubInfo 
                    season={displayedSeason}
                  />
                )}

                {/* Mock Active Events */}
                <SeasonHubActiveEvents cosmicEvents={cosmicEvents} />
    
                {/* Real Mission Chains */}
                {missionChains.length > 0 && <SeasonHubMissionChains onMissionChainOpen={handleMissionChainOpen} />}

                {/* Missions from Active Season */}
                <SeasonHubMissions 
                  currentSeason={activeSeason} 
                  missions={seasonUserMissions} 
                  user={user}
                  onMissionLaunch={onMissionLaunch} 
                  onMissionDetails={onMissionDetails} 
                />
    
                {/* Upcoming Seasons */}
                {upcomingSeasons.map((upcomingSeason) => (
                  <Card key={upcomingSeason.id} className="border-dashed border-2 border-primary/30 bg-primary/5">
                    <CardContent className="p-6 md:p-8 text-center space-y-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium">Следующий сезон: {upcomingSeason.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Начало: {upcomingSeason.startDate.toLocaleDateString('ru-RU')}
                      </p>
                      <div className="flex justify-center">
                        <Badge variant="outline">
                          <Star className="w-3 h-3 mr-1" />
                          Требуется ранг Навигатора
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
    
              <SeasonHubRightRail user={user} />
            </div>
          </div>

          {/* Mission Chain Overlay */}
          <MissionChainOverlay
            open={missionChainViewOpen}
            onOpenChange={closeMissionChainView}
            branchId={selectedMissionChainId}
            onMissionSelect={handleMissionSelect}
            onStartNextMission={handleStartNextMission}
          />
        </div>
      );
}