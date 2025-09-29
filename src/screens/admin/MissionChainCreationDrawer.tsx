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
import { Badge } from "../../components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { toast } from "sonner";
import {
  Plus,
  X,
  Link2,
  Target,
  Zap,
  Save,
  Star,
} from "lucide-react";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useMissionStore } from "../../stores/useMissionStore";
import { Mission } from "../../domain/mission";
import { MissionChainBuilder } from "./MissionChainBuilder";

interface MissionChainCreationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MissionChainCreationDrawer({
  open,
  onOpenChange,
}: MissionChainCreationDrawerProps) {
  const { createMissionChain, addMissionToChain, addMissionDependency } = useMissionChainStore();
  const { missions, fetchMissions } = useMissionStore();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rewardXp: 0,
    rewardMana: 0,
  });

  const [selectedMissions, setSelectedMissions] = useState<Mission[]>([]);
  const [dependencies, setDependencies] = useState<{ [missionId: string]: string[] }>({});
  const [isCreating, setIsCreating] = useState(false);

  // Загружаем миссии при открытии drawer
  useEffect(() => {
    if (open && missions.length === 0) {
      fetchMissions();
    }
  }, [open, missions.length, fetchMissions]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMissionsChange = (missions: Mission[]) => {
    setSelectedMissions(missions);
  };

  const handleDependenciesChange = (deps: { [missionId: string]: string[] }) => {
    setDependencies(deps);
  };

  const handleCreateChain = async () => {
    // Basic validation
    if (!formData.name || !formData.description) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (selectedMissions.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы одну миссию");
      return;
    }

    try {
      setIsCreating(true);
      
      // Создаем цепочку миссий
      const chainData = {
        name: formData.name,
        description: formData.description,
        rewardXp: formData.rewardXp,
        rewardMana: formData.rewardMana,
      };

      const createdChain = await createMissionChain(chainData);

      // Добавляем миссии в цепочку
      for (let i = 0; i < selectedMissions.length; i++) {
        await addMissionToChain(createdChain.id, selectedMissions[i].id);
      }

      // Добавляем зависимости между миссиями
      for (const [missionId, prerequisiteIds] of Object.entries(dependencies)) {
        for (const prerequisiteId of prerequisiteIds) {
          await addMissionDependency(createdChain.id, {
            missionId: parseInt(missionId),
            prerequisiteMissionId: parseInt(prerequisiteId),
          });
        }
      }

      // Показываем успешное сообщение
      toast.success("Цепочка миссий успешно создана! 🚀", {
        description: `"${formData.name}" готова к развертыванию`,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        rewardXp: 0,
        rewardMana: 0,
      });
      setSelectedMissions([]);
      setDependencies({});

      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при создании цепочки:", error);
      toast.error("Ошибка при создании цепочки. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Цепочка сохранена как черновик! 📋");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-6xl flex flex-col h-full">
          <DrawerHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 flex-shrink-0 rounded-t-lg mx-6 p-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Создать новую цепочку миссий
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
              {/* Main Chain Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-primary" />
                      Обзор цепочки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chain-name">Название цепочки *</Label>
                      <Input
                        id="chain-name"
                        placeholder="например, React Mastery Journey"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chain-description">
                        Описание цепочки *
                      </Label>
                      <Textarea
                        id="chain-description"
                        placeholder="Подробное описание цепочки и целей..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Mission Chain Builder */}
                <MissionChainBuilder
                  missions={missions}
                  selectedMissions={selectedMissions}
                  onMissionsChange={handleMissionsChange}
                  onDependenciesChange={handleDependenciesChange}
                />
              </div>

              {/* Chain Configuration */}
              <div className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-info" />
                      Конфигурация цепочки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chain-xp">Награда XP</Label>
                      <Input
                        id="chain-xp"
                        type="number"
                        placeholder="1500"
                        value={formData.rewardXp}
                        onChange={(e) =>
                          handleInputChange("rewardXp", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chain-mana">Награда мана</Label>
                      <Input
                        id="chain-mana"
                        type="number"
                        placeholder="2000"
                        value={formData.rewardMana}
                        onChange={(e) =>
                          handleInputChange("rewardMana", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Chain Preview */}
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр цепочки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.name && (
                      <div>
                        <strong>Название:</strong> {formData.name}
                      </div>
                    )}
                    {selectedMissions.length > 0 && (
                      <div>
                        <strong>Миссии:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMissions.map((mission) => (
                            <Badge
                              key={mission.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {mission.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(formData.rewardXp > 0 || formData.rewardMana > 0) && (
                      <div className="flex items-center gap-4 pt-2 border-t border-border">
                        {formData.rewardXp > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary" />
                            {formData.rewardXp} XP
                          </span>
                        )}
                        {formData.rewardMana > 0 && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-rewards-amber" />
                            {formData.rewardMana} маны
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCreateChain}
                    disabled={isCreating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    {isCreating ? "Создание..." : "Создать цепочку"}
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
