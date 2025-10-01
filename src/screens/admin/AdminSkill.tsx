// import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Search, Filter, Zap } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useSkillStore } from "../../stores/useSkillStore";
import { useEffect } from "react";
import { Skill } from "../../domain/skill";

interface AdminSkillProps {
  handleFetchSkills: () => Promise<void>;
  handleCreateSkill: () => void;
  handleEditSkill: (skill: Skill) => void;
  handleDeleteSkill: (skill: Skill) => void;
  setSelectedSkill: (skill: Skill) => void;
}

export function AdminSkill({ 
  handleFetchSkills,
  handleCreateSkill, 
  handleEditSkill, 
  handleDeleteSkill, 
  setSelectedSkill 
}: AdminSkillProps) {
  const { skills, isLoading } = useSkillStore();

  useEffect(() => {
    handleFetchSkills();
  }, []);

  return (
    <div className="space-y-6">

      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все навыки</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск навыков..." className="pl-9 w-64" />
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
              <div className="text-muted-foreground">Загрузка навыков...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {skills.map((skill) => {
                return (
                  <div key={skill.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold text-base">
                              {skill.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Максимальный уровень: {skill.maxLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedSkill(skill);
                            handleEditSkill(skill);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedSkill(skill);
                            handleDeleteSkill(skill);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {skills.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    Навыки не найдены
                  </div>
                  <Button onClick={handleCreateSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первый навык
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
