import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer";
import { useStoreStore } from "../../stores/useStoreStore";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

export function StoreItemCreationDrawer() {
  const { storeItemCreationOpen, closeStoreItemCreation } = useOverlayStore();
  const { createItem } = useStoreStore();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    stock: 0
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreate = async () => {
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

    try {
      setIsCreating(true);
      await createItem({
        title: formData.title.trim(),
        price: formData.price,
        stock: formData.stock
      });

      // Сброс формы
      setFormData({ title: "", price: 0, stock: 0 });
      closeStoreItemCreation();
    } catch (error) {
      console.error("Ошибка при создании товара:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", price: 0, stock: 0 });
    closeStoreItemCreation();
  };

  return (
    <Drawer open={storeItemCreationOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Создание нового товара
          </DrawerTitle>
          <DrawerDescription>
            Заполните информацию о товаре для добавления в магазин
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
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating || !formData.title.trim()}
              className="bg-primary hover:bg-primary-600"
            >
              {isCreating ? "Создание..." : "Создать товар"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
