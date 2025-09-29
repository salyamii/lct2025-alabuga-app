// import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Star, Search, Filter, Target, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useSkillStore } from "../../stores/useSkillStore";
import { useEffect, useState } from "react";
import { Competency } from "../../domain/competency";
import { Skill } from "../../domain/skill";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";

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
  const { 
    competencies, 
    fetchCompetencies, 
    isLoading,
    addSkillToCompetency,
    removeSkillFromCompetency
  } = useCompetencyStore();
  const { skills, fetchSkills } = useSkillStore();
  const [expandedCompetency, setExpandedCompetency] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  useEffect(() => {
    fetchCompetencies();
    fetchSkills();
  }, [fetchCompetencies, fetchSkills]);

  // Обработчик добавления навыка к компетенции
  const handleAddSkillToCompetency = async (competencyId: number, skillId: number) => {
    try {
      await addSkillToCompetency(competencyId, skillId);
      toast.success("Навык успешно добавлен к компетенции! 🎯", {
        description: "Навык был добавлен к компетенции"
      });
      setSelectedSkill("");
    } catch (error) {
      console.error("Ошибка при добавлении навыка к компетенции:", error);
      toast.error("Ошибка при добавлении навыка к компетенции. Попробуйте еще раз.");
    }
  };

  // Обработчик удаления навыка из компетенции
  const handleRemoveSkillFromCompetency = async (competencyId: number, skillId: number) => {
    try {
      await removeSkillFromCompetency(competencyId, skillId);
      toast.success("Навык успешно удален из компетенции! 🗑️", {
        description: "Навык был удален из компетенции"
      });
    } catch (error) {
      console.error("Ошибка при удалении навыка из компетенции:", error);
      toast.error("Ошибка при удалении навыка из компетенции. Попробуйте еще раз.");
    }
  };


  return (
    <div className="space-y-6">

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
                    const isExpanded = expandedCompetency === competency.id;
                    return (
                  <div key={competency.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <h4 className="font-semibold text-base">
                              {competency.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Максимальный уровень: {competency.maxLevel}
                            </p>
                            
                            {/* Связанные навыки */}
                            {competency.skills && competency.skills.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Связанные навыки ({competency.skills.length}):
                                </p>
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedCompetency(isExpanded ? null : competency.id)}
                        >
                          {isExpanded ? "Свернуть" : "Управление"}
                        </Button>
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
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Расширенная панель управления навыками */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="space-y-4">
                          {/* Добавление навыка */}
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Добавить навык к компетенции
                            </h5>
                            <div className="flex gap-2">
                              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Выберите навык" />
                                </SelectTrigger>
                                <SelectContent>
                                  {skills
                                    .filter(skill => !competency.skills.some(s => s.id === skill.id))
                                    .map(skill => (
                                    <SelectItem key={skill.id} value={skill.id.toString()}>
                                      {skill.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  if (selectedSkill) {
                                    handleAddSkillToCompetency(competency.id, Number(selectedSkill));
                                  }
                                }}
                                disabled={!selectedSkill}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Управление существующими навыками */}
                          {competency.skills && competency.skills.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Управление навыками</h5>
                              <div className="space-y-2">
                                {competency.skills.map((skill) => (
                                  <div key={skill.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{skill.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        Макс. ур. {skill.maxLevel}
                                      </Badge>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        handleRemoveSkillFromCompetency(competency.id, skill.id);
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
    </div>
  );
}
