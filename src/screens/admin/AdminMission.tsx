import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Filter } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import { CardContent } from "../../components/ui/card";

interface AdminMissionProps {
    handleCreateMission: () => void;
}

export function AdminMission({ handleCreateMission }: AdminMissionProps) {

    const missions = [
        {
          id: "mission-1",
          title: "Web Development Basics",
          status: "active",
          participants: 500,
          completionRate: 90,
          createdDate: "2024-01-01"
        },
        {
          id: "mission-2",
          title: "Advanced JavaScript",
          status: "completed",
          participants: 300,
          completionRate: 100,
          createdDate: "2023-12-01"
        },
        {
          id: "mission-3",
          title: "Data Structures and Algorithms",
          status: "upcoming",
          participants: 0,
          completionRate: 0,
          createdDate: "2024-06-01"
        }
      ];

    return (
        <div>
            <TabsContent value="missions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Управление миссиями</h2>
                  <p className="text-sm text-muted-foreground">Создание и управление обучающими миссиями</p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-white" onClick={handleCreateMission}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать миссию
                </Button>
              </div>
  
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Все миссии</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Поиск миссий..." className="pl-9 w-64" />
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
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{mission.title}</h4>
                            <Badge 
                              variant={mission.status === "active" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {mission.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>{mission.participants} участников</span>
                            <span>{mission.completionRate}% завершено</span>
                            <span>Создано {mission.createdDate}</span>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </div>
    );
}