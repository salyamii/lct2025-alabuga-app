import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star, Search, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useEffect } from "react";
import { Competency } from "../../domain/competency";

interface AdminCompetencyProps {
  handleCreateCompetency: () => void;
  handleEditCompetency: (competency: Competency) => void;
  handleDeleteCompetency: (competency: Competency) => void;
  setSelectedCompetency: (competency: Competency) => void;
}

export function AdminCompetency({ 
  handleCreateCompetency, 
  handleEditCompetency, 
  handleDeleteCompetency, 
  setSelectedCompetency 
}: AdminCompetencyProps) {
  const { competencies, fetchCompetencies, isLoading } = useCompetencyStore();

  useEffect(() => {
    fetchCompetencies();
  }, [fetchCompetencies]);


  return (
    <TabsContent value="competencies" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Управление компетенциями</h2>
          <p className="text-sm text-muted-foreground">
            Создание, редактирование и управление компетенциями системы
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-600 text-white"
          onClick={handleCreateCompetency}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить компетенцию
        </Button>
      </div>

      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все компетенции</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск компетенций..." className="pl-9 w-64" />
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
              <div className="text-muted-foreground">Загрузка компетенций...</div>
            </div>
          ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {competencies.map((competency) => {
                    return (
                  <div key={competency.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold text-base">
                              {competency.name}
                            </h4>
                            {competency.skills && competency.skills.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">Связанные навыки:</p>
                                <div className="flex flex-wrap gap-1">
                                  {competency.skills.map((skill) => (
                                    <Badge key={skill.id} variant="outline" className="text-xs">
                                      {skill.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Максимальный уровень: {competency.maxLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCompetency(competency);
                            handleEditCompetency(competency);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedCompetency(competency);
                            handleDeleteCompetency(competency);
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
              
              {competencies.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    Компетенции не найдены
                  </div>
                  <Button onClick={handleCreateCompetency}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первую компетенцию
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
