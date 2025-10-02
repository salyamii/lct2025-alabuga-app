import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useRankStore } from "../../stores/useRankStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Star, X, Upload, Image as ImageIcon, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { mediaService } from "../../api/services/mediaService";

export function RankCreationDrawer() {
  const { rankCreationOpen, closeRankCreation } = useOverlayStore();
  const { createRank } = useRankStore();

  const [formData, setFormData] = useState({
    name: "",
    requiredXp: 0,
    imageUrl: ""
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error("Пожалуйста, выберите изображение");
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 5MB");
      return;
    }

    try {
      setIsUploading(true);
      
      // Загружаем файл на сервер
      const response = await mediaService.uploadFile(file);
      
      if (response.data?.url) {
        setUploadedImageUrl(response.data.url);
        setFormData(prev => ({
          ...prev,
          imageUrl: response.data.url
        }));
        
        // Создаем превью для отображения
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        
        toast.success("Изображение успешно загружено! 🖼️");
      } else {
        throw new Error("Не удалось получить URL изображения");
      }
    } catch (error: any) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Ошибка при загрузке изображения. Попробуйте еще раз.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl("");
    setPreviewImage("");
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    if (!formData.imageUrl.trim()) {
      toast.error("Изображение ранга обязательно!");
      return;
    }

    try {
      setIsCreating(true);
      await createRank({
        name: formData.name.trim(),
        requiredXp: formData.requiredXp,
        imageUrl: formData.imageUrl.trim()
      });

      toast.success("Ранг успешно создан! ⭐", {
        description: `"${formData.name}" готов к использованию`
      });

      // Сброс формы
      handleClose();
    } catch (error) {
      console.error("Ошибка при создании ранга:", error);
      toast.error("Ошибка при создании ранга. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", requiredXp: 0, imageUrl: "" });
    setUploadedImageUrl("");
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

              <div className="space-y-2">
                <Label htmlFor="image">Изображение ранга *</Label>
                <div className="space-y-3">
                  {/* Превью изображения */}
                  {previewImage ? (
                    <div className="relative">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={previewImage} 
                          alt="Превью изображения"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-destructive hover:bg-destructive/90 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Кнопка загрузки */}
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {previewImage ? "Изменить изображение" : "Загрузить изображение"}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5MB
                  </p>
                </div>
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
              disabled={isCreating || !formData.name.trim() || !formData.imageUrl.trim()}
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
