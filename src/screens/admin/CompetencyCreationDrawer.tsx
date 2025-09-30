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
import { Star, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CompetencyCreationDrawer() {
  const { competencyCreationOpen, closeCompetencyCreation } = useOverlayStore();
  const { createCompetency, addSkillToCompetency } = useCompetencyStore();
  const { skills, fetchSkills } = useSkillStore();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    maxLevel: 10
  });
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

  // Загружаем навыки при открытии
  useEffect(() => {
    if (competencyCreationOpen && skills.length === 0) {
      fetchSkills();
    }
  }, [competencyCreationOpen, skills.length, fetchSkills]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Название компетенции обязательно!");
      return;
    }

    if (formData.maxLevel < 1 || formData.maxLevel > 100) {
      toast.error("Максимальный уровень должен быть от 1 до 100!");
      return;
    }

    if (selectedSkillIds.length === 0) {
      toast.error("Выберите хотя бы один навык для компетенции!");
      return;
    }

    try {
      setIsCreating(true);
      
      // Создаем компетенцию
      const newCompetency = await createCompetency({
        name: formData.name.trim(),
        maxLevel: formData.maxLevel
      });

      // Добавляем навыки к компетенции
      for (const skillId of selectedSkillIds) {
        await addSkillToCompetency(newCompetency.id, skillId);
      }

      toast.success("Компетенция успешно создана! ⭐", {
        description: `"${formData.name}" с ${selectedSkillIds.length} ${selectedSkillIds.length === 1 ? 'навыком' : 'навыками'}`
      });

      // Сброс формы
      setFormData({ name: "", maxLevel: 10 });
      setSelectedSkillIds([]);
      closeCompetencyCreation();
    } catch (error) {
      console.error("Ошибка при создании компетенции:", error);
      toast.error("Ошибка при создании компетенции. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", maxLevel: 10 });
    setSelectedSkillIds([]);
    closeCompetencyCreation();
  };

  return (
    <Drawer open={competencyCreationOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Создание новой компетенции
          </DrawerTitle>
          <DrawerDescription>
            Заполните информацию о компетенции для добавления в систему
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

          {/* Навыки */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Навыки компетенции *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Выберите хотя бы один навык, который входит в эту компетенцию
              </p>
              
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">Загрузка навыков...</p>
              ) : (
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {isSelected && (
                                <Star className="w-3 h-3 text-white" fill="currentColor" />
                              )}
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
                    );
                  })}
                </div>
              )}

              {selectedSkillIds.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">
                    Выбрано навыков: {selectedSkillIds.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkillIds.map(skillId => {
                      const skill = skills.find(s => s.id === skillId);
                      return skill ? (
                        <Badge key={skillId} variant="secondary">
                          {skill.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Кнопки действий - зафиксированы внизу */}
        <div className="flex-shrink-0 px-6 pb-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating || !formData.name.trim() || selectedSkillIds.length === 0}
              className="bg-primary hover:bg-primary-600"
            >
              {isCreating ? "Создание..." : "Создать компетенцию"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}