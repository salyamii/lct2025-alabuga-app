import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Rocket, 
  CheckCircle, 
  Circle,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Zap
} from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { User, UserMission } from "../../domain";
import { Skeleton } from "../../components/ui/skeleton";

interface UserPreviewOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLogin: string | null;
}

export function UserPreviewOverlay({
  open,
  onOpenChange,
  userLogin,
}: UserPreviewOverlayProps) {
  const { fetchUser, fetchUserMissionsByLogin } = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMissions, setExpandedMissions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open && userLogin) {
      loadUserData();
    } else {
      // Сбрасываем данные при закрытии
      setUser(null);
      setUserMissions([]);
      setExpandedMissions(new Set());
    }
  }, [open, userLogin]);

  const loadUserData = async () => {
    if (!userLogin) return;
    
    setIsLoading(true);
    try {
      // Загружаем основную информацию пользователя
      const userData = await fetchUser(userLogin);
      setUser(userData);

      // Загружаем миссии пользователя
      const missionsData = await fetchUserMissionsByLogin(userLogin);
      setUserMissions(missionsData);
    } catch (error) {
      // Ошибка уже залогирована в сторе
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMissionExpand = (missionId: number) => {
    setExpandedMissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(missionId)) {
        newSet.delete(missionId);
      } else {
        newSet.add(missionId);
      }
      return newSet;
    });
  };

  const getRoleText = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'hr':
        return 'HR';
      case 'candidate':
        return 'Кандидат';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
  };

  const getMissionStatusColor = (mission: UserMission) => {
    if (mission.isCompleted) {
      return 'bg-success/10 text-success border-success/30';
    }
    if (mission.completedTasksCount > 0) {
      return 'bg-warning/10 text-warning border-warning/30';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  const getMissionStatusText = (mission: UserMission) => {
    if (mission.isCompleted) {
      return 'Завершена';
    }
    if (mission.completedTasksCount > 0) {
      return 'В процессе';
    }
    return 'Не начата';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Информация о пользователе</DialogTitle>
          <DialogDescription>
            {user ? `${user.fullName} (${user.login})` : userLogin || 'Загрузка данных пользователя...'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Основная информация пользователя */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-lg">Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {user.login}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    {getRoleText(user.role)}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.xp}</div>
                    <div className="text-xs text-muted-foreground">Опыт</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">{user.mana}</div>
                    <div className="text-xs text-muted-foreground">Мана</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{user.artifacts.length}</div>
                    <div className="text-xs text-muted-foreground">Артефакты</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Миссии пользователя */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    <Rocket className="w-5 h-5 inline-block mr-2" />
                    Миссии ({userMissions.length})
                  </CardTitle>
                  <Badge variant="outline" className="text-sm">
                    {userMissions.filter(m => m.isCompleted).length} завершено
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {userMissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    У пользователя нет миссий
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userMissions.map((mission) => (
                      <Card key={mission.id} className="border">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Заголовок миссии */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{mission.title}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getMissionStatusColor(mission)}`}
                                  >
                                    {getMissionStatusText(mission)}
                                  </Badge>
                                  {mission.isCompleted && (
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        mission.isApproved 
                                          ? 'bg-success/10 text-success border-success/30' 
                                          : 'bg-warning/10 text-warning border-warning/30'
                                      }`}
                                    >
                                      {mission.isApproved ? 'Подтверждена' : 'Ожидает подтверждения'}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>ID: {mission.id}</span>
                                  <span>•</span>
                                  <span>{mission.category}</span>
                                  <span>•</span>
                                  <span>Ранг: {mission.rankRequirement}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMissionExpand(mission.id)}
                                className="shrink-0"
                              >
                                {expandedMissions.has(mission.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {/* Награды */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="font-medium">{mission.rewardXp}</span>
                                <span className="text-muted-foreground">XP</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4 text-info" />
                                <span className="font-medium">{mission.rewardMana}</span>
                                <span className="text-muted-foreground">Mана</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-success" />
                                <span className="font-medium">{mission.rewardArtifacts.length}</span>
                                <span className="text-muted-foreground">Артефактов</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{mission.rewardCompetencies.length}</span>
                                <span className="text-muted-foreground">Компетенций</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{mission.rewardSkills.length}</span>
                                <span className="text-muted-foreground">Навыков</span>
                              </div>
                            </div>

                            {/* Раскрывающийся блок с заданиями */}
                            {expandedMissions.has(mission.id) && (
                              <>
                                <Separator />
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium">
                                    Задания ({mission.completedTasksCount}/{mission.totalTasksCount})
                                  </h5>
                                  <div className="space-y-2">
                                    {mission.tasks.map((task, index) => (
                                      <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                                      >
                                        <div className="shrink-0 mt-0.5">
                                          {task.isCompleted ? (
                                            <CheckCircle className="w-4 h-4 text-success" />
                                          ) : (
                                            <Circle className="w-4 h-4 text-muted-foreground" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium">{task.title}</div>
                                          <div className="text-xs text-muted-foreground">ID: {task.id}</div>
                                        </div>
                                        {task.isCompleted && (
                                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                            Выполнено
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Пользователь не найден
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

