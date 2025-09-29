import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
  Zap,
} from "lucide-react";
import { useSkillStore } from "../../stores/useSkillStore";
import { Skill } from "../../domain/skill";

interface SkillCreationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillCreationDrawer({
  open,
  onOpenChange,
}: SkillCreationDrawerProps) {
  const { createSkill } = useSkillStore();

  const [formData, setFormData] = useState({
    name: "",
    maxLevel: 10,
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSkill = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Пожалуйста, введите название навыка");
      return;
    }

    if (formData.maxLevel < 1 || formData.maxLevel > 100) {
      toast.error("Максимальный уровень должен быть от 1 до 100");
      return;
    }

    try {
      setIsCreating(true);
      
      const skillData = {
        name: formData.name.trim(),
        maxLevel: formData.maxLevel,
      };

      await createSkill(skillData);

      toast.success("Навык успешно создан! ✨", {
        description: `"${formData.name}" готов к использованию`,
      });

      // Reset form
      setFormData({
        name: "",
        maxLevel: 10,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при создании навыка:", error);
      toast.error("Ошибка при создании навыка. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Изменения сохранены как черновик! 📋");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          <DrawerHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 flex-shrink-0 rounded-t-lg mx-6 p-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Создать навык
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
              {/* Main Skill Details */}
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
                      <Label htmlFor="skill-name">Название навыка *</Label>
                      <Input
                        id="skill-name"
                        placeholder="например, Программирование"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skill Configuration */}
              <div className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-info" />
                      Конфигурация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skill-max-level">Максимальный уровень</Label>
                      <Input
                        id="skill-max-level"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.maxLevel}
                        onChange={(e) => handleInputChange("maxLevel", parseInt(e.target.value) || 10)}
                        placeholder="10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Максимальный уровень навыка (1-100)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Skill Preview */}
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.name && (
                      <div>
                        <strong>Название:</strong> {formData.name}
                      </div>
                    )}
                    <div>
                      <strong>Максимальный уровень:</strong> {formData.maxLevel}
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        <strong>Статус:</strong> Новый навык
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCreateSkill}
                    disabled={isCreating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {isCreating ? "Создание..." : "Создать навык"}
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
