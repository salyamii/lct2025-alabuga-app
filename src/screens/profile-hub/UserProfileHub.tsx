import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Sparkles, Crown, Settings, Globe, Zap, Target, Rocket, Gem, Star, Moon, Users, Orbit, Compass, Trophy, Sun, HelpCircle } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useRankStore } from "../../stores/useRankStore";
import { useState, useEffect } from "react";
import mediaService from "../../api/services/mediaService";

export function UserProfileHub({ onMentorshipOpen, onSettingsOpen, onGuildProgressOpen, onArtifactsOpen }: { onMentorshipOpen: () => void, onSettingsOpen: () => void, onGuildProgressOpen: () => void, onArtifactsOpen: () => void }) {
    const { user } = useUserStore();
    const { ranks, fetchRanks } = useRankStore();
    const [artifactImages, setArtifactImages] = useState<Record<number, string>>({});
    const [rankImage, setRankImage] = useState<string>("");

    // Загружаем ранги если их нет
    useEffect(() => {
        if (ranks.length === 0) {
            fetchRanks();
        }
    }, [ranks.length, fetchRanks]);

    // Загружаем изображение ранга пользователя
    useEffect(() => {
        const loadRankImage = async () => {
            if (!user?.rankId || !ranks.length) return;
            
            const userRank = ranks.find(r => r.id === user.rankId);
            if (!userRank?.imageUrl) return;
            
            try {
                const imageUrl = await mediaService.loadImageWithAuth(userRank.imageUrl);
                setRankImage(imageUrl);
            } catch (error) {
                console.error(`Ошибка загрузки изображения ранга:`, error);
                setRankImage("");
            }
        };

        if (user?.rankId && ranks.length > 0) {
            loadRankImage();
        }
    }, [user?.rankId, ranks]);

    // Загружаем изображения артефактов пользователя
    useEffect(() => {
        const loadArtifactImages = async () => {
            if (!user?.artifacts || user.artifacts.length === 0) return;
            
            const imagePromises = user.artifacts.slice(0, 3).map(async (artifact) => {
                if (artifact.imageUrl) {
                    try {
                        const imageUrl = await mediaService.loadImageWithAuth(artifact.imageUrl);
                        return { id: artifact.id, url: imageUrl };
                    } catch (error) {
                        console.error(`Ошибка загрузки изображения для артефакта ${artifact.id}:`, error);
                        return { id: artifact.id, url: '' };
                    }
                }
                return { id: artifact.id, url: '' };
            });

            const loadedImages = await Promise.all(imagePromises);
            const imagesMap: Record<number, string> = {};
            loadedImages.forEach(({ id, url }) => {
                if (url) imagesMap[id] = url;
            });
            setArtifactImages(imagesMap);
        };

        if (user?.artifacts && user.artifacts.length > 0) {
            loadArtifactImages();
        }
    }, [user?.artifacts]);

    // Получаем информацию о ранге пользователя
    const userRank = ranks.find(r => r.id === user?.rankId);
    const userRankName = userRank?.name || 'Неизвестный ранг';
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Загрузка...';
    const userMana = user?.mana || 0;
    const userArtifactsCount = user?.artifacts.length || 0;
    const userMissionsCount = user?.totalMissionsCount || 0;
    const userCompletedMissionsCount = user?.missions.filter(mission => mission.isCompleted).length || 0;

    const handleViewArtifacts = () => {
        onArtifactsOpen();
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Профиль космического исследователя
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Ваше путешествие через бесконечную вселенную знаний
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onSettingsOpen}
              variant="outline" 
              className="hidden md:flex"
            >
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Button>
            <Button 
              onClick={onMentorshipOpen}
              className="bg-primary hover:bg-primary-600 text-white hidden md:flex"
            >
              <Crown className="w-4 h-4 mr-2" />
              Ментор-хаб
            </Button>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="orbital-border-enhanced">
            <CardContent className="p-4 md:p-6 text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary via-info to-soft-cyan rounded-full mx-auto flex items-center justify-center stellar-pulse overflow-hidden">
                  {rankImage ? (
                    <img 
                      src={rankImage} 
                      alt={userRankName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-rewards-amber rounded-full flex items-center justify-center">
                  <Crown className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-rewards-amber" />
                  {userName}
                  <Star className="w-4 h-4 text-rewards-amber" />
                </h3>
                <p className="text-sm text-muted-foreground">{userRankName} • Уровень {user?.rankId || 0}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3" />
                  Эскадрилья Туманности • Станция Звездной кузницы
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    Часы путешествий
                  </span>
                  <span className="font-mono flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    247ч
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-success" />
                    Успех квестов
                  </span>
                  <span className="text-success font-mono">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Rocket className="w-3 h-3 text-info" />
                    Миссий завершено
                  </span>
                  <span className="font-mono">{userCompletedMissionsCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Card className="orbital-border">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Trophy className="w-5 h-5 text-rewards-amber stellar-pulse" />
                Недавние звездные достижения
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-success to-soft-cyan rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Вознесение в Космического путешественника</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      Вчера
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-info to-primary rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Веха галактического наставника</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Moon className="w-3 h-3" />
                      3 цикла назад
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-rewards-amber to-primary rounded-full flex items-center justify-center stellar-pulse">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Артефакт квантовой скорости</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      1 фаза назад
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Card className="orbital-border">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Compass className="w-5 h-5 text-text-icon" />
                Космическая статистика
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Rocket className="w-3 h-3" />
                    Всего миссий
                  </span>
                  <span className="font-mono text-sm">{userMissionsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Gem className="w-3 h-3" />
                    Космические артефакты
                  </span>
                  <span className="font-mono text-sm">{userArtifactsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Баланс маны
                  </span>
                  <span className="font-mono text-sm text-rewards-amber">{userMana.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Ранг эскадрильи
                  </span>
                  <span className="font-mono text-sm">#3 / 12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Космический рейтинг наставника
                  </span>
                  <span className="font-mono text-sm text-success">4.8/5.0</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  onClick={onGuildProgressOpen}
                  variant="outline" 
                  className="w-full"
                >
                  <Orbit className="w-4 h-4 mr-2" />
                  Созвездие гильдии
                </Button>
                <Button 
                  onClick={onMentorshipOpen}
                  variant="outline" 
                  className="w-full md:hidden"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Узел наставничества
                </Button>
                <Button 
                  onClick={onSettingsOpen}
                  variant="outline" 
                  className="w-full md:hidden"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Управление кораблем
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Extended Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
          <Card className="orbital-border cosmic-float">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Orbit className="w-5 h-5 text-primary stellar-pulse" />
                Текущий космический путь
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Квантовая веб-разработка</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Созвездие React & TypeScript
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Прогресс до следующего космического ранга
                    </span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-info h-2 rounded-full transition-all stellar-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Card className="orbital-border cosmic-float">
            <CardContent className="p-4 md:p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Gem className="w-5 h-5 text-rewards-amber stellar-pulse" />
                Легендарные космические артефакты
              </h3>
              <div className="flex items-center gap-3">
                {user?.artifacts && user.artifacts.length > 0 ? (
                  user.artifacts.slice(0, 3).map((artifact) => {
                    const imageUrl = artifactImages[artifact.id];
                    // Показываем артефакт только если есть изображение
                    if (!imageUrl) return null;
                    
                    return (
                      <div 
                        key={artifact.id}
                        className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-rewards-amber rounded-lg flex items-center justify-center stellar-pulse relative overflow-hidden"
                      >
                        <img 
                          src={imageUrl} 
                          alt={artifact.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  }).filter(Boolean) // Убираем null элементы
                ) : null}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={handleViewArtifacts}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Обзор артефактов
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center mt-2 opacity-75">
                ✨ Прокладывайте новые пути через космическую паутину ✨
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }