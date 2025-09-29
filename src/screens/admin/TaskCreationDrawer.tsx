import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useTaskStore } from "../../stores/useTaskStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";
import { TaskCreateRequest } from "../../api/types/apiTypes";

export function TaskCreationDrawer() {
  const { taskCreationOpen, closeTaskCreation } = useOverlayStore();
  const { createTask } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error("Название задания обязательно!");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Описание задания обязательно!");
      return;
    }

    try {
      setIsCreating(true);
      const taskData: TaskCreateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim()
      };

      await createTask(taskData);
      
      toast.success("Задание успешно создано! 📝", {
        description: `"${formData.title}" было добавлено в систему`
      });

      // Сброс формы
      setFormData({ title: "", description: "" });
      closeTaskCreation();
    } catch (error) {
      console.error("Ошибка при создании задания:", error);
      toast.error("Ошибка при создании задания. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "" });
    closeTaskCreation();
  };

  return (
    <Drawer open={taskCreationOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Создание нового задания
          </DrawerTitle>
          <DrawerDescription>
            Заполните информацию о задании для добавления в систему
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
                <Label htmlFor="title">Название задания *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Введите название задания"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание задания *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Введите описание задания"
                  className="w-full min-h-[100px]"
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
              disabled={isCreating || !formData.title.trim() || !formData.description.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              {isCreating ? "Создание..." : "Создать задание"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
