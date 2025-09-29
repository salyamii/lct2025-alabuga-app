import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useStoreStore } from "../../stores/useStoreStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { ShoppingBag, X } from "lucide-react";
import { StoreItem } from "../../domain/store";

interface StoreItemEditDrawerProps {
  item: StoreItem | null;
}

export function StoreItemEditDrawer({ item }: StoreItemEditDrawerProps) {
  const { storeItemEditOpen, closeStoreItemEdit } = useOverlayStore();
  const { updateItem } = useStoreStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        price: item.price,
        stock: item.stock
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!item) return;

    if (!formData.title.trim()) {
      return;
    }

    if (formData.price < 0) {
      return;
    }

    if (formData.stock < 0) {
      return;
    }

    try {
      setIsUpdating(true);
      await updateItem(item.id, {
        title: formData.title.trim(),
        price: formData.price,
        stock: formData.stock
      });

      closeStoreItemEdit();
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
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
              disabled={isUpdating || !formData.title.trim()}
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
