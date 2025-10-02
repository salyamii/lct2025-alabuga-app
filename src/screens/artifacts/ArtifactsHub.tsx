import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Download, Crown, Sparkles, Star, Globe, Orbit, Zap, Shield, Calendar, Moon, Target, Rocket, Gem } from "lucide-react";
import { toast } from "sonner";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { ArtifactRarityEnum } from "../../api/types/apiTypes";
import { useUserStore } from "../../stores/useUserStore";
import { useState, useEffect } from "react";
import mediaService from "../../api/services/mediaService";

export function ArtifactsHub() {

    const { artifacts, fetchArtifacts } = useArtifactStore();
    const { user, fetchUserProfile } = useUserStore();
    const [artifactImages, setArtifactImages] = useState<Record<number, string>>({});

    // Загружаем данные при монтировании
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('🔄 ArtifactsHub: загружаем данные...');
                await Promise.all([
                    fetchArtifacts(),
                    fetchUserProfile(),
                ]);
                console.log('✅ ArtifactsHub: данные загружены');
            } catch (error) {
                console.error('❌ ArtifactsHub: ошибка загрузки данных:', error);
            }
        };

        loadData();
    }, []); // Пустой массив - выполняется только при монтировании

    // Логирование для отладки
    useEffect(() => {
      console.log('🔍 ArtifactsHub Debug:', {
        totalArtifacts: artifacts.length,
        userArtifacts: user?.artifacts.length || 0,
        userArtifactIds: user?.artifactIds || [],
        user: user
      });
    }, [artifacts, user]);

    // Загружаем изображения артефактов
    useEffect(() => {
      const loadArtifactImages = async () => {
        const imagePromises = artifacts.map(async (artifact) => {
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

      if (artifacts.length > 0) {
        loadArtifactImages();
      }
    }, [artifacts]);

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

    const getRarityText = (rarity: ArtifactRarityEnum) => {
      switch (rarity) {
        case ArtifactRarityEnum.LEGENDARY: return "Легендарный";
        case ArtifactRarityEnum.EPIC: return "Эпический";
        case ArtifactRarityEnum.RARE: return "Редкий";
        case ArtifactRarityEnum.UNCOMMON: return "Необычный";
        case ArtifactRarityEnum.COMMON: return "Обычный";
        default: return "Обычный";
      }
    };

    const getRarityStyles = (rarity: ArtifactRarityEnum) => {
      switch (rarity) {
        case ArtifactRarityEnum.LEGENDARY: 
          return { bg: 'rgba(234, 179, 8, 0.2)', text: 'rgb(202, 138, 4)', border: 'rgba(234, 179, 8, 0.3)' }; // yellow
        case ArtifactRarityEnum.EPIC: 
          return { bg: 'rgba(168, 85, 247, 0.2)', text: 'rgb(147, 51, 234)', border: 'rgba(168, 85, 247, 0.3)' }; // purple
        case ArtifactRarityEnum.RARE: 
          return { bg: 'rgba(59, 130, 246, 0.2)', text: 'rgb(37, 99, 235)', border: 'rgba(59, 130, 246, 0.3)' }; // blue
        case ArtifactRarityEnum.UNCOMMON: 
          return { bg: 'rgba(34, 197, 94, 0.2)', text: 'rgb(22, 163, 74)', border: 'rgba(34, 197, 94, 0.3)' }; // green
        case ArtifactRarityEnum.COMMON: 
          return { bg: 'rgba(107, 114, 128, 0.2)', text: 'rgb(75, 85, 99)', border: 'rgba(107, 114, 128, 0.3)' }; // gray
        default: 
          return { bg: 'rgba(107, 114, 128, 0.2)', text: 'rgb(75, 85, 99)', border: 'rgba(107, 114, 128, 0.3)' }; // gray
      }
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-w-0">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3 text-wrap">
              <Gem className="w-6 h-6 text-primary stellar-pulse" />
              Коллекция артефактов
            </h2>
            <p className="text-muted-foreground text-sm md:text-base text-wrap">
              Ваш сундук с легендарными артефактами и звездными достижениями
            </p>
          </div>
          <Button 
            onClick={() => { /* TODO export artifacts */ }}
            className="bg-primary hover:bg-primary-600 text-white h-12 w-full md:w-auto"
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
            const RarityIcon = getRarityIcon(artifact.rarity);
            const hasArtifact = user?.artifactIds.includes(artifact.id) || false;
            const imageUrl = artifactImages[artifact.id];
            const rarityStyles = getRarityStyles(artifact.rarity);
            
            return (
              <Card 
                key={artifact.id} 
                className={`badge-card ${hasArtifact ? 'border-primary/30 stellar-glow' : 'badge-locked'} cursor-pointer`}
                onClick={() => {/* TODO view artifact details */}}
              >
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between min-w-0">
                    <div 
                      className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${
                        hasArtifact ? getRarityColor(artifact.rarity) : 'from-gray-400 to-gray-500'
                      } rounded-lg flex items-center justify-center relative overflow-hidden ${
                        hasArtifact ? 'stellar-pulse' : ''
                      }`}
                    >
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={artifact.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gem className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      )}
                      {hasArtifact && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                          <RarityIcon className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {!hasArtifact && (
                        <div className="absolute inset-0 bg-black/40 rounded-lg" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${hasArtifact ? '' : 'opacity-50'}`}
                      style={{
                        backgroundColor: rarityStyles.bg,
                        color: rarityStyles.text,
                        borderColor: rarityStyles.border
                      }}
                    >
                      <RarityIcon className="w-3 h-3 mr-1" />
                      {getRarityText(artifact.rarity)}
                    </Badge>
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className={`font-semibold text-base leading-tight text-wrap line-clamp-2 ${
                      hasArtifact ? '' : 'text-muted-foreground'
                    }`}>
                      {artifact.title}
                    </h3>
                    <p className={`text-sm mt-1 leading-relaxed text-wrap line-clamp-4 ${
                        hasArtifact ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {artifact.description}
                    </p>
                  </div>
                  
                  {hasArtifact && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Calendar className="w-4 h-4" />
                      <span>Получено 2023-0{Math.floor(Math.random() * 9) + 1}-1{Math.floor(Math.random() * 9) + 1}</span>
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