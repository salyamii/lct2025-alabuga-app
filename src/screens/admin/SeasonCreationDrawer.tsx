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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  Calendar,
  Save,
  Star,
} from "lucide-react";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { Season } from "../../domain/season";

interface SeasonCreationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SeasonCreationDrawer({
  open,
  onOpenChange,
}: SeasonCreationDrawerProps) {
  const { createSeason } = useSeasonStore();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSeason = async () => {
    // Basic validation
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      toast.error("Дата начала не может быть в прошлом");
      return;
    }

    if (endDate <= startDate) {
      toast.error("Дата окончания должна быть позже даты начала");
      return;
    }

    try {
      setIsCreating(true);
      
      // Создаем сезон
      const seasonData = {
        name: formData.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      await createSeason(seasonData);

      // Показываем успешное сообщение
      toast.success("Сезон успешно создан! 🌟", {
        description: `"${formData.name}" готов к развертыванию`,
      });
    } catch (error) {
      console.error("Ошибка при создании сезона:", error);
      toast.error("Ошибка при создании сезона. Попробуйте еще раз.");
      return;
    } finally {
      setIsCreating(false);
    }

    // Reset form
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
    });

    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    toast.success("Сезон сохранен как черновик! 📋");
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
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Создать новый сезон
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
              {/* Main Season Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      Обзор сезона
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="season-name">Название сезона *</Label>
                      <Input
                        id="season-name"
                        placeholder="например, Delta Constellation"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="season-start">Дата начала *</Label>
                        <Input
                          id="season-start"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="season-end">Дата окончания *</Label>
                        <Input
                          id="season-end"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Season Preview */}
              <div className="space-y-6">
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр сезона
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.name && (
                      <div>
                        <strong>Название:</strong> {formData.name}
                      </div>
                    )}
                    {formData.startDate && (
                      <div>
                        <strong>Дата начала:</strong>{" "}
                        <span className="text-muted-foreground">
                          {new Date(formData.startDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    {formData.endDate && (
                      <div>
                        <strong>Дата окончания:</strong>{" "}
                        <span className="text-muted-foreground">
                          {new Date(formData.endDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    {formData.startDate && formData.endDate && (
                      <div>
                        <strong>Продолжительность:</strong>{" "}
                        <span className="text-muted-foreground">
                          {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCreateSeason}
                    disabled={isCreating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {isCreating ? "Создание..." : "Создать сезон"}
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
