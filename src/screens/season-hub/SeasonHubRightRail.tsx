import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Trophy, Sparkles, Users, Globe, ChevronRight, TrendingUp, FileText, Star } from "lucide-react";
import { useRankStore } from "../../stores/useRankStore";
import { useEffect } from "react";

interface SeasonHubRightRailProps {
  userXp: number;
  userMana: number;
  userRankId: number;
  onShipLogOpen: () => void;
}

export function SeasonHubRightRail({ userXp, userMana, userRankId, onShipLogOpen }: SeasonHubRightRailProps) {
    const { ranks, fetchRanks } = useRankStore();

    // Загружаем ранги при монтировании компонента
    useEffect(() => {
      if (ranks.length === 0) {
        fetchRanks();
      }
    }, [ranks.length, fetchRanks]);

    // Обработчики событий
    const onSquadronDetails = () => {
        console.log('Открыть детали сквада');
    };

    const onMentorRatingOpen = () => {
        console.log('Открыть оценку ментора');
    };

    // Находим текущий ранг пользователя
    const currentRank = ranks.find(r => r.id === userRankId);
    
    // Сортируем ранги по requiredXp для нахождения следующего
    const sortedRanks = [...ranks].sort((a, b) => a.requiredXp - b.requiredXp);
    
    // Находим следующий ранг (первый ранг с requiredXp больше текущего)
    const currentRankXP = currentRank?.requiredXp || 0;
    const nextRank = sortedRanks.find(r => r.requiredXp > currentRankXP);
    
    // Находим предыдущий ранг для расчета прогресса
    const currentRankIndex = sortedRanks.findIndex(r => r.id === userRankId);
    const previousRank = currentRankIndex > 0 ? sortedRanks[currentRankIndex - 1] : null;

    const currentRankName = currentRank?.name || "Космический кадет";
    const nextRankXP = nextRank?.requiredXp || currentRankXP;
    const previousRankXP = previousRank?.requiredXp || 0;
    
    const xpInCurrentRank = userXp - previousRankXP;
    const xpNeededForRank = nextRankXP - previousRankXP;
    const xpProgress = xpNeededForRank > 0 ? Math.round((xpInCurrentRank / xpNeededForRank) * 100) : 100;
    const xpToNextRank = Math.max(0, nextRankXP - userXp);

    return (
        <div className="space-y-4 md:space-y-6 lg:block">
                
                {/* Enhanced Flight Status */}
                <Card className="orbital-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent"></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-rewards-amber" />
                      Статус полёта
                      <Sparkles className="w-4 h-4 text-primary ml-auto" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Текущий ранг</span>
                        <Badge className="bg-primary-200 text-primary-600">{currentRankName}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">XP полёта</span>
                        <span className="font-mono text-sm md:text-base">
                          {userXp.toLocaleString()} / {nextRankXP.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={xpProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {nextRank 
                          ? `${xpToNextRank.toLocaleString()} XP до ${nextRank.name}`
                          : "Максимальный ранг достигнут!"
                        }
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Баланс маны</span>
                        <span className="font-mono text-lg text-rewards-amber">
                          {userMana.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Enhanced Squadron Progress */}
                <Card className="orbital-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-info" />
                      Сквад Альфа-7
                      <Globe className="w-4 h-4 text-soft-cyan ml-auto" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Еженедельная цель</span>
                        <span className="text-sm">18 / 25 миссий</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Активные пилоты</span>
                        <span>8 / 12</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Средний рейтинг</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-rewards-amber" />
                          4.8
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Глобальный ранг</span>
                        <span className="text-success">#23 / 847</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={onSquadronDetails}
                    >
                      Команда сквада
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Enhanced Ship Log */}
                <Card className="orbital-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-text-icon" />
                      Журнал полёта
                      <Badge variant="secondary" className="text-xs ml-auto">Активен</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Групповая миссия завершена</p>
                          <p className="text-muted-foreground text-xs">Галактический флот навигации • 2 часа назад</p>
                          <Badge className="text-xs mt-1 bg-success/10 text-success">+450 Mana</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Рейтинг ментора получен</p>
                          <p className="text-muted-foreground text-xs">⭐⭐⭐⭐⭐ от Alex Chen • 5 часов назад</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-rewards-amber rounded-full mt-2 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Космический ивент присоединён</p>
                          <p className="text-muted-foreground text-xs">Слияние звёзд • 6 часов назад</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={onShipLogOpen}
                      >
                        Посмотреть полный журнал
                        <TrendingUp className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
        </div>
    );
}
