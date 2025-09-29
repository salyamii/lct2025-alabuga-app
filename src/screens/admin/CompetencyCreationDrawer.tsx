import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

export function CompetencyCreationDrawer() {
  const { competencyCreationOpen, closeCompetencyCreation } = useOverlayStore();
  const { createCompetency } = useCompetencyStore();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    maxLevel: 10
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    try {
      setIsCreating(true);
      await createCompetency({
        name: formData.name.trim(),
        maxLevel: formData.maxLevel
      });

      toast.success("Компетенция успешно создана! ⭐", {
        description: `"${formData.name}" готова к использованию`
      });

      // Сброс формы
      setFormData({ name: "", maxLevel: 10 });
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
              disabled={isCreating || !formData.name.trim()}
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