import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Download, Crown, Sparkles, Star, Globe, Orbit, Zap, Shield, Calendar, Moon, Target, Rocket, Gem } from "lucide-react";
import { toast } from "sonner";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { ArtifactRarityEnum } from "../../api/types/apiTypes";
import { useUserStore } from "../../stores/useUserStore";

export function ArtifactsHub() {

    const { artifacts } = useArtifactStore();
    const { user } = useUserStore();

    const badges = [
      {
        id: "badge-1",
        title: "Quantum React Voyager",
        description: "Mastered React fundamentals across the cosmic web",
        earnedDate: "2024-03-15",
        category: "Cosmic Tech",
        earned: true,
        rarity: "Epic",
        icon: Zap
      },
      {
        id: "badge-2",
        title: "Galactic Mentor Guardian", 
        description: "Successfully guided 5 cosmic apprentices",
        earnedDate: "2024-03-10",
        category: "Leadership",
        earned: true,
        rarity: "Legendary",
        icon: Crown
      },
      {
        id: "badge-3",
        title: "Quantum Speed Particle",
        description: "Completed quest at light-speed velocity",
        earnedDate: "2024-03-08", 
        category: "Achievement",
        earned: true,
        rarity: "Rare",
        icon: Rocket
      },
      {
        id: "badge-4",
        title: "Code Constellation Master",
        description: "Complete 50 cosmic coding challenges",
        earnedDate: null,
        category: "Cosmic Tech", 
        earned: false,
        rarity: "Epic",
        progress: 32,
        icon: Star
      },
      {
        id: "badge-5",
        title: "Squadron Commander",
        description: "Lead a stellar squadron to galactic victory",
        earnedDate: null,
        category: "Leadership",
        earned: false,
        rarity: "Legendary",
        progress: 0,
        icon: Globe
      }
    ];
  
    // const handleExportBadges = () => {
    //   const earnedBadges = badges.filter(badge => badge.earned);
    //   const dataStr = JSON.stringify(earnedBadges, null, 2);
    //   const dataBlob = new Blob([dataStr], { type: 'application/json' });
    //   const url = URL.createObjectURL(dataBlob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = 'cosmic-artifacts.json';
    //   link.click();
    //   URL.revokeObjectURL(url);
      
    //   toast.success("Cosmic artifacts exported successfully! ✨", {
    //     description: "Your stellar achievements have been downloaded"
    //   });
    // };
  
    // const handleViewBadgeDetails = (badge: any) => {
    //   toast.info(`Cosmic Artifact: ${badge.title}`, {
    //     description: badge.description
    //   });
    // };
  
    const getRarityColor = (rarity: ArtifactRarityEnum) => {
      switch (rarity) {
        case ArtifactRarityEnum.LEGENDARY: return "from-yellow-400 via-rewards-amber to-yellow-600";
        case ArtifactRarityEnum.EPIC: return "from-purple-400 via-info to-purple-600";
        case ArtifactRarityEnum.RARE: return "from-blue-400 via-primary to-blue-600";
        case ArtifactRarityEnum.UNCOMMON: return "from-green-400 via-success to-green-600";
        case ArtifactRarityEnum.COMMON: return "from-gray-400 to-gray-600";
        default: return "from-gray-400 to-gray-600";
      }
    };
  
    const getRarityIcon = (rarity: ArtifactRarityEnum) => {
      switch (rarity) {
        case ArtifactRarityEnum.LEGENDARY: return Crown;
        case ArtifactRarityEnum.EPIC: return Sparkles;
        case ArtifactRarityEnum.RARE: return Star;
        case ArtifactRarityEnum.UNCOMMON: return Gem;
        case ArtifactRarityEnum.COMMON: return Gem;
        default: return Gem;
      }
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
              <Gem className="w-6 h-6 text-primary stellar-pulse" />
              Коллекция артефактов
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Ваш сундук с легендарными артефактами и звездными достижениями
            </p>
          </div>
          <Button 
            onClick={() => { /* TODO export artifacts */ }}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Экспорт артефактов</span>
            <span className="sm:hidden">Экспорт</span>
          </Button>
        </div>
  
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="orbital-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-mono font-bold text-primary stellar-pulse">
                {user?.artifactIds.length || 0}
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Star className="w-3 h-3" />
                Получено
              </p>
            </CardContent>
          </Card>
          <Card className="orbital-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-mono font-bold text-text-secondary">
                {artifacts.length}
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Orbit className="w-3 h-3" />
                Космос
              </p>
            </CardContent>
          </Card>
          <Card className="orbital-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-mono font-bold text-rewards-amber stellar-pulse">
                {artifacts.filter(a => a.rarity === ArtifactRarityEnum.LEGENDARY).length}
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Crown className="w-3 h-3" />
                Легендарные
              </p>
            </CardContent>
          </Card>
          <Card className="orbital-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-mono font-bold text-success">
                {artifacts.length > 0
                  ? Math.round(
                      ((user?.artifactIds?.filter(id => artifacts.some(a => a.id === id)).length || 0) / artifacts.length) * 100
                    )
                  : 0
                }%
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Zap className="w-3 h-3" />
                Мастерство
              </p>
            </CardContent>
          </Card>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {artifacts.map((artifact) => {
            // Выбираем случайную иконку из набора доступных
            const availableIcons = [Star, Orbit, Crown, Zap, Shield];
            const IconComponent = availableIcons[Math.floor(Math.random() * availableIcons.length)];
            const RarityIcon = getRarityIcon(artifact.rarity);
            return (
              <Card 
                key={artifact.id} 
                className={`badge-card ${user?.artifactIds.includes(artifact.id) ? 'border-primary/30 stellar-glow' : 'badge-locked'} cursor-pointer`}
                onClick={() => {/* TODO view artifact details */}}
              >
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${
                        user?.artifactIds.includes(artifact.id) ? getRarityColor(artifact.rarity) : 'from-gray-400 to-gray-500'
                      } rounded-lg flex items-center justify-center relative ${
                        user?.artifactIds.includes(artifact.id) ? 'stellar-pulse' : ''
                      }`}
                    >
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      {user?.artifactIds.includes(artifact.id) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                          <RarityIcon className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {!user?.artifactIds.includes(artifact.id) && (
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white/70" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${user?.artifactIds.includes(artifact.id) ? '' : 'opacity-50'}`}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {artifact.rarity}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${user?.artifactIds.includes(artifact.id) ? '' : 'opacity-50'}`}
                      >
                        <RarityIcon className="w-3 h-3 mr-1" />
                        {artifact.rarity}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold text-base leading-tight ${
                      user?.artifactIds.includes(artifact.id) ? '' : 'text-muted-foreground'
                    }`}>
                      {artifact.title}
                    </h3>
                    <p className={`text-sm mt-1 leading-relaxed ${
                        user?.artifactIds.includes(artifact.id) ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {artifact.description}
                    </p>
                  </div>
                  
                  {user?.artifactIds.includes(artifact.id) ? (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Calendar className="w-4 h-4" />
                      <span>Получено 2023-0{Math.floor(Math.random() * 9) + 1}-1{Math.floor(Math.random() * 9) + 1}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        // Генерируем случайный прогресс от 0 до 50 для отображения
                        const randomProgress = Math.floor(Math.random() * 51);
                        return (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Космический прогресс
                              </span>
                              <span>{randomProgress}/50</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-info h-2 rounded-full transition-all"
                                style={{ width: `${(randomProgress / 50) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Moon className="w-4 h-4" />
                          <span>Не получено</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // onMissionDetails("mission-related-to-badge");
                          }}
                          className="text-xs"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Найти квесты
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
  
        {/* Cosmic Footer */}
        <div className="mt-8 text-center">
          <div className="text-xs text-muted-foreground opacity-75">
            ✨ Каждый артефакт рассказывает историю вашего путешествия через космос ✨
          </div>
        </div>
      </div>
    );
  }