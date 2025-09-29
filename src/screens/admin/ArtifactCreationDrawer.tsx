import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { Gem, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ArtifactCreateRequest, ArtifactRarityEnum } from "../../api/types/apiTypes";
import { mediaService } from "../../api/services/mediaService";

export function ArtifactCreationDrawer() {
  const { artifactCreationOpen, closeArtifactCreation } = useOverlayStore();
  const { createArtifact } = useArtifactStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rarity: "",
    imageUrl: ""
  });

  const handleInputChange = (field: string, value: string) => {
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
      
      // Создаем Blob URL для превью
      const blobUrl = URL.createObjectURL(file);
      setUploadedImageUrl(blobUrl);
      
      // Загружаем файл на сервер
      const response = await mediaService.uploadFile(file);
      
      if (response.data?.url) {
        setFormData(prev => ({
          ...prev,
          imageUrl: response.data.url
        }));
        toast.success("Изображение успешно загружено! 🖼️");
      } else {
        throw new Error("Не удалось получить URL загруженного файла");
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      toast.error("Ошибка при загрузке изображения. Попробуйте еще раз.");
      // Очищаем blob URL при ошибке
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
        setUploadedImageUrl("");
      }
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl("");
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };


  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error("Название артефакта обязательно!");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Описание артефакта обязательно!");
      return;
    }

    if (!formData.rarity) {
      toast.error("Редкость артефакта обязательна!");
      return;
    }

    try {
      setIsCreating(true);
      const artifactData: ArtifactCreateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        rarity: formData.rarity as ArtifactRarityEnum,
        imageUrl: formData.imageUrl.trim() || ""
      };

      await createArtifact(artifactData);
      
      toast.success("Артефакт успешно создан! 💎", {
        description: `"${formData.title}" был добавлен в систему`
      });

      // Сброс формы
      setFormData({ title: "", description: "", rarity: "", imageUrl: "" });
      closeArtifactCreation();
    } catch (error) {
      console.error("Ошибка при создании артефакта:", error);
      toast.error("Ошибка при создании артефакта. Попробуйте еще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    // Очищаем blob URL при закрытии
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setFormData({ title: "", description: "", rarity: "", imageUrl: "" });
    setUploadedImageUrl("");
    closeArtifactCreation();
  };

  return (
    <Drawer open={artifactCreationOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Создание нового артефакта
          </DrawerTitle>
          <DrawerDescription>
            Заполните информацию об артефакте для добавления в систему
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
                <Label htmlFor="title">Название артефакта *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Введите название артефакта"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание артефакта *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Введите описание артефакта"
                  className="w-full min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rarity">Редкость артефакта *</Label>
                <Select value={formData.rarity} onValueChange={(value) => handleInputChange("rarity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите редкость" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Обычный</SelectItem>
                    <SelectItem value="uncommon">Необычный</SelectItem>
                    <SelectItem value="rare">Редкий</SelectItem>
                    <SelectItem value="epic">Эпический</SelectItem>
                    <SelectItem value="legendary">Легендарный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Изображение артефакта</Label>
                
                {/* Скрытый input для выбора файла */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {uploadedImageUrl ? (
                  <div className="space-y-3">
                    {/* Превью загруженного изображения */}
                    <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={uploadedImageUrl}
                        alt="Превью артефакта"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Кнопка для замены изображения */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Загрузка..." : "Заменить изображение"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Кнопка загрузки */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadClick}
                      disabled={isUploading}
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {isUploading ? "Загрузка..." : "Нажмите для загрузки изображения"}
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG до 5MB
                        </span>
                      </div>
                    </Button>
                  </div>
                )}
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
              disabled={isCreating || !formData.title.trim() || !formData.description.trim() || !formData.rarity}
              className="bg-primary hover:bg-primary-600"
            >
              {isCreating ? "Создание..." : "Создать артефакт"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
