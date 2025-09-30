import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { Badge } from "../../components/ui/badge";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useSkillStore } from "../../stores/useSkillStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Star, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Competency } from "../../domain/competency";

interface CompetencyEditDrawerProps {
  competency: Competency | null;
}

export function CompetencyEditDrawer({ competency }: CompetencyEditDrawerProps) {
  const { competencyEditOpen, closeCompetencyEdit } = useOverlayStore();
  const { updateCompetency, addSkillToCompetency, removeSkillFromCompetency } = useCompetencyStore();
  const { skills, fetchSkills } = useSkillStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    maxLevel: 10
  });
  const [currentSkillIds, setCurrentSkillIds] = useState<number[]>([]);

  // Загружаем навыки при открытии
  useEffect(() => {
    if (competencyEditOpen && skills.length === 0) {
      fetchSkills();
    }
  }, [competencyEditOpen, skills.length, fetchSkills]);

  useEffect(() => {
    if (competency) {
      setFormData({
        name: competency.name,
        maxLevel: competency.maxLevel
      });
      setCurrentSkillIds(competency.skills.map(s => s.id));
    }
  }, [competency]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSkill = (skillId: number) => {
    setCurrentSkillIds(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (!competency) return;
    
    if (currentSkillIds.length <= 1) {
      toast.error("Компетенция должна содержать хотя бы один навык!");
      return;
    }

    try {
      await removeSkillFromCompetency(competency.id, skillId);
      setCurrentSkillIds(prev => prev.filter(id => id !== skillId));
      toast.success("Навык удален из компетенции");
    } catch (error) {
      console.error("Ошибка при удалении навыка:", error);
      toast.error("Ошибка при удалении навыка");
    }
  };

  const handleAddSkill = async (skillId: number) => {
    if (!competency) return;

    try {
      await addSkillToCompetency(competency.id, skillId);
      setCurrentSkillIds(prev => [...prev, skillId]);
      toast.success("Навык добавлен к компетенции");
    } catch (error) {
      console.error("Ошибка при добавлении навыка:", error);
      toast.error("Ошибка при добавлении навыка");
    }
  };

  const handleUpdate = async () => {
    if (!competency) return;

    if (!formData.name.trim()) {
      toast.error("Название компетенции обязательно!");
      return;
    }

    if (formData.maxLevel < 1 || formData.maxLevel > 100) {
      toast.error("Максимальный уровень должен быть от 1 до 100!");
      return;
    }

    if (currentSkillIds.length === 0) {
      toast.error("Компетенция должна содержать хотя бы один навык!");
      return;
    }

    try {
      setIsUpdating(true);
      await updateCompetency(competency.id, {
        name: formData.name.trim(),
        maxLevel: formData.maxLevel
      });

      toast.success("Компетенция успешно обновлена! ⭐", {
        description: `"${formData.name}" была обновлена`
      });

      closeCompetencyEdit();
    } catch (error) {
      console.error("Ошибка при обновлении компетенции:", error);
      toast.error("Ошибка при обновлении компетенции. Попробуйте еще раз.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    closeCompetencyEdit();
  };

  return (
    <Drawer open={competencyEditOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Редактирование компетенции
          </DrawerTitle>
          <DrawerDescription>
            Измените информацию о компетенции
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название компетенции *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Введите название компетенции"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLevel">Максимальный уровень *</Label>
                <Input
                  id="maxLevel"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxLevel}
                  onChange={(e) => handleInputChange("maxLevel", parseInt(e.target.value) || 10)}
                  placeholder="10"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Максимальный уровень компетенции (1-100)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Текущие навыки */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Текущие навыки *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSkillIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">Нет навыков в компетенции</p>
              ) : (
                <div className="space-y-2">
                  {currentSkillIds.map(skillId => {
                    const skill = skills.find(s => s.id === skillId);
                    if (!skill) return null;
                    
                    return (
                      <div
                        key={skillId}
                        className="p-3 border rounded-lg bg-primary/5 border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-primary" fill="currentColor" />
                            <div>
                              <p className="font-medium text-sm">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Макс. уровень: {skill.maxLevel}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSkill(skillId)}
                            disabled={currentSkillIds.length <= 1}
                            className="text-danger hover:text-danger hover:bg-danger/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {currentSkillIds.length === 1 && (
                <p className="text-xs text-warning">
                  Компетенция должна содержать хотя бы один навык
                </p>
              )}
            </CardContent>
          </Card>

          {/* Доступные навыки для добавления */}
          {skills.filter(s => !currentSkillIds.includes(s.id)).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Добавить навыки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Доступные навыки для добавления в компетенцию
                </p>
                
                <div className="space-y-2">
                  {skills
                    .filter(s => !currentSkillIds.includes(s.id))
                    .map(skill => (
                      <div
                        key={skill.id}
                        className="p-3 border rounded-lg hover:border-primary/50 cursor-pointer transition-all"
                        onClick={() => handleAddSkill(skill.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center">
                              <Star className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{skill.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Макс. уровень: {skill.maxLevel}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Кнопки действий - зафиксированы внизу */}
        <div className="flex-shrink-0 px-6 pb-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating || !formData.name.trim() || currentSkillIds.length === 0}
              className="bg-primary hover:bg-primary-600"
            >
              {isUpdating ? "Обновление..." : "Обновить компетенцию"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}