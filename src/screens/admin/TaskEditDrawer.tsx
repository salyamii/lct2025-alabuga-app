import { useState, useEffect } from "react";
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
import { TaskUpdateRequest } from "../../api/types/apiTypes";
import { Task } from "../../domain/task";

interface TaskEditDrawerProps {
  task: Task | null;
}

export function TaskEditDrawer({ task }: TaskEditDrawerProps) {
  const { taskEditOpen, closeTaskEdit } = useOverlayStore();
  const { updateTask } = useTaskStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description
      });
    }
  }, [task]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!task) return;

    if (!formData.title.trim()) {
      toast.error("Название задания обязательно!");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Описание задания обязательно!");
      return;
    }

    try {
      setIsUpdating(true);
      const taskData: TaskUpdateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim()
      };

      await updateTask(task.id, taskData);
      
      toast.success("Задание успешно обновлено! 📝", {
        description: `"${formData.title}" было обновлено`
      });

      closeTaskEdit();
    } catch (error) {
      console.error("Ошибка при обновлении задания:", error);
      toast.error("Ошибка при обновлении задания. Попробуйте еще раз.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    closeTaskEdit();
  };

  return (
    <Drawer open={taskEditOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Редактирование задания
          </DrawerTitle>
          <DrawerDescription>
            Измените информацию о задании
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
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating || !formData.title.trim() || !formData.description.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              {isUpdating ? "Обновление..." : "Обновить задание"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
