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
import { SeasonInfo } from "./SeasonInfo";
import { SeasonActiveEvents } from "./SeasonActiveEvents";
import { MissionChainCard } from "./MissionChainCard";
import { MissionCard } from "./MissionCard";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useMissionStore } from "../../stores/useMissionStore";

interface SeasonHubProps {
    onSkillPathOpen: () => void;
    onMissionLaunch: (missionId: string) => void;
    onMissionDetails: (missionId: string) => void;
    onSquadronDetails: () => void;
    onShipLogOpen: () => void;
    onMentorRatingOpen?: () => void;
    onSeasonSettings?: () => void;
    onBranchOpen?: (branchId: string) => void;
  }

  export function SeasonHub({ 
    onSkillPathOpen, 
    onMissionLaunch, 
    onMissionDetails, 
    onSquadronDetails,
    onShipLogOpen,
    onMentorRatingOpen,
    onSeasonSettings,
    onBranchOpen
  }: SeasonHubProps) {


    const { seasons, currentSeason, isLoading } = useSeasonStore();
    const { missions } = useMissionStore();

    const displayedSeason = {
        id: currentSeason?.id.toString() || "unknown",
        name: currentSeason?.name || "unknown",
        phase: "Операции в глубоком космосе",
        description: "Навигация через сложные космические задачи и установка новых торговых маршрутов",
        timeRemaining: currentSeason ? `${currentSeason.getRemainingDays()} дней` : "unknown дней",
        progress: 67,
        totalMissions: 12,
        completedMissions: 8,
        participants: 2847,
        rewards: {
          seasonBadge: "Навигатор Дельты",
          finalReward: "Сертификат Командира Космических Операций",
          bonusMana: 2500
        }
      };

      // Season Branches - mission chains with different completion rules
  const seasonBranches = [
    {
      id: "branch-recruiting",
      title: "Рекрутинг • Оффер",
      description: "Завершите процесс рекрутинга от оценки кандидата до доставки окончательного оффера",
      rule: {
        type: "MAND_AND_ANY" as const,
        display: "Обязательно 3 + Любые 2"
      },
      progress: {
        completed: 3,
        total: 6
      },
      nextMission: {
        title: "Согласовать процесс найма"
      },
      rewards: {
        xp: 100,
        mana: 150,
        artifacts: ["Специалист найма", "Искатель талантов"]
      }
    },
    {
      id: "branch-tech-mastery",
      title: "Тех-мастерство • Фронтенд",
      description: "Прокачай frontend-скиллы: от React-паттернов до оптимизации перформанса",
      rule: {
        type: "ALL" as const,
        display: "Все обязательны"
      },
      progress: {
        completed: 2,
        total: 4
      },
      nextMission: {
        title: "Оптимизация перформанса"
      },
      rewards: {
        xp: 1200,
        mana: 1500,
        artifacts: ["Мастер фронтенда", "Эксперт по перформансу"]
      }
    }
  ];

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
                <SeasonInfo 
                  season={displayedSeason}
                  onSkillPathOpen={onSkillPathOpen}
                  onSeasonSettings={onSeasonSettings}
                />

                <SeasonActiveEvents cosmicEvents={cosmicEvents} />
    
                {/* Branches this Season */}
                {seasonBranches.length > 0 && onBranchOpen && (
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-info" />
                      <h3 className="text-lg font-semibold">Цепочки заданий этого сезона</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Связанные цепочки заданий. Завершите все или только необходимые.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {seasonBranches.map((branch) => (
                        <MissionChainCard
                          key={branch.id}
                          branch={branch}
                          onOpenBranch={onBranchOpen}
                        />
                      ))}
                    </div>
                  </div>
                )}
    
                {/* Episode Missions */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Satellite className="w-5 h-5 text-primary" />
                      <h3 className="text-lg md:text-xl font-semibold">Эпизод 1: Первый контакт</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit">
                      {currentEpisodeMissions.length} миссий доступно
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {currentEpisodeMissions.map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onLaunch={onMissionLaunch}
                        onViewDetails={onMissionDetails}
                      />
                    ))}
                  </div>
                </div>
    
                {/* Next Episode Preview */}
                <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                  <CardContent className="p-6 md:p-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium">Эпизод 2: Глубокие космо-операции</h4>
                    <p className="text-sm text-muted-foreground">
                      Завершите миссии эпизода 1, чтобы открыть более сложные мульти-сквад операции.
                    </p>
                    <div className="flex justify-center">
                      <Badge variant="outline">
                        <Star className="w-3 h-3 mr-1" />
                        Требуется ранг Навигатора
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
    
              {/* Enhanced Right Rail */}
              <div className="space-y-4 md:space-y-6 lg:block">
                
                {/* Enhanced Flight Status */}
                <Card className="orbital-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-rewards-amber" />
                      Статус полёта
                      <Sparkles className="w-4 h-4 text-primary ml-auto" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Текущий ранг</span>
                        <Badge className="bg-primary-200 text-primary-600">Космический кадет</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">XP полёта</span>
                        <span className="font-mono text-sm md:text-base">2,450 / 3,000</span>
                      </div>
                      <Progress value={81.7} className="h-2" />
                      <p className="text-xs text-muted-foreground">550 XP to Commander</p>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Баланс маны</span>
                        <span className="font-mono text-lg text-rewards-amber">1,250</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                {/* Enhanced Squadron Progress */}
                <Card className="orbital-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-info" />
                      Сквад Альфа-7
                      <Globe className="w-4 h-4 text-soft-cyan ml-auto" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Еженедельная цель</span>
                        <span className="text-sm">18 / 25 миссий</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Активные пилоты</span>
                        <span>8 / 12</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Средний рейтинг</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-rewards-amber" />
                          4.8
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Глобальный ранг</span>
                        <span className="text-success">#23 / 847</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={onSquadronDetails}
                    >
                      Команда сквада
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
    
                {/* Enhanced Ship Log */}
                <Card className="orbital-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-text-icon" />
                      Журнал полёта
                      <Badge variant="secondary" className="text-xs ml-auto">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Групповая миссия завершена</p>
                          <p className="text-muted-foreground text-xs">Галактический флот навигации • 2 часа назад</p>
                          <Badge className="text-xs mt-1 bg-success/10 text-success">+450 Mana</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Рейтинг ментора получен</p>
                          <p className="text-muted-foreground text-xs">⭐⭐⭐⭐⭐ от Alex Chen • 5 часов назад</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-rewards-amber rounded-full mt-2 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Космический ивент присоединён</p>
                          <p className="text-muted-foreground text-xs">Слияние звёзд • 6 часов назад</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={onShipLogOpen}
                      >
                        Посмотреть полный журнал
                        <TrendingUp className="w-4 h-4 ml-2" />
                      </Button>
                      
                      {onMentorRatingOpen && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs bg-info/5 hover:bg-info/10 text-info border-info/30"
                          onClick={onMentorRatingOpen}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Демо: Оценить ментора
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      );
}