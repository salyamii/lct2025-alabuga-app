import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Target, 
  Clock, 
  MapPin, 
  Users, 
  Coins, 
  CheckCircle2, 
  Award, 
  Camera,
  QrCode,
  Radio,
  Code,
  Key,
  Zap
} from "lucide-react";
import { useMissionStore } from "../../stores/useMissionStore";
import { useUserStore } from "../../stores/useUserStore";
import { useRankStore } from "../../stores/useRankStore";

interface MissionDetailScreenProps {
    onBack: () => void;
  }
  
  export function MissionDetailScreen({ onBack }: MissionDetailScreenProps) {
    const { missionId } = useParams<{ missionId: string }>();
    const navigate = useNavigate();
    const { missions, fetchMissionById, isLoading } = useMissionStore();
    const { user } = useUserStore();
    const { ranks, fetchRanks } = useRankStore();

    // Загружаем данные
    useEffect(() => {
      if (missionId) {
        fetchMissionById(parseInt(missionId, 10));
      }
      if (ranks.length === 0) {
        fetchRanks();
      }
    }, [missionId]);

    // Обработчик начала миссии
    const handleStartMission = () => {
      if (missionId) {
        navigate(`/mission/${missionId}`);
      }
    };

    // Находим миссию из store
    const mission = missions.find(m => m.id === parseInt(missionId || '0', 10));
    const userMission = user?.getMissionById(parseInt(missionId || '0', 10));

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Загрузка миссии...</p>
          </div>
        </div>
      );
    }

    if (!mission) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">Миссия не найдена</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
          </div>
        </div>
      );
    }

    // Находим ранг
    const requiredRank = ranks.find(r => r.id === mission.rankRequirement);

    // Mock данные (время, локация, участники)
    const mockData = {
      timeEstimate: "2-3 часа",
      location: "Производственный цех",
      participants: 15
    };

    // Собираем все навыки из наград компетенций
    const skillsFromRewards = mission.rewardCompetencies.flatMap(reward => 
      reward.competency.name
    ).concat(
      mission.rewardSkills.map(reward => reward.skill.name)
    );

    // Типы доказательств с иконками и описаниями
    const proofTypes = [
      {
        id: "photo",
        title: "Фотография",
        description: "Сделайте фото результата работы или процесса выполнения задания",
        icon: Camera,
        iconColor: "text-blue-500"
      },
      {
        id: "qr",
        title: "QR-код",
        description: "Отсканируйте QR-код на оборудовании или в указанной локации",
        icon: QrCode,
        iconColor: "text-purple-500"
      },
      {
        id: "rfid",
        title: "RFID метка",
        description: "Приложите карту к считывателю для подтверждения присутствия",
        icon: Radio,
        iconColor: "text-green-500"
      },
      {
        id: "code",
        title: "Фрагмент кода",
        description: "Загрузите код решения или результат выполнения программы",
        icon: Code,
        iconColor: "text-orange-500"
      },
      {
        id: "secret",
        title: "Секретное слово",
        description: "Получите секретное слово от ментора после проверки работы",
        icon: Key,
        iconColor: "text-amber-500"
      }
    ];

    // Вычисляем прогресс пользователя по задачам миссии
    const completedTasksCount = userMission?.completedTasksCount || 0;
    const totalTasksCount = userMission?.totalTasksCount || mission.tasks.length;
    const taskProgress = userMission?.progress || 0;

    const isGroupMission = mission.category === "Group";
    const isPairedMission = mission.category === "Paired";
  
  return (
    <div className="min-h-screen-dvh bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-semibold text-wrap line-clamp-2">{mission.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="text-xs bg-primary/90 text-white border-primary">
                    {requiredRank?.name || `Ранг ${mission.rankRequirement}`}
                  </Badge>
                  {isPairedMission && (
                    <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/40 font-semibold">
                      <Users className="w-3 h-3 mr-1" />
                      Paired
                    </Badge>
                  )}
                  {isGroupMission && (
                    <Badge variant="outline" className="text-xs bg-info/20 text-info border-info/40 font-semibold">
                      Группа
                    </Badge>
                  )}
                  {userMission?.isCompleted && (
                    <Badge variant="outline" className="text-xs bg-success/20 text-success border-success/40 font-semibold">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Завершено
                    </Badge>
                  )}
                </div>
              </div>
              {!userMission?.isCompleted && (
                <Button 
                  className="bg-primary hover:bg-primary-600 text-white h-12 w-auto"
                  onClick={handleStartMission}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Начать миссию
                </Button>
              )}
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 min-w-0">
          <div className="space-y-6">
            {/* Mission Overview */}
            <Card className="orbital-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Обзор миссии
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-wrap">{mission.description}</p>
                
                {/* Mission Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{mockData.timeEstimate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{mockData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{mockData.participants} участников</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="w-4 h-4 text-rewards-amber" />
                    <span className="font-mono font-semibold">{mission.rewardMana} Мана</span>
                  </div>
                </div>

                {/* Skills from Competencies */}
                {skillsFromRewards.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skillsFromRewards.map((skillName, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30 font-semibold">
                        {skillName}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
  
            {/* Progress Tracking */}
            <Card className="orbital-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Прогресс миссии
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Общий прогресс</span>
                    <span className="text-sm font-mono">{completedTasksCount}/{totalTasksCount} задач</span>
                  </div>
                  <Progress value={taskProgress} className="h-2" />
                  
                  {/* Задачи миссии */}
                  {userMission && userMission.tasks.length > 0 ? (
                    <div className="space-y-3 mt-6">
                      {userMission.tasks.map((task, index) => (
                        <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            task.isCompleted 
                              ? 'bg-success text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {task.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Задачи появятся после начала миссии</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
  
            {/* Rewards Section */}
            {mission.rewardCompetencies.length > 0 || mission.rewardSkills.length > 0 || mission.rewardArtifacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Competencies Rewards */}
                {mission.rewardCompetencies.length > 0 && (
                  <Card className="orbital-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-info" />
                        Награды за компетенции
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mission.rewardCompetencies.map((reward) => (
                          <div key={reward.competency.id} className="flex items-center justify-between">
                            <span className="text-sm">{reward.competency.name}</span>
                            <Badge variant="outline" className="text-xs bg-info/15 text-info border-info/40 font-semibold">
                              +{reward.levelIncrease} уровень
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Skills Rewards */}
                {mission.rewardSkills.length > 0 && (
                  <Card className="orbital-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Награды за навыки
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mission.rewardSkills.map((reward) => (
                          <div key={reward.skill.id} className="flex items-center justify-between">
                            <span className="text-sm">{reward.skill.name}</span>
                            <Badge variant="outline" className="text-xs bg-primary/15 text-primary border-primary/40 font-semibold">
                              +{reward.levelIncrease} уровень
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}

            {/* Artifacts Rewards */}
            {mission.rewardArtifacts.length > 0 && (
              <Card className="orbital-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-rewards-amber" />
                    Артефакты-награды
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mission.rewardArtifacts.map((artifact) => (
                      <Badge key={artifact.id} variant="outline" className="text-sm bg-accent-yellow/15 text-accent-yellow border-accent-yellow/40 font-semibold">
                        {artifact.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proof Requirements */}
            <Card className="orbital-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-text-icon" />
                  Требования для подтверждения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proofTypes.map((proof) => {
                    const IconComponent = proof.icon;
                    return (
                      <div key={proof.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className={`w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 ${proof.iconColor}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{proof.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{proof.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Start Mission CTA */}
            {!userMission?.isCompleted && (
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-600 text-white px-8"
                  onClick={handleStartMission}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Начать миссию
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }