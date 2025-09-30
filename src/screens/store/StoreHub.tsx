import { ShoppingCart, Star, Gem, Sparkles } from "lucide-react";
import { Store } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useStoreStore } from "../../stores/useStoreStore";
import { useUserStore } from "../../stores/useUserStore";
import { useEffect } from "react";

interface StoreHubProps {
  onPurchase?: (itemId: number) => void;
}

export function StoreHub({ onPurchase }: StoreHubProps) {
    const { items, fetchItems, isLoading } = useStoreStore();
    const { user } = useUserStore();

    // Загружаем товары при монтировании
    useEffect(() => {
      if (items.length === 0) {
        fetchItems();
      }
    }, [items.length, fetchItems]);

    const userMana = user?.mana || 0;
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
              <Store className="w-6 h-6 text-primary stellar-pulse" />
              Космический Маркетплейс
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Обменивайте свою Ману на эксклюзивные награды
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              <Sparkles className="w-4 h-4 mr-2 text-rewards-amber stellar-pulse" />
              <span className="font-mono">{userMana}</span> Мана
            </Badge>
          </div>
        </div>
  
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Товары пока не доступны</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item) => {
              const isAvailable = item.isAvailable();
              const canAfford = item.canAfford(userMana);
              const isLowStock = item.isLowStock(10);

              return (
                <Card key={item.id} className="store-card">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center shrink-0">
                          <Gem className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base leading-tight">{item.title}</h3>
                        </div>
                      </div>
                      {isLowStock && isAvailable && (
                        <Badge variant="secondary" className="text-xs bg-warning/10 text-warning border-warning/30">
                          <Star className="w-3 h-3 mr-1" />
                          Мало
                        </Badge>
                      )}
                    </div>
                    
                    {/* Stock info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Gem className="w-3 h-3" />
                        {isAvailable ? `${item.stock} в наличии` : 'Нет в наличии'}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        isAvailable ? 'bg-success stellar-pulse' : 'bg-danger'
                      }`} />
                    </div>
                    
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rewards-amber stellar-pulse" />
                        <span className={`font-mono font-semibold text-sm md:text-base ${
                          !canAfford ? 'text-danger' : ''
                        }`}>
                          {item.price} Мана
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={!isAvailable || !canAfford}
                        onClick={() => onPurchase?.(item.id)}
                        className="bg-primary hover:bg-primary-600 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          {!isAvailable ? 'Закончилось' : !canAfford ? 'Недостаточно' : 'Купить'}
                        </span>
                        <span className="sm:hidden">
                          {!isAvailable ? 'Нет' : !canAfford ? 'Мало' : 'Купить'}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
}