import { Plus, ShoppingBag, Search, Filter, Package } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useStoreStore } from "../../stores/useStoreStore";
import { useEffect } from "react";
import { StoreItem } from "../../domain/store";

interface AdminStoreProps {
  handleCreateStoreItem: () => void;
  handleEditStoreItem: (item: StoreItem) => void;
  handleDeleteStoreItem: (item: StoreItem) => void;
  setSelectedStoreItem: (item: StoreItem) => void;
}

export function AdminStore({ 
  handleCreateStoreItem, 
  handleEditStoreItem, 
  handleDeleteStoreItem, 
  setSelectedStoreItem 
}: AdminStoreProps) {
  const { items, fetchItems, isLoading } = useStoreStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="space-y-6">
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все товары</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск товаров..." className="pl-9 w-64" />
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
              {items.map((item) => (
                <div key={item.id} className="admin-card p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-base">
                              {item.title}
                            </h4>
                            {item.isLowStock() && (
                              <Badge className="text-xs bg-destructive text-white">
                                Низкий остаток
                              </Badge>
                            )}
                            {!item.isAvailable() && (
                              <Badge className="text-xs bg-muted text-muted-foreground">
                                Нет в наличии
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-primary">
                                {item.price}
                              </span>
                              <span>маны</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>Остаток: {item.stock}</span>
                            </div>
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
              ))}
              
              {items.length === 0 && !isLoading && (
                <div className="text-center py-8 col-span-full">
                  <div className="text-muted-foreground mb-4">
                    Товары не найдены
                  </div>
                  <Button onClick={handleCreateStoreItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первый товар
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
