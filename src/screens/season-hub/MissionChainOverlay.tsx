import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, Play, Lock, ArrowDown, Star, Zap } from "lucide-react";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useUserStore } from "../../stores/useUserStore";
import { useMemo } from "react";

interface MissionChainOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branchId?: string | null;
    onMissionSelect: (missionId: string) => void;
    onStartNextMission: (missionId: string) => void;
  }
  
  export function MissionChainOverlay({ 
    open, 
    onOpenChange, 
    branchId,
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

    // Вычисляем прогресс на основе данных пользователя
    const completedMissionsInChain = orderedMissions.filter(mission => {
      const userMission = user?.getMissionById(mission.id);
      return userMission?.isCompleted || false;
    }).length;
    
    const progressPercentage = orderedMissions.length > 0 
      ? Math.round((completedMissionsInChain / orderedMissions.length) * 100)
      : 0;

    // Определяем статус миссии для пользователя
    const getMissionStatus = (mission: any, index: number): 'completed' | 'in_progress' | 'locked' | 'todo' => {
      // Проверяем, завершена ли миссия
      const userMission = user?.getMissionById(mission.id);
      if (userMission?.isCompleted) {
        return 'completed';
      }

      // Проверяем, выполняется ли миссия
      if (userMission && userMission.completedTasksCount > 0 && !userMission.isCompleted) {
        return 'in_progress';
      }
      
      // Проверяем зависимости
      const dependencies = chain.getPrerequisiteMissions(mission.id);
      if (dependencies.length > 0) {
        // Проверяем, все ли зависимости выполнены
        const allDependenciesCompleted = dependencies.every(dep => {
          const depUserMission = user?.getMissionById(dep.id);
          return depUserMission?.isCompleted || false;
        });
        
        if (!allDependenciesCompleted) {
          return 'locked';
        }
      }

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
  
    const nextAvailableMission = missionsWithStatus.find(m => m.status === "todo" || m.status === "in_progress");
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
        case "in_progress": return <Play className="w-4 h-4 text-info" />;
        case "locked": return <Lock className="w-4 h-4 text-muted-foreground" />;
        default: return <div className="w-4 h-4 border-2 border-border rounded-full" />;
      }
    };
  
    const getStatusLabel = (status: string) => {
      switch (status) {
        case "completed": return "Завершено";
        case "in_progress": return "В процессе";
        case "locked": return "Заблокировано";
        default: return "Доступно";
      }
    };
  
    const getStatusBadgeClass = (status: string) => {
      switch (status) {
        case "completed": return "bg-success/10 text-success border-success/20";
        case "in_progress": return "bg-info/10 text-info border-info/20";
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
        <DialogContent className="w-[90vw] max-w-[860px] h-[90vh] max-h-[800px] p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="border-b border-border bg-gradient-to-r from-card to-info/5 p-6 pb-4 rounded-t-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl font-semibold">{chain.name}</DialogTitle>
                </div>
                
                <p className="text-sm text-muted-foreground max-w-2xl">
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
          <div className="flex-1 overflow-y-auto p-6">
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
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm leading-tight">{mission.title}</h4>
                                  {mission.isMandatory && (
                                    <Badge variant="outline" className="text-xs bg-danger/10 text-danger border-danger/20">
                                      Обязательно
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {mission.description}
                                </p>
                                
                                <div className="flex items-center gap-2 flex-wrap">
                                  {mission.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  
                                  {mission.dependsOn.length > 0 && mission.status === "locked" && (
                                    <div className="flex flex-col gap-1 w-full">
                                      <Badge variant="outline" className="text-xs text-warning border-warning/20 w-fit">
                                        <Lock className="w-3 h-3 mr-1" />
                                        Требуется завершить:
                                      </Badge>
                                      <div className="flex flex-wrap gap-1">
                                        {mission.dependencyTitles.map((depTitle: string, idx: number) => (
                                          <Badge key={idx} variant="outline" className="text-xs bg-muted">
                                            {depTitle}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <Badge 
                                variant="outline" 
                                className={`text-xs shrink-0 ${getStatusBadgeClass(mission.status)}`}
                              >
                                {getStatusLabel(mission.status)}
                              </Badge>
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
          <div className="border-t border-border bg-background p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {nextAvailableMission ? (
                  <>Следующая: {nextAvailableMission.title}</>
                ) : (
                  "Все миссии завершены!"
                )}
              </div>
              
              <div className="flex items-center gap-3">
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
                    Начать миссию
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }