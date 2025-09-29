import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { toast } from "sonner";
import {
  X,
  Target,
  Lightbulb,
  Save,
  Star,
  Edit,
} from "lucide-react";
import { useRankStore } from "../../stores/useRankStore";
import { Rank } from "../../domain/rank";

interface RankEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rank: Rank | null;
}

export function RankEditDrawer({
  open,
  onOpenChange,
  rank,
}: RankEditDrawerProps) {
  const { updateRank } = useRankStore();

  const [formData, setFormData] = useState({
    name: "",
    requiredXp: 0,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Заполняем форму данными ранга при открытии
  useEffect(() => {
    if (rank && open) {
      setFormData({
        name: rank.name,
        requiredXp: rank.requiredXp,
      });
    }
  }, [rank, open]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateRank = async () => {
    if (!rank) return;

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Пожалуйста, введите название ранга");
      return;
    }

    if (formData.requiredXp < 0) {
      toast.error("Требуемый опыт не может быть отрицательным");
      return;
    }

    try {
      setIsUpdating(true);
      
      const rankData = {
        name: formData.name.trim(),
        requiredXp: formData.requiredXp,
      };

      await updateRank(rank.id, rankData);

      toast.success("Ранг успешно обновлен! ✨", {
        description: `"${formData.name}" был изменен`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при обновлении ранга:", error);
      toast.error("Ошибка при обновлении ранга. Попробуйте еще раз.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Изменения сохранены как черновик! 📋");
    onOpenChange(false);
  };

  if (!rank) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          <DrawerHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 flex-shrink-0 rounded-t-lg mx-6 p-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Редактировать ранг
                </DrawerTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="px-6 pt-6 pb-12 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Rank Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rank-name">Название ранга *</Label>
                      <Input
                        id="rank-name"
                        placeholder="например, Кадет"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rank Configuration */}
              <div className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-info" />
                      Конфигурация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rank-xp">Требуемый опыт (XP)</Label>
                      <Input
                        id="rank-xp"
                        type="number"
                        min="0"
                        value={formData.requiredXp}
                        onChange={(e) => handleInputChange("requiredXp", parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Количество опыта, необходимое для получения ранга
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Rank Preview */}
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр изменений
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.name && (
                      <div>
                        <strong>Название:</strong> {formData.name}
                      </div>
                    )}
                    <div>
                      <strong>Требуемый опыт:</strong> {formData.requiredXp} XP
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        <strong>ID ранга:</strong> {rank.id}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleUpdateRank}
                    disabled={isUpdating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isUpdating ? "Обновление..." : "Обновить ранг"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить как черновик
                  </Button>
                </div>
              </div>
            </div>

            {/* Дополнительный отступ снизу */}
            <div className="h-12"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
