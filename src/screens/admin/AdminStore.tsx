import { Plus, Search, Filter, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useStoreStore } from "../../stores/useStoreStore";
import { useEffect, useState } from "react";
import { StoreItem } from "../../domain/store";
import { mediaService } from "../../api/services/mediaService";

interface AdminStoreProps {
  handleFetchStoreItems: () => Promise<void>;
  handleCreateStoreItem: () => void;
  handleEditStoreItem: (item: StoreItem) => void;
  handleDeleteStoreItem: (item: StoreItem) => void;
  setSelectedStoreItem: (item: StoreItem) => void;
}

export function AdminStore({ 
  handleFetchStoreItems,
  handleCreateStoreItem, 
  handleEditStoreItem, 
  handleDeleteStoreItem, 
  setSelectedStoreItem 
}: AdminStoreProps) {
  const { items, isLoading } = useStoreStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemImages, setItemImages] = useState<Record<number, string>>({});

  useEffect(() => {
    handleFetchStoreItems();
  }, []);

  // Загружаем изображения товаров
  useEffect(() => {
    const loadItemImages = async () => {
      if (items.length === 0) return;
      
      const imagePromises = items.map(async (item) => {
        if (item.imageUrl) {
          try {
            const imageUrl = await mediaService.loadImageWithAuth(item.imageUrl);
            return { id: item.id, url: imageUrl };
          } catch (error) {
            console.error(`Ошибка загрузки изображения для товара ${item.id}:`, error);
            return { id: item.id, url: '' };
          }
        }
        return { id: item.id, url: '' };
      });

      const loadedImages = await Promise.all(imagePromises);
      const imagesMap: Record<number, string> = {};
      loadedImages.forEach(({ id, url }) => {
        if (url) imagesMap[id] = url;
      });
      setItemImages(imagesMap);
    };

    if (items.length > 0) {
      loadItemImages();
    }
  }, [items]);

  // Фильтрация товаров по поисковому запросу
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все товары</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Поиск товаров..." 
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Фильтр
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Загрузка товаров...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                return (
                  <div key={item.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center overflow-hidden">
                          {itemImages[item.id] ? (
                            <img 
                              src={itemImages[item.id]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <HelpCircle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <h4 className="font-semibold text-base">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">Цена:</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.price} маны
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">Остаток:</span>
                                <Badge 
                                  variant={item.isLowStock() ? "destructive" : "outline"} 
                                  className="text-xs"
                                >
                                  {item.stock} шт.
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge 
                                variant={item.isAvailable() ? "default" : "secondary"}
                                className={`text-xs ${
                                  item.isAvailable() 
                                    ? "bg-success text-white" 
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {item.isAvailable() ? "Доступен" : "Нет в наличии"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedStoreItem(item);
                            handleEditStoreItem(item);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedStoreItem(item);
                            handleDeleteStoreItem(item);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && !isLoading && (
                <div className="text-center py-8 col-span-2">
                  <div className="text-muted-foreground mb-4">
                    {searchQuery ? "Товары не найдены" : "Товары не найдены"}
                  </div>
                  <Button onClick={handleCreateStoreItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    {searchQuery ? "Создать товар" : "Создать первый товар"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}