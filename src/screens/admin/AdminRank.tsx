// import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star, Search, Filter, Target, Users, X, HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useRankStore } from "../../stores/useRankStore";
import { useMissionStore } from "../../stores/useMissionStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useEffect, useState } from "react";
import { Rank } from "../../domain/rank";
import { Mission } from "../../domain/mission";
import { Competency } from "../../domain/competency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { mediaService } from "../../api/services/mediaService";

interface AdminRankProps {
  handleFetchRanks: () => Promise<void>;
  handleFetchMissions: () => Promise<void>;
  handleFetchCompetencies: () => Promise<void>;
  handleCreateRank: () => void;
  handleEditRank: (rank: Rank) => void;
  handleDeleteRank: (rank: Rank) => void;
  setSelectedRank: (rank: Rank) => void;
}

export function AdminRank({ 
  handleFetchRanks,
  handleFetchMissions,
  handleFetchCompetencies,
  handleCreateRank, 
  handleEditRank, 
  handleDeleteRank, 
  setSelectedRank 
}: AdminRankProps) {
  const { 
    ranks, 
    isLoading, 
    addRequiredMissionToRank,
    removeRequiredMissionFromRank,
    addRequiredCompetencyToRank,
    removeRequiredCompetencyFromRank
  } = useRankStore();
  const { missions } = useMissionStore();
  const { competencies } = useCompetencyStore();
  const [expandedRank, setExpandedRank] = useState<number | null>(null);
  const [selectedMission, setSelectedMission] = useState<string>("");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("");
  const [competencyLevel, setCompetencyLevel] = useState<number>(1);
  const [rankImages, setRankImages] = useState<Record<number, string>>({});

  useEffect(() => {
    handleFetchRanks();
    handleFetchMissions();
    handleFetchCompetencies();
  }, []);

  // Загружаем изображения рангов
  useEffect(() => {
    const loadRankImages = async () => {
      if (ranks.length === 0) return;
      
      const imagePromises = ranks.map(async (rank) => {
        if (rank.imageUrl) {
          try {
            const imageUrl = await mediaService.loadImageWithAuth(rank.imageUrl);
            return { id: rank.id, url: imageUrl };
          } catch (error) {
            console.error(`Ошибка загрузки изображения для ранга ${rank.id}:`, error);
            return { id: rank.id, url: '' };
          }
        }
        return { id: rank.id, url: '' };
      });

      const loadedImages = await Promise.all(imagePromises);
      const imagesMap: Record<number, string> = {};
      loadedImages.forEach(({ id, url }) => {
        if (url) imagesMap[id] = url;
      });
      setRankImages(imagesMap);
    };

    if (ranks.length > 0) {
      loadRankImages();
    }
  }, [ranks]);

  // Обработчик добавления миссии к рангу
  const handleAddMissionToRank = async (rankId: number, missionId: number) => {
    try {
      await addRequiredMissionToRank(rankId, missionId);
      toast.success("Миссия успешно добавлена к рангу! 🎯", {
        description: "Обязательная миссия была добавлена к требованиям ранга"
      });
      setSelectedMission("");
    } catch (error) {
      console.error("Ошибка при добавлении миссии к рангу:", error);
      toast.error("Ошибка при добавлении миссии к рангу. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления миссии из ранга
  const handleRemoveMissionFromRank = async (rankId: number, missionId: number) => {
    try {
      await removeRequiredMissionFromRank(rankId, missionId);
      toast.success("Миссия успешно удалена из ранга! 🗑️", {
        description: "Обязательная миссия была удалена из требований ранга"
      });
    } catch (error) {
      console.error("Ошибка при удалении миссии из ранга:", error);
      toast.error("Ошибка при удалении миссии из ранга. Попробуйте еще раз.");
    }
  };

  // Обработчик добавления компетенции к рангу
  const handleAddCompetencyToRank = async (rankId: number, competencyId: number, minLevel: number) => {
    try {
      await addRequiredCompetencyToRank(rankId, competencyId, minLevel);
      toast.success("Компетенция успешно добавлена к рангу! 👥", {
        description: `Обязательная компетенция была добавлена к требованиям ранга (уровень ${minLevel})`
      });
      setSelectedCompetency("");
      setCompetencyLevel(1);
    } catch (error) {
      console.error("Ошибка при добавлении компетенции к рангу:", error);
      toast.error("Ошибка при добавлении компетенции к рангу. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления компетенции из ранга
  const handleRemoveCompetencyFromRank = async (rankId: number, competencyId: number) => {
    try {
      await removeRequiredCompetencyFromRank(rankId, competencyId);
      toast.success("Компетенция успешно удалена из ранга! 🗑️", {
        description: "Обязательная компетенция была удалена из требований ранга"
      });
    } catch (error) {
      console.error("Ошибка при удалении компетенции из ранга:", error);
      toast.error("Ошибка при удалении компетенции из ранга. Попробуйте еще раз.");
    }
  };


  return (
    <div className="space-y-6">

      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все ранги</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск рангов..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Фильтр
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Загрузка рангов...</div>
            </div>
          ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {ranks.map((rank) => {
                    const isExpanded = expandedRank === rank.id;
                    return (
                  <div key={rank.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center overflow-hidden">
                          {rankImages[rank.id] ? (
                            <img 
                              src={rankImages[rank.id]} 
                              alt={rank.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <HelpCircle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <h4 className="font-semibold text-base">
                              {rank.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Требуемый опыт: {rank.requiredXp} XP
                            </p>
                            
                            {/* Требования */}
                            <div className="mt-3 space-y-2">
                              {rank.requiredMissions.length > 0 && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    Требуемые миссии ({rank.requiredMissions.length}):
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {rank.requiredMissions.map((mission, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {mission.title}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {rank.requiredCompetencies.length > 0 && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Требуемые компетенции ({rank.requiredCompetencies.length}):
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {rank.requiredCompetencies.map((req, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {req.competency.name} (ур. {req.minLevel})
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedRank(isExpanded ? null : rank.id)}
                        >
                          {isExpanded ? "Свернуть" : "Управление"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedRank(rank);
                            handleEditRank(rank);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedRank(rank);
                            handleDeleteRank(rank);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Расширенная панель управления */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="space-y-4">
                          {/* Добавление миссии */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Добавить обязательную миссию
                            </h5>
                            <div className="flex gap-2">
                              <Select value={selectedMission} onValueChange={setSelectedMission}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Выберите миссию" />
                                </SelectTrigger>
                                <SelectContent>
                                  {missions
                                    .filter(mission => !rank.requiredMissions.some(req => req.id === mission.id))
                                    .map(mission => (
                                    <SelectItem key={mission.id} value={mission.id.toString()}>
                                      {mission.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  if (selectedMission) {
                                    handleAddMissionToRank(rank.id, Number(selectedMission));
                                  }
                                }}
                                disabled={!selectedMission}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Добавление компетенции */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Добавить обязательную компетенцию
                            </h5>
                            <div className="flex gap-2">
                              <Select value={selectedCompetency} onValueChange={setSelectedCompetency}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Выберите компетенцию" />
                                </SelectTrigger>
                                <SelectContent>
                                  {competencies
                                    .filter(comp => !rank.requiredCompetencies.some(req => req.competency.id === comp.id))
                                    .map(competency => (
                                    <SelectItem key={competency.id} value={competency.id.toString()}>
                                      {competency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={competencyLevel}
                                onChange={(e) => setCompetencyLevel(Number(e.target.value))}
                                className="w-20"
                                placeholder="Ур."
                              />
                              <Button 
                                size="sm"
                                onClick={() => {
                                  if (selectedCompetency) {
                                    handleAddCompetencyToRank(rank.id, Number(selectedCompetency), competencyLevel);
                                  }
                                }}
                                disabled={!selectedCompetency}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Управление существующими требованиями */}
                          {(rank.requiredMissions.length > 0 || rank.requiredCompetencies.length > 0) && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Управление требованиями</h5>
                              <div className="space-y-2">
                                {rank.requiredMissions.map((mission, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{mission.title}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        handleRemoveMissionFromRank(rank.id, mission.id);
                                      }}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                
                                {rank.requiredCompetencies.map((req, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{req.competency.name} (ур. {req.minLevel})</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        handleRemoveCompetencyFromRank(rank.id, req.competency.id);
                                      }}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {ranks.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    Ранги не найдены
                  </div>
                  <Button onClick={handleCreateRank}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первый ранг
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
