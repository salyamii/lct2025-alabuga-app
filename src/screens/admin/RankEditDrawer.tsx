import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useRankStore } from "../../stores/useRankStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { Rank } from "../../domain/rank";

interface RankEditDrawerProps {
  rank: Rank | null;
}

export function RankEditDrawer({ rank }: RankEditDrawerProps) {
  const { rankEditOpen, closeRankEdit } = useOverlayStore();
  const { updateRank } = useRankStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    requiredXp: 0
  });

  useEffect(() => {
    if (rank) {
      setFormData({
        name: rank.name,
        requiredXp: rank.requiredXp
      });
    }
  }, [rank]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!rank) return;

    if (!formData.name.trim()) {
      toast.error("Название ранга обязательно!");
      return;
    }

    if (formData.requiredXp < 0) {
      toast.error("Требуемый опыт не может быть отрицательным!");
      return;
    }


    try {
      setIsUpdating(true);
      await updateRank(rank.id, {
        name: formData.name.trim(),
        requiredXp: formData.requiredXp
      });

      toast.success("Ранг успешно обновлен! ⭐", {
        description: `"${formData.name}" был обновлен`
      });

      closeRankEdit();
    } catch (error) {
      console.error("Ошибка при обновлении ранга:", error);
      toast.error("Ошибка при обновлении ранга. Попробуйте еще раз.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    closeRankEdit();
  };

  return (
    <Drawer open={rankEditOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Редактирование ранга
          </DrawerTitle>
          <DrawerDescription>
            Измените информацию о ранге
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
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating || !formData.name.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              {isUpdating ? "Обновление..." : "Обновить ранг"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}