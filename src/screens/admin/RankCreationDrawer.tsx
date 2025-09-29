import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useRankStore } from "../../stores/useRankStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

export function RankCreationDrawer() {
  const { rankCreationOpen, closeRankCreation } = useOverlayStore();
  const { createRank } = useRankStore();

  const [formData, setFormData] = useState({
    name: "",
    requiredXp: 0,
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Название ранга обязательно!");
      return;
    }

    if (formData.requiredXp < 0) {
      toast.error("Требуемый опыт не может быть отрицательным!");
      return;
    }

    try {
      setIsCreating(true);
      await createRank({
        name: formData.name.trim(),
        requiredXp: formData.requiredXp
      });

      toast.success("Ранг успешно создан! ⭐", {
        description: `"${formData.name}" готов к использованию`
      });

      // Сброс формы
      setFormData({ name: "", requiredXp: 0 });
      closeRankCreation();
    } catch (error) {
      console.error("Ошибка при создании ранга:", error);
      toast.error("Ошибка при создании ранга. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", requiredXp: 0 });
    closeRankCreation();
  };

  return (
    <Drawer open={rankCreationOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Создание нового ранга
          </DrawerTitle>
          <DrawerDescription>
            Заполните информацию о ранге для добавления в систему
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
                <Label htmlFor="name">Название ранга *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Введите название ранга"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredXp">Требуемый опыт</Label>
                <Input
                  id="requiredXp"
                  type="number"
                  min="0"
                  value={formData.requiredXp}
                  onChange={(e) => handleInputChange("requiredXp", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full"
                />
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
              {isCreating ? "Создание..." : "Создать ранг"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
