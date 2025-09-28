import { Clock, Gem, Moon, ShoppingCart, Star, Zap } from "lucide-react";

import { Crown } from "lucide-react";
import { Rocket } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Store } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export function StoreHub() {
    const categories = [
      { id: "digital", name: "Цифровые артефакты", count: 12, icon: Zap },
      { id: "apparel", name: "Космическое оборудование", count: 8, icon: Crown }, 
      { id: "experience", name: "Звездные путешествия", count: 5, icon: Rocket },
      { id: "coming-soon", name: "Будущие миры", count: 15, icon: Sparkles }
    ];
  
    const rewards = [
      {
        id: "reward-1",
        title: "Quantum Code Editor Nexus",
        description: "Эксклюзивный космический редактор с подсветкой синтаксиса в стиле туманности",
        cost: 500,
        category: "Цифровые артефакты",
        inStock: true,
        stockCount: 50,
        comingSoon: false,
        icon: Zap
      },
      {
        id: "reward-2", 
        title: "Starforge Academy Hoodie",
        description: "Качественный худи с принтом карты созвездий",
        cost: 1200,
        category: "Космическое оборудование",
        inStock: true,
        stockCount: 15,
        comingSoon: false,
        icon: Crown
      },
      {
        id: "reward-3",
        title: "Galactic Summit VIP Pass",
        description: "VIP доступ к ежегодному межгалактическому tech саммиту",
        cost: 2500,
        category: "Звездные путешествия",
        inStock: false,
        stockCount: 0,
        comingSoon: false,
        icon: Rocket
      },
      {
        id: "reward-4",
        title: "AI Quantum Assistant Pro",
        description: "Продвинутые AI-инструменты для космической разработки",
        cost: 800,
        category: "Цифровые артефакты",
        inStock: false,
        stockCount: 0,
        comingSoon: true,
        icon: Sparkles
      },
      {
        id: "reward-5",
        title: "Nebula Watch Cosmic Edition",
        description: "Лимитированная квантовая часы в космическом стиле",
        cost: 3500,
        category: "Будущие миры",
        inStock: false,
        stockCount: 0,
        comingSoon: true,
        icon: Star
      }
    ];
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
            <Store className="w-6 h-6 text-primary stellar-pulse" />
            Космический Маркетплейс
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Обменивайте свою Ману на эксклюзивные космические артефакты и звездные путешествия
          </p>
        </div>
  
        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="orbital-border hover:elevation-cosmic transition-all cursor-pointer">
                <CardContent className="p-3 md:p-4 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    {category.count} артефактов
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {rewards.map((reward) => {
            const IconComponent = reward.icon;
            return (
              <Card key={reward.id} className="store-card">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{reward.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {reward.category}
                      </Badge>
                      {reward.comingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Скоро
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Stock info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {reward.comingSoon ? (
                        <>
                          <Clock className="w-3 h-3" />
                          Материализуется...
                        </>
                      ) : reward.inStock ? (
                        <>
                          <Gem className="w-3 h-3" />
                          {reward.stockCount} в квантовом хранилище
                        </>
                      ) : (
                        <>
                          <Moon className="w-3 h-3" />
                          Измерение недоступно
                        </>
                      )}
                    </span>
                    {!reward.comingSoon && (
                      <span className={`w-2 h-2 rounded-full ${
                        reward.inStock ? 'bg-success stellar-pulse' : 'bg-danger'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rewards-amber stellar-pulse" />
                      <span className="font-mono font-semibold text-sm md:text-base">{reward.cost} Мана</span>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!reward.inStock || reward.comingSoon}
                      className="bg-primary hover:bg-primary-600 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">
                        {reward.comingSoon ? 'Скоро' : reward.inStock ? 'Получить' : 'Закончилось'}
                      </span>
                      <span className="sm:hidden">
                        {reward.comingSoon ? 'Скоро' : reward.inStock ? 'Взять' : 'Закончилось'}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
}