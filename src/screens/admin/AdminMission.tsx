import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Plus, Search, Link2, Target, Zap, Award, Filter, Edit, Trash2, Clock, Users, Star } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useState, useEffect } from "react";
import { useMissionStore } from "../../stores/useMissionStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { Mission } from "../../domain/mission";
import { MissionChain } from "../../domain/missionChain";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface AdminMissionProps {
  handleCreateMission: () => void;
  handleEditMission: (mission: any) => void;
  handleDeleteMission: (mission: any) => void;
  setSelectedMission: (mission: any) => void;
  handleCreateChain: () => void;
  handleEditChain: (chain: any) => void;
  handleDeleteChain: (chain: any) => void;
  setSelectedChain: (chain: any) => void;
}

export function AdminMission({
  handleCreateMission,
  handleEditMission,
  handleDeleteMission,
  setSelectedMission,
  handleCreateChain,
  handleEditChain,
  handleDeleteChain,
  setSelectedChain,
}: AdminMissionProps) {
  const { missions, fetchMissions } = useMissionStore();
  const { missionChains, fetchMissionChains } = useMissionChainStore();
  const { currentSeason } = useSeasonStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Состояние для диалога удаления цепочки
  const [chainDeleteOpen, setChainDeleteOpen] = useState(false);
  const [chainToDelete, setChainToDelete] = useState<MissionChain | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMissions(),
          fetchMissionChains(),
        ]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchMissions, fetchMissionChains]);

  // Функция для получения статуса миссии
  const getMissionStatus = (mission: Mission) => {
    if (mission.tasks.length === 0) return "draft";
    if (mission.rewardArtifacts.length === 0 && mission.rewardCompetencies.length === 0 && mission.rewardSkills.length === 0) return "incomplete";
    return "active";
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "incomplete": return "bg-yellow-500";
      case "draft": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активная";
      case "incomplete": return "Неполная";
      case "draft": return "Черновик";
      default: return "Неизвестно";
    }
  };

  // const missions = [
  //   {
  //     id: "mission-1",
  //     title: "Web Development Basics",
  //     status: "active",
  //     participants: 500,
  //     completionRate: 90,
  //     createdDate: "2024-01-01",
  //   },
  //   {
  //     id: "mission-2",
  //     title: "Advanced JavaScript",
  //     status: "completed",
  //     participants: 300,
  //     completionRate: 100,
  //     createdDate: "2023-12-01",
  //   },
  //   {
  //     id: "mission-3",
  //     title: "Data Structures and Algorithms",
  //     status: "upcoming",
  //     participants: 0,
  //     completionRate: 0,
  //     createdDate: "2024-06-01",
  //   },
  // ];

  // Функция для получения статуса цепочки миссий
  const getChainStatus = (chain: any) => {
    if (chain.missions.length === 0) return "draft";
    return "active";
  };

  // Функция для получения цвета статуса цепочки
  const getChainStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "draft": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  // Функция для получения текста статуса цепочки
  const getChainStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активная";
      case "draft": return "Черновик";
      default: return "Неизвестно";
    }
  };

  // Функции для работы с цепочками миссий
  const handleCreateChainClick = () => {
    handleCreateChain();
  };

  const handleEditChainClick = (chain: MissionChain) => {
    setSelectedChain(chain);
    handleEditChain(chain);
  };

  const handleDeleteChainClick = (chain: MissionChain) => {
    setChainToDelete(chain);
    setChainDeleteOpen(true);
  };

  const handleDeleteChainConfirm = async () => {
    if (!chainToDelete) return;
    
    try {
      await handleDeleteChain(chainToDelete);
      setChainDeleteOpen(false);
      setChainToDelete(null);
    } catch (error) {
      console.error('Ошибка при удалении цепочки:', error);
    }
  };

  // Функция для получения зависимостей миссии
  const getMissionDependencies = (missionId: number, chain: MissionChain) => {
    return chain.dependencies
      .filter(dep => dep.missionId === missionId)
      .map(dep => {
        const prerequisiteMission = missions.find(m => m.id === dep.prerequisiteMissionId);
        return prerequisiteMission?.title || `Миссия #${dep.prerequisiteMissionId}`;
      });
  };


  const [missionsTab, setMissionsTab] = useState("missions");

  return (
    <TabsContent value="missions" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">Управление миссиями</h2>
            <p className="text-sm text-muted-foreground">
              Создание и управление обучающими миссиями
            </p>
          </div>
        </div>

        {/* Mission Tabs */}
        <Card className="card-enhanced">
          <CardHeader>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {[
                { key: "missions", label: "Миссии", icon: Target },
                { key: "chains", label: "Цепочки", icon: Link2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMissionsTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    missionsTab === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {missionsTab === "missions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Все миссии</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Поиск миссий..."
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary-600 text-white"
                      onClick={handleCreateMission}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Создать миссию
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Загрузка миссий...</div>
                  </div>
                ) : missions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      Миссии не найдены
                    </div>
                    <Button onClick={handleCreateMission}>
                      <Plus className="w-4 h-4 mr-2" />
                      Создать первую миссию
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {missions.map((mission) => {
                      const status = getMissionStatus(mission);
                      const statusText = getStatusText(status);
                      const statusColor = getStatusColor(status);
                      
                      return (
                        <div
                          key={mission.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{mission.title}</h4>
                              <Badge
                                variant={
                                  mission.seasonId === currentSeason?.id
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {mission.seasonId === currentSeason?.id ? "Активная" : "Завершена"}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${statusColor}`} title={statusText} />
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {mission.tasks.length} заданий
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {mission.rewardXp} XP
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                {mission.rewardMana} маны
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {mission.rewardArtifacts.length + mission.rewardCompetencies.length + mission.rewardSkills.length} наград
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {mission.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedMission(mission);
                                handleEditMission(mission);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedMission(mission);
                                handleDeleteMission(mission);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {missionsTab === "chains" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Цепи миссий</h3>
                    <p className="text-sm text-muted-foreground">
                      Последовательные пути обучения со связанными миссиями
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Поиск цепей..."
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary-600 text-white"
                      onClick={handleCreateChainClick}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Создать цепь
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Загрузка цепочек миссий...</div>
                  </div>
                ) : missionChains.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      Цепочки миссий не найдены
                    </div>
                    <Button onClick={handleCreateChainClick}>
                      <Plus className="w-4 h-4 mr-2" />
                      Создать первую цепочку
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {missionChains.map((chain) => {
                          const status = getChainStatus(chain);
                          const statusText = getChainStatusText(status);
                          const statusColor = getChainStatusColor(status);
                          const orderedMissions = chain.getMissionsInOrder();
                          
                          return (
                            <div key={chain.id} className="admin-card p-4 rounded-lg">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-info to-soft-cyan rounded-lg flex items-center justify-center">
                                    <Link2 className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-semibold text-base">
                                          {chain.name}
                                        </h4>
                                        <Badge
                                          variant={
                                            status === "active"
                                              ? "default"
                                              : "outline"
                                          }
                                          className="text-xs"
                                        >
                                          {statusText}
                                        </Badge>
                                        <div className={`w-2 h-2 rounded-full ${statusColor}`} title={statusText} />
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {chain.description}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{currentSeason?.name || "Без сезона"}</span>
                                        <span>•</span>
                                        <span>{orderedMissions.length} миссий</span>
                                        <span>•</span>
                                        <span>{chain.rewardXp} XP</span>
                                        <span>•</span>
                                        <span>{chain.rewardMana} маны</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">
                                          Награда XP:
                                        </span>
                                        <span className="ml-1 font-medium">
                                          {chain.rewardXp}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          Награда мана:
                                        </span>
                                        <span className="ml-1 font-medium">
                                          {chain.rewardMana}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          Миссий:
                                        </span>
                                        <span className="ml-1 font-medium">
                                          {orderedMissions.length}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          ID:
                                        </span>
                                        <span className="ml-1 font-medium">
                                          #{chain.id}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Chain Configuration Indicators */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {chain.dependencies.length > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-info/10 text-info border-info/20"
                                        >
                                          <Link2 className="w-3 h-3 mr-1" />
                                          Зависимости
                                        </Badge>
                                      )}
                                      {chain.missionOrders.length > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-primary/10 text-primary border-primary/20"
                                        >
                                          Упорядоченная
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditChainClick(chain)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteChainClick(chain)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                              </div>

                              {/* Mission Sequence Preview */}
                              {orderedMissions.length > 0 && (
                                <div className="border-t pt-4">
                                  <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Последовательность миссий
                                  </h5>
                                  <TooltipProvider>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                      {orderedMissions.map((mission, index) => {
                                        const dependencies = getMissionDependencies(mission.id, chain);
                                        return (
                                          <div
                                            key={mission.id}
                                            className="flex items-center gap-2 shrink-0"
                                          >
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs min-w-0 bg-background border-border cursor-help">
                                                  <span className="font-medium">{index + 1}</span>
                                                  <span className="truncate max-w-24">
                                                    {mission.title}
                                                  </span>
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs px-1 py-0"
                                                  >
                                                    {mission.category}
                                                  </Badge>
                                                  {dependencies.length > 0 && (
                                                    <Link2 className="w-3 h-3 text-muted-foreground" />
                                                  )}
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent className="bg-slate-900/95 border border-slate-600/60 text-slate-100 shadow-2xl backdrop-blur-sm">
                                                <div className="max-w-xs">
                                                  <div className="font-semibold mb-2 text-slate-50 text-sm">{mission.title}</div>
                                                  {dependencies.length > 0 ? (
                                                    <div>
                                                      <div className="text-xs text-slate-300 mb-2 font-medium flex items-center gap-1">
                                                        <Link2 className="w-3 h-3" />
                                                        Зависимости:
                                                      </div>
                                                      <ul className="text-xs space-y-1.5">
                                                        {dependencies.map((dep, depIndex) => (
                                                          <li key={depIndex} className="flex items-center gap-2 text-slate-200">
                                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                                            <span className="truncate">{dep}</span>
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  ) : (
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                                      Нет зависимостей
                                                    </div>
                                                  )}
                                                </div>
                                              </TooltipContent>
                                            </Tooltip>
                                            {index < orderedMissions.length - 1 && (
                                              <div className="text-muted-foreground">→</div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </TooltipProvider>
                                </div>
                              )}
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>


        {/* Диалог подтверждения удаления цепочки */}
        <AlertDialog open={chainDeleteOpen} onOpenChange={setChainDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить цепочку миссий</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить цепочку "{chainToDelete?.name}"? 
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteChainConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </TabsContent>
  );
}
