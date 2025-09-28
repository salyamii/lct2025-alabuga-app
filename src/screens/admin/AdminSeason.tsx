import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Filter } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Eye, Edit, MoreHorizontal } from "lucide-react";

interface AdminSeasonProps {
  handleCreateSeason: () => void;
}

export function AdminSeason({ handleCreateSeason }: AdminSeasonProps) {
  // Mock data for seasons
  const seasons = [
    {
      id: "season-delta",
      name: "Delta Constellation",
      phase: "Deep Space Operations",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      participants: 2847,
      totalMissions: 12,
      totalEpisodes: 3,
      totalBranches: 5,
      completionRate: 67,
    },
    {
      id: "season-gamma",
      name: "Gamma Nebula",
      phase: "Exploration Phase",
      status: "completed",
      startDate: "2023-10-01",
      endDate: "2024-01-01",
      participants: 3241,
      totalMissions: 15,
      totalEpisodes: 4,
      totalBranches: 7,
      completionRate: 94,
    },
    {
      id: "season-epsilon",
      name: "Epsilon Galaxy",
      phase: "Advanced Operations",
      status: "upcoming",
      startDate: "2024-05-01",
      endDate: "2024-08-01",
      participants: 0,
      totalMissions: 18,
      totalEpisodes: 5,
      totalBranches: 8,
      completionRate: 0,
    },
  ];

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
            <div className="space-y-4">
              {seasons.map((season) => (
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
                            {season.phase}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Участники:
                            </span>
                            <span className="ml-1 font-medium">
                              {season.participants.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Эпизоды:
                            </span>
                            <span className="ml-1 font-medium">
                              {season.totalEpisodes}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Ветви:
                            </span>
                            <span className="ml-1 font-medium">
                              {season.totalBranches}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Завершение:
                            </span>
                            <span className="ml-1 font-medium">
                              {season.completionRate}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              season.status === "active"
                                ? "default"
                                : season.status === "completed"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {season.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {season.startDate} - {season.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </TabsContent>
  );
}
