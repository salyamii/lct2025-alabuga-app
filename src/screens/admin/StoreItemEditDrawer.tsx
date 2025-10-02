import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useStoreStore } from "../../stores/useStoreStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { ShoppingBag, X, Upload, Image as ImageIcon, HelpCircle } from "lucide-react";
import { StoreItem } from "../../domain/store";
import { mediaService } from "../../api/services/mediaService";
import { toast } from "sonner";

interface StoreItemEditDrawerProps {
  item: StoreItem | null;
}

export function StoreItemEditDrawer({ item }: StoreItemEditDrawerProps) {
  const { storeItemEditOpen, closeStoreItemEdit } = useOverlayStore();
  const { updateItem } = useStoreStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0,
    imageUrl: ""
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        price: item.price,
        stock: item.stock,
        imageUrl: item.imageUrl
      });
      setUploadedImageUrl(item.imageUrl);
      setPreviewImage(item.imageUrl);
    }
  }, [item]);

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

  const handleUpdate = async () => {
    if (!item) return;

    if (!formData.title.trim()) {
      toast.error("Название товара обязательно!");
      return;
    }

    if (formData.price < 0) {
      toast.error("Цена не может быть отрицательной!");
      return;
    }

    if (formData.stock < 0) {
      toast.error("Количество не может быть отрицательным!");
      return;
    }

    if (!formData.imageUrl.trim()) {
      toast.error("Изображение товара обязательно!");
      return;
    }

    try {
      setIsUpdating(true);
      await updateItem(item.id, {
        title: formData.title.trim(),
        price: formData.price,
        stock: formData.stock,
        imageUrl: formData.imageUrl.trim()
      });

      toast.success("Товар успешно обновлен! 🛍️", {
        description: `"${formData.title}" был обновлен`
      });

      closeStoreItemEdit();
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
      toast.error("Ошибка при обновлении товара. Попробуйте еще раз.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    closeStoreItemEdit();
  };

  return (
    <Drawer open={storeItemEditOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Редактирование товара
          </DrawerTitle>
          <DrawerDescription>
            Обновите информацию о товаре
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация о товаре</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название товара *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Введите название товара"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (маны)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Количество</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Изображение товара *</Label>
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
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating || !formData.title.trim() || !formData.imageUrl.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              {isUpdating ? "Обновление..." : "Обновить товар"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

