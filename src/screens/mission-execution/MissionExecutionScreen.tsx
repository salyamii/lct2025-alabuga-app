import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { 
  ArrowLeft, 
  Star, 
  Zap, 
  Target, 
  CheckCircle,
  Clock,
  Award,
  Camera,
  QrCode,
  Radio,
  Code,
  Key,
  Upload,
  Trash2
} from "lucide-react";
import { useMissionStore } from "../../stores/useMissionStore";
import { useUserStore } from "../../stores/useUserStore";
import { useRankStore } from "../../stores/useRankStore";

interface MissionExecutionScreenProps {
  onBack: () => void;
  onCompleteMission?: (missionId: number) => void;
}

export function MissionExecutionScreen({ onBack, onCompleteMission }: MissionExecutionScreenProps) {
  const { missionId } = useParams<{ missionId: string }>();
  const { missions, fetchMissionById, isLoading } = useMissionStore();
  const { 
    user,
    fetchUserProfile, 
    fetchUserMission,
    completeTaskLocal, 
    uncompleteTask, 
    completeMission: completeUserMission 
  } = useUserStore();
  const { ranks } = useRankStore();

  // Находим миссию по ID
  const mission = missions.find(m => m.id.toString() === missionId);
  const userMission = user?.getMissionById(parseInt(missionId || '0', 10));

  // Загружаем профиль пользователя, если его нет
  useEffect(() => {
    if (!user) {
      console.log('⚠️ User not found, loading profile...');
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  // Загружаем миссию, если её нет в сторе
  useEffect(() => {
    if (missionId && !mission && !isLoading) {
      fetchMissionById(parseInt(missionId, 10));
    }
  }, [missionId, mission, isLoading, fetchMissionById]);

  // Загружаем UserMission с сервера, если её еще нет у пользователя
  useEffect(() => {
    if (missionId && !userMission && user) {
      console.log('📥 Loading user mission from server:', missionId);
      fetchUserMission(parseInt(missionId, 10));
    }
  }, [missionId, userMission, user, fetchUserMission]);

  // Обработчики задач
  const handleToggleTask = (taskId: number) => {
    if (!missionId) return;
    
    const numericMissionId = parseInt(missionId, 10);
    const userTask = userMission?.tasks.find(t => t.id === taskId);
    
    console.log('🔄 Toggle task:', {
      taskId,
      missionId: numericMissionId,
      currentStatus: userTask?.isCompleted,
      userMissionExists: !!userMission,
      tasksCount: userMission?.tasks.length
    });
    
    if (userTask?.isCompleted) {
      console.log('⬇️ Uncompleting task...');
      uncompleteTask(numericMissionId, taskId);
    } else {
      console.log('✅ Completing task...');
      completeTaskLocal(numericMissionId, taskId);
    }
  };

  // Обработчик завершения миссии
  const handleCompleteMission = () => {
    if (!missionId || !mission || !user) return;
    
    const numericMissionId = parseInt(missionId, 10);
    
    // Сохраняем текущий ранг для проверки повышения
    const currentRankId = user.rankId;
    const currentRank = ranks.find(r => r.id === currentRankId);
    const newXP = user.xp + mission.rewardXp;
    
    // Обновляем локальный store с начислением наград
    completeUserMission(numericMissionId);
    
    // Проверяем, был ли повышен ранг
    const availableRanks = ranks.filter(rank => rank.requiredXp <= newXP);
    const highestRank = availableRanks.length > 0
      ? availableRanks.reduce((prev, current) => 
          (current.requiredXp > prev.requiredXp) ? current : prev
        )
      : null;
    
    const rankIncreased = highestRank && highestRank.id !== currentRankId;
    
    // Формируем описание наград
    const rewardParts = [];
    
    // Основные награды
    rewardParts.push(`+${mission.rewardXp} XP`);
    rewardParts.push(`+${mission.rewardMana} Мана`);
    
    // Артефакты
    if (mission.rewardArtifacts.length > 0) {
      rewardParts.push(`+${mission.rewardArtifacts.length} ${mission.rewardArtifacts.length === 1 ? 'Артефакт' : 'Артефактов'}`);
    }
    
    // Компетенции
    if (mission.rewardCompetencies.length > 0) {
      const compCount = mission.rewardCompetencies.length;
      rewardParts.push(`${compCount} ${compCount === 1 ? 'компетенция' : 'компетенций'} улучшено`);
    }
    
    // Навыки
    if (mission.rewardSkills.length > 0) {
      const skillCount = mission.rewardSkills.length;
      rewardParts.push(`${skillCount} ${skillCount === 1 ? 'навык' : 'навыков'} улучшено`);
    }
    
    // Показываем уведомление о наградах
    toast.success('🎉 Миссия завершена!', {
      description: rewardParts.join(', '),
      duration: 5000,
    });
    
    // Показываем отдельное уведомление о повышении ранга
    if (rankIncreased && highestRank) {
      setTimeout(() => {
        toast.success('⬆️ Повышение ранга!', {
          description: `${currentRank?.name || 'Ранг'} → ${highestRank.name}`,
          duration: 6000,
        });
      }, 500);
    }
    
    // Вызываем проп для отправки на сервер
    if (onCompleteMission) {
      onCompleteMission(numericMissionId);
    }
  };

  // Типы доказательств для заданий
  const proofTypes = [
    { id: "photo", title: "Прикрепить фото", icon: Camera, color: "text-blue-500" },
    { id: "qr", title: "Сканировать QR", icon: QrCode, color: "text-purple-500" },
    { id: "rfid", title: "Приложить метку", icon: Radio, color: "text-green-500" },
    { id: "code", title: "Прикрепить код", icon: Code, color: "text-orange-500" },
    { id: "secret", title: "Ввести слово", icon: Key, color: "text-amber-500" }
  ];

  // Рандомный выбор proof requirement для каждого задания
  const getRandomProof = (taskId: number) => {
    const index = taskId % proofTypes.length;
    return proofTypes[index];
  };

  // Группируем навыки по компетенциям
  const groupedRewards = useMemo(() => {
    if (!mission) return { competencies: [], standaloneSkills: [] };

    const competenciesMap = new Map();
    const standaloneSkills: any[] = [];

    // Добавляем навыки из компетенций
    mission.rewardCompetencies.forEach(compReward => {
      competenciesMap.set(compReward.competency.id, {
        competency: compReward.competency,
        levelIncrease: compReward.levelIncrease,
        skills: []
      });
    });

    // Распределяем навыки
    mission.rewardSkills.forEach(skillReward => {
      // Проверяем, есть ли навык в какой-то компетенции
      let addedToCompetency = false;
      
      mission.rewardCompetencies.forEach(compReward => {
        const skillInComp = compReward.competency.skills?.find(
          s => s.id === skillReward.skill.id
        );
        if (skillInComp) {
          const comp = competenciesMap.get(compReward.competency.id);
          if (comp) {
            comp.skills.push(skillReward);
            addedToCompetency = true;
          }
        }
      });

      if (!addedToCompetency) {
        standaloneSkills.push(skillReward);
      }
    });

    return {
      competencies: Array.from(competenciesMap.values()),
      standaloneSkills
    };
  }, [mission]);

  // Определяем статус выполнения миссии на основе данных из userMission
  const totalTasksCount = mission?.tasks.length || 0;
  const completedTasksCount = userMission?.completedTasksCount || 0;
  const allTasksCompleted = totalTasksCount > 0 && completedTasksCount === totalTasksCount;

  // Логирование для отладки
  console.log('🔍 Mission state:', {
    missionId,
    hasMission: !!mission,
    hasUserMission: !!userMission,
    completedTasks: completedTasksCount,
    totalTasks: totalTasksCount,
    userMissionTasks: userMission?.tasks.map(t => ({ id: t.id, completed: t.isCompleted }))
  });

  const getMissionStatus = () => {
    if (userMission?.isCompleted) return 'completed';
    if (completedTasksCount > 0 && completedTasksCount < totalTasksCount) return 'in_progress';
    if (allTasksCompleted) return 'ready_to_complete';
    return 'not_started';
  };

  const missionStatus = getMissionStatus();
  const statusLabels = {
    'not_started': 'Не начата',
    'in_progress': 'Выполняется',
    'ready_to_complete': 'Готова к завершению',
    'completed': 'Завершена'
  };
  const statusColors = {
    'not_started': 'bg-muted text-muted-foreground',
    'in_progress': 'bg-info/10 text-info border-info/30',
    'ready_to_complete': 'bg-warning/10 text-warning border-warning/30',
    'completed': 'bg-success/10 text-success border-success/30'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка миссии...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Миссия не найдена</p>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться назад
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-soft-cyan/5 to-info/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-primary/5 to-navy-accent/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 relative">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <Card className="cosmic-gradient text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
            <CardContent className="p-6 relative">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {mission.category}
                    </Badge>
                    <Badge variant="outline" className={`${statusColors[missionStatus]} border`}>
                      {statusLabels[missionStatus]}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">{mission.title}</h1>
                  <p className="text-white/80 mt-2">{mission.description}</p>
                </div>

                {/* Награды */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Star className="w-3 h-3 mr-1" />
                      {mission.rewardXp} XP
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Zap className="w-3 h-3 mr-1" />
                      {mission.rewardMana} Мана
                    </Badge>
                    {mission.rewardArtifacts.length > 0 && (
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Award className="w-3 h-3 mr-1" />
                        {mission.rewardArtifacts.length} {mission.rewardArtifacts.length === 1 ? 'Артефакт' : 'Артефактов'}
                      </Badge>
                    )}
                  </div>

                  {/* Прогресс компетенций */}
                  {groupedRewards.competencies.length > 0 && (
                    <div className="text-white/90 text-sm">
                      <div className="font-medium mb-2">Прогресс компетенций:</div>
                      {groupedRewards.competencies.map(comp => (
                        <div key={comp.competency.id} className="ml-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span>• {comp.competency.name}</span>
                            <span className="text-white/60">(+{comp.levelIncrease})</span>
                          </div>
                          {comp.skills.length > 0 && (
                            <div className="ml-4 mt-1 space-y-1">
                              {comp.skills.map((skill: any) => (
                                <div key={skill.skill.id} className="flex items-center gap-2 text-xs text-white/70">
                                  <span>- {skill.skill.name}</span>
                                  <span className="text-white/50">(+{skill.levelIncrease})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Прогресс других навыков */}
                  {groupedRewards.standaloneSkills.length > 0 && (
                    <div className="text-white/90 text-sm">
                      <div className="font-medium mb-2">Прогресс других навыков:</div>
                      {groupedRewards.standaloneSkills.map((skill: any) => (
                        <div key={skill.skill.id} className="ml-2 flex items-center gap-2">
                          <span>• {skill.skill.name}</span>
                          <span className="text-white/60">(+{skill.levelIncrease})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Задачи миссии */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Задачи миссии
          </h2>

          {/* Подсказка для незаинтых миссий */}
          {missionStatus === 'not_started' && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Чтобы начать выполнение миссии, выполните хотя бы одно задание. Рекомендуем выполнять задания поочередно.
                </p>
              </CardContent>
            </Card>
          )}

          {mission.tasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Задачи для этой миссии пока не добавлены
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mission.tasks.map((task, index) => {
                const userTask = userMission?.tasks.find(t => t.id === task.id);
                const isTaskCompleted = userTask?.isCompleted || false;
                const proofType = getRandomProof(task.id);
                const ProofIcon = proofType.icon;

                return (
                  <Card key={task.id} className={`card-enhanced ${isTaskCompleted ? 'border-success/30 bg-success/5' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isTaskCompleted 
                            ? 'bg-success text-white' 
                            : 'border-2 border-primary'
                        }`}>
                          {isTaskCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isTaskCompleted && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${proofType.color}`}
                              >
                                <ProofIcon className="w-4 h-4 mr-2" />
                                {proofType.title}
                              </Button>
                            )}
                            <Button 
                              variant={isTaskCompleted ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleTask(task.id)}
                              className={isTaskCompleted ? 'text-danger border-danger/30' : ''}
                            >
                              {isTaskCompleted ? (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Удалить решение
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Выполнить задание
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        {isTaskCompleted && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                            Завершено
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Финальные доказательства */}
          <Card className="orbital-border mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Финальное подтверждение миссии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                После выполнения всех заданий прикрепите финальные доказательства
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" disabled={!allTasksCompleted}>
                  <Camera className="w-4 h-4 mr-2 text-blue-500" />
                  Итоговое фото
                </Button>
                <Button variant="outline" size="sm" disabled={!allTasksCompleted}>
                  <Code className="w-4 h-4 mr-2 text-orange-500" />
                  Код проекта
                </Button>
                <Button variant="outline" size="sm" disabled={!allTasksCompleted}>
                  <Key className="w-4 h-4 mr-2 text-amber-500" />
                  Подтверждение ментора
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Кнопка завершения миссии */}
          <Card className={`mt-6 ${allTasksCompleted ? 'border-success/50 bg-success/5 shadow-lg' : 'border-muted'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {allTasksCompleted ? 'Все задания выполнены!' : 'Прогресс выполнения'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {completedTasksCount} из {totalTasksCount} заданий
                    </span>
                    <Progress value={(completedTasksCount / totalTasksCount) * 100} className="h-2 w-48" />
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className={`${
                    allTasksCompleted 
                      ? 'bg-success hover:bg-success/80 text-white animate-pulse' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!allTasksCompleted || userMission?.isCompleted}
                  onClick={handleCompleteMission}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {userMission?.isCompleted ? 'Миссия завершена' : 'Завершить миссию'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
