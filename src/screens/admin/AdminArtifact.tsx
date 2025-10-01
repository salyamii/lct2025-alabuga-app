import { Plus, Gem, Search, Filter, HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useEffect, useState } from "react";
import { Artifact } from "../../domain/artifact";
import { mediaService } from "../../api/services/mediaService";

interface AdminArtifactProps {
  handleFetchArtifacts: () => Promise<void>;
  handleCreateArtifact: () => void;
  handleEditArtifact: (artifact: Artifact) => void;
  handleDeleteArtifact: (artifact: Artifact) => void;
  setSelectedArtifact: (artifact: Artifact) => void;
}

export function AdminArtifact({ 
  handleFetchArtifacts,
  handleCreateArtifact, 
  handleEditArtifact, 
  handleDeleteArtifact, 
  setSelectedArtifact 
}: AdminArtifactProps) {
  const { artifacts, isLoading } = useArtifactStore();
  const [imageBlobs, setImageBlobs] = useState<Record<string, string>>({});

  useEffect(() => {
    handleFetchArtifacts();
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageBlobs).forEach(blobUrl => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, [imageBlobs]);

  const loadImageAsBlob = async (imageUrl: string, artifactId: string) => {
    // Если уже загружено, возвращаем существующий blob URL
    if (imageBlobs[artifactId]) {
      return imageBlobs[artifactId];
    }

    try {
      // Загружаем изображение с авторизацией и получаем blob URL
      const blobUrl = await mediaService.loadImageWithAuth(imageUrl);
      
      // Сохраняем blob URL для повторного использования
      setImageBlobs(prev => ({
        ...prev,
        [artifactId]: blobUrl
      }));
      
      return blobUrl;
    } catch (error) {
      // Тихо игнорируем ошибки - показываем fallback иконку
      return null;
    }
  };

  const getImageUrl = (imageUrl: string, artifactId: string) => {
    // Если blob URL уже доступен, используем его
    if (imageBlobs[artifactId]) {
      return imageBlobs[artifactId];
    }
    
    // Если еще не загружено, запускаем загрузку
    if (imageUrl && !imageBlobs[artifactId]) {
      loadImageAsBlob(imageUrl, artifactId);
    }
    
    // Возвращаем оригинальный URL как placeholder до загрузки blob
    return imageUrl;
  };

  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case "common":
        return { label: "Обычный", className: "bg-gray-500 text-white" };
      case "uncommon":
        return { label: "Необычный", className: "bg-green-500 text-white" };
      case "rare":
        return { label: "Редкий", className: "bg-blue-500 text-white" };
      case "epic":
        return { label: "Эпический", className: "bg-purple-500 text-white" };
      case "legendary":
        return { label: "Легендарный", className: "bg-yellow-500 text-white" };
      default:
        return { label: "Неизвестно", className: "bg-gray-500 text-white" };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Все артефакты</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск артефактов..." className="pl-9 w-64" />
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
              <div className="text-muted-foreground">Загрузка артефактов...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {artifacts.map((artifact) => {
                const rarityInfo = getRarityInfo(artifact.rarity);
                return (
                  <div key={artifact.id} className="admin-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                          {artifact.imageUrl ? (
                            <img 
                              src={getImageUrl(artifact.imageUrl, artifact.id.toString())} 
                              alt={artifact.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallbackElement) {
                                  fallbackElement.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full bg-gradient-to-br from-muted to-muted-foreground flex items-center justify-center ${artifact.imageUrl ? 'hidden' : 'flex'}`}
                            style={{ display: artifact.imageUrl ? 'none' : 'flex' }}
                          >
                            <HelpCircle className="w-6 h-6 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">
                                {artifact.title}
                              </h4>
                              <Badge className={`text-xs ${rarityInfo.className} !important`} style={{ backgroundColor: rarityInfo.className.includes('gray') ? '#6b7280' : rarityInfo.className.includes('green') ? '#10b981' : rarityInfo.className.includes('blue') ? '#3b82f6' : rarityInfo.className.includes('purple') ? '#8b5cf6' : '#f59e0b' }}>
                                {rarityInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {artifact.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedArtifact(artifact);
                            handleEditArtifact(artifact);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedArtifact(artifact);
                            handleDeleteArtifact(artifact);
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
              
              {artifacts.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    Артефакты не найдены
                  </div>
                  <Button onClick={handleCreateArtifact}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать первый артефакт
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
