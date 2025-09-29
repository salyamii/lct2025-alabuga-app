import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Filter } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useEffect } from "react";

interface AdminSeasonProps {
  handleCreateSeason: () => void;
  handleEditSeason: (season: any) => void;
  handleDeleteSeason: (season: any) => void;
  setSelectedSeason: (season: any) => void;
}

export function AdminSeason({ handleCreateSeason, handleEditSeason, handleDeleteSeason, setSelectedSeason }: AdminSeasonProps) {
  const { seasons, fetchSeasons, isLoading } = useSeasonStore();

  // Загружаем сезоны при монтировании компонента
  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  // Функция для определения статуса сезона
  const getSeasonStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    
    if (now < startDate) {
      return "upcoming";
    } else if (now >= startDate && now <= endDate) {
      return "active";
    } else {
      return "completed";
    }
  };

  // Функция для получения локализованного статуса
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активный";
      case "completed":
        return "Завершен";
      case "upcoming":
        return "Предстоящий";
      default:
        return "Неизвестно";
    }
  };

  return (
    <TabsContent value="seasons" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">Управление сезонами</h2>
            <p className="text-sm text-muted-foreground">
              Управление сезонами и их настройками
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary-600 text-white"
            onClick={handleCreateSeason}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить сезон
          </Button>
        </div>

        <Card className="card-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Все сезоны</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Поиск сезонов..." className="pl-9 w-64" />
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
                <div className="text-muted-foreground">Загрузка сезонов...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {seasons.map((season) => {
                  const status = getSeasonStatus(season.startDate, season.endDate);
                  const statusLabel = getStatusLabel(status);
                  
                  return (
                    <div key={season.id} className="admin-card p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold text-base">
                                {season.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {season.startDate.toLocaleDateString('ru-RU')} - {season.endDate.toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  status === "active"
                                    ? "default"
                                    : status === "completed"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {statusLabel}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {season.getRemainingDays() > 0 ? `Осталось ${season.getRemainingDays()} дней` : 'Сезон завершен'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedSeason(season);
                              handleEditSeason(season);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedSeason(season);
                              handleDeleteSeason(season);
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
              </div>
            )}
          </CardContent>
        </Card>

    </TabsContent>
  );
}
