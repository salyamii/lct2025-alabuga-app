import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, Play, Lock, ArrowDown, Star, Zap, Clock } from "lucide-react";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useUserStore } from "../../stores/useUserStore";
import { useMemo } from "react";

interface MissionChainOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chainId?: string | null;
    onMissionSelect: (missionId: string) => void;
    onStartNextMission: (missionId: string) => void;
  }
  
  export function MissionChainOverlay({ 
    open, 
    onOpenChange, 
    chainId: branchId,
    onMissionSelect,
    onStartNextMission
  }: MissionChainOverlayProps) {
    
    const { missionChains } = useMissionChainStore();
    const { user } = useUserStore();

    // Находим цепочку миссий по ID
    const chain = useMemo(() => {
      if (!branchId) return null;
      return missionChains.find(mc => mc.id.toString() === branchId);
    }, [branchId, missionChains]);

    // Если цепочка не найдена, не показываем оверлей
    if (!chain) {
      return null;
    }

    // Получаем миссии в правильном порядке
    const orderedMissions = chain.getMissionsInOrder();

    // Вычисляем прогресс на основе данных пользователя (только завершенные и одобренные)
    const completedMissionsInChain = orderedMissions.filter(mission => {
      const userMission = user?.getMissionById(mission.id);
      return userMission?.isCompleted && userMission?.isApproved;
    }).length;
    
    const progressPercentage = orderedMissions.length > 0 
      ? Math.round((completedMissionsInChain / orderedMissions.length) * 100)
      : 0;

    // Определяем статус миссии для пользователя
    const getMissionStatus = (mission: any, index: number): 'completed' | 'in_progress' | 'pending_review' | 'locked' | 'todo' => {
      const userMission = user?.getMissionById(mission.id);
      
      // Проверяем зависимости - если есть незавершенные зависимости, миссия заблокирована
      const dependencies = chain.getPrerequisiteMissions(mission.id);
      if (dependencies.length > 0) {
        const allDependenciesCompleted = dependencies.every(dep => {
          const depUserMission = user?.getMissionById(dep.id);
          // Разрешаем переход при isCompleted, не требуем isApproved
          return Boolean(depUserMission?.isCompleted);
        });
        
        if (!allDependenciesCompleted) {
          return 'locked';
        }
      }

      // Если нет данных о миссии пользователя
      if (!userMission) {
        return 'todo';
      }

      // Завершена (isCompleted && isApproved)
      if (userMission.isCompleted && userMission.isApproved) {
        return 'completed';
      }

      // На проверке (isCompleted, но не isApproved)
      if (userMission.isCompleted && !userMission.isApproved) {
        return 'pending_review';
      }

      // Выполняется (есть выполненные задачи, но миссия не завершена)
      if (userMission.completedTasksCount > 0 && !userMission.isCompleted) {
        return 'in_progress';
      }

      // Доступна к выполнению
      return 'todo';
    };

    // Подготавливаем данные миссий для отображения
    const missionsWithStatus = orderedMissions.map((mission, index) => {
      const status = getMissionStatus(mission, index);
      const dependencies = chain.getPrerequisiteMissions(mission.id);
      
      return {
        id: mission.id.toString(),
        title: mission.title,
        description: mission.description,
        status,
        isMandatory: false, // TODO: добавить это в доменную модель если нужно
        tags: [mission.category].filter(Boolean), // Используем только категорию
        dependsOn: dependencies.map(dep => dep.id.toString()),
        dependencyTitles: dependencies.map(dep => dep.title), // Названия зависимостей
        position: chain.missionOrders.find(order => order.missionId === mission.id)?.order || 0
      };
    });
  
    // Следующая доступная к старту миссия (учитывая обновлённые правила блокировок)
    const nextAvailableMission = missionsWithStatus.find(m => m.status === 'todo' || m.status === 'in_progress');
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
        case "in_progress": return <Play className="w-4 h-4 text-info" />;
        case "pending_review": return <Clock className="w-4 h-4 text-orange-500" />;
        case "locked": return <Lock className="w-4 h-4 text-muted-foreground" />;
        default: return <div className="w-4 h-4 border-2 border-border rounded-full" />;
      }
    };
  
    const getStatusLabel = (status: string) => {
      switch (status) {
        case "completed": return "Завершено";
        case "in_progress": return "Выполняется";
        case "pending_review": return "На проверке";
        case "locked": return "Заблокировано";
        default: return "Доступно";
      }
    };
  
    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case "completed": return "bg-success/10 text-success border-success/20";
        case "in_progress": return "bg-info/10 text-info border-info/20";
        case "pending_review": return "bg-orange-50 text-orange-600 border-orange-200";
        case "locked": return "bg-muted text-muted-foreground border-muted";
        default: return "bg-primary/10 text-primary border-primary/20";
      }
    };
  
    const handleMissionClick = (mission: any) => {
      if (mission.status === "locked") return;
      
      // Close overlay first
      onOpenChange(false);
      
      // Then navigate to mission (will scroll to it on Season Hub)
      setTimeout(() => {
        onMissionSelect(mission.id);
      }, 200);
    };
  
    const handleStartNext = () => {
      if (!nextAvailableMission) return;
      
      // Close overlay first
      onOpenChange(false);
      
      // Then start the mission
      setTimeout(() => {
        onStartNextMission(nextAvailableMission.id);
      }, 200);
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="mx-auto w-[90vw] max-w-7xl max-h-90dvh p-0 overflow-hidden flex flex-col overflow-y-auto">
          {/* Header */}
          <DialogHeader className="border-b border-border bg-gradient-to-r from-card to-info/5 p-4 sm:p-6 pb-3 sm:pb-4 rounded-t-lg shrink-0">
            <div className="flex items-start justify-between min-w-0">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <DialogTitle className="text-xl font-semibold text-wrap line-clamp-2">{chain.name}</DialogTitle>
                </div>
                
                <p className="text-sm text-muted-foreground text-wrap text-left line-clamp-6">
                  {chain.description}
                </p>
                
                {/* Награды */}
                <div className="flex items-center gap-3 flex-wrap">
                  {chain.rewardXp > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {chain.rewardXp} XP
                    </Badge>
                  )}
                  {chain.rewardMana > 0 && (
                    <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                      <Zap className="w-3 h-3 mr-1" />
                      {chain.rewardMana} Мана
                    </Badge>
                  )}
                </div>
                
                {/* Прогресс */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span>{completedMissionsInChain} из {orderedMissions.length} миссий • {progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </DialogHeader>
  
          {/* Body - Дорожная карта миссий */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-40vh">
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Дорожная карта миссий</h3>
              
              <div className="space-y-3">
                {missionsWithStatus.map((mission, index) => (
                  <div key={mission.id} className="relative">
                    {/* Mission Card */}
                    <Card 
                      className={`card-enhanced cursor-pointer transition-all hover:shadow-md ${
                        mission.status === "locked" ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleMissionClick(mission)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Status Icon */}
                          <div className="shrink-0 mt-0.5">
                            {getStatusIcon(mission.status)}
                          </div>
                          
                          {/* Mission Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <h4 className="font-medium text-sm leading-tight text-wrap">{mission.title}</h4>
                                  {mission.isMandatory && (
                                    <Badge variant="outline" className="text-xs bg-danger/10 text-danger border-danger/20">
                                      Обязательно
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground leading-relaxed text-wrap line-clamp-4">
                                  {mission.description}
                                </p>
                                
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                  {mission.tags.map((tag) => (
                                    <div key={tag} className="min-w-0">
                                      <Badge variant="secondary" className="text-xs w-full">
                                        <span className="block truncate max-w-full">{tag}</span>
                                      </Badge>
                                    </div>
                                  ))}
                                  
                                  {mission.dependsOn.length > 0 && mission.status === "locked" && (
                                    <div className="flex flex-col gap-1 w-full">
                                      <div className="flex items-center gap-1 text-xs font-semibold">
                                        <Lock className="w-3 h-3" />
                                        <span>Требуется выполнить:</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1 min-w-0">
                                        {mission.dependencyTitles.map((depTitle: string, idx: number) => (
                                          <div key={idx} className="min-w-0">
                                            <Badge variant="outline" className="text-xs bg-muted w-full">
                                              <span className="block truncate max-w-full">{depTitle}</span>
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Стрелка зависимости */}
                    {index < missionsWithStatus.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="w-4 h-4 text-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Футер */}
          <div className="border-t border-border bg-background p-4 sm:p-6 shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground min-w-0">
                {nextAvailableMission ? (
                  <>
                    Следующая:
                    <span className="block text-wrap">
                      {nextAvailableMission.title}
                    </span>
                  </>
                ) : (
                  "Все миссии завершены!"
                )}
              </div>
              
              <div className="flex gap-3 justify-end w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)}
                  className="text-sm"
                >
                  Закрыть
                </Button>
                {nextAvailableMission && (
                  <Button 
                    onClick={handleStartNext}
                    className="bg-primary hover:bg-primary-600 text-white text-sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Начать миссию</span>
                    <span className="sm:hidden">Начать</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }