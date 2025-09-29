import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star, Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useRankStore } from "../../stores/useRankStore";
import { useEffect } from "react";
import { Rank } from "../../domain/rank";

interface AdminRankProps {
  handleCreateRank: () => void;
  handleEditRank: (rank: Rank) => void;
  handleDeleteRank: (rank: Rank) => void;
  setSelectedRank: (rank: Rank) => void;
}

export function AdminRank({ 
  handleCreateRank, 
  handleEditRank, 
  handleDeleteRank, 
  setSelectedRank 
}: AdminRankProps) {
  const { ranks, fetchRanks, isLoading } = useRankStore();

  useEffect(() => {
    fetchRanks();
  }, [fetchRanks]);


  return (
    <TabsContent value="ranks" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Управление рангами</h2>
          <p className="text-sm text-muted-foreground">
            Создание, редактирование и управление рангами системы
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600 text-white"
          onClick={handleCreateRank}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить ранг
        </Button>
      </div>

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
                    return (
                  <div key={rank.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold text-base">
                              {rank.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Требуемый опыт: {rank.requiredXp} XP
                            </p>
                            {rank.requiredMissions.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">Требуемые миссии:</p>
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
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">Требуемые компетенции:</p>
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
                      <div className="flex items-center gap-2">
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
    </TabsContent>
  );
}
