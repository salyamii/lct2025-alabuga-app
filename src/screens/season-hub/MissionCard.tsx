import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Clock, Coins, ChevronRight, MapPin, Users, Star, Shield, Zap, Rocket, CheckCircle, Lock } from "lucide-react";
import { UserMission } from "../../domain";
import { useRankStore } from "../../stores/useRankStore";
import { useEffect } from "react";

interface MissionCardProps {
  mission: UserMission;  // ✅ Теперь UserMission
  seasonName: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  onLaunch: (missionId: number) => void;
  onViewDetails: (missionId: number) => void;
}

export function MissionCard({ mission, seasonName, isCompleted = false, isLocked = false, onLaunch, onViewDetails }: MissionCardProps) {
  const { ranks, fetchRanks } = useRankStore();

  // Загружаем ранги при монтировании
  useEffect(() => {
    if (ranks.length === 0) {
      fetchRanks();
    }
  }, [ranks.length, fetchRanks]);
  // Находим ранг для миссии
  const requiredRank = ranks.find(r => r.id === mission.rankRequirement);
  const requiredRankName = requiredRank?.name || `Ранг ${mission.rankRequirement}`;

  const difficultyColors = {
    1: "bg-green-500/15 text-green-700 border-green-500/20",
    2: "bg-blue-500/15 text-blue-700 border-blue-500/20", 
    3: "bg-purple-500/15 text-purple-700 border-purple-500/20",
    4: "bg-orange-500/15 text-orange-700 border-orange-500/20",
    5: "bg-red-500/15 text-red-700 border-red-500/20"
  };

  const getDifficultyIcon = () => {
    switch (mission.rankRequirement) {
      case 1: return "🛸";
      case 2: return "🚀";
      case 3: return "⭐";
      case 4: return "🌟";
      case 5: return "👑";
      default: return "🚀";
    }
  };

  const isGroupMission = mission.category === "Group";
  const isPairedMission = mission.category === "Paired";

  return (
    <Card className={`group transition-all duration-300 mission-card relative overflow-hidden ${
      isLocked 
        ? 'opacity-60 border-muted bg-muted/5 cursor-not-allowed' 
        : 'hover:elevation-cosmic'
    } ${
      isGroupMission && !isLocked ? 'border-info/30 bg-gradient-to-r from-card to-info/5' : ''
    } ${
      isCompleted ? 'border-success/30 bg-success/5' : ''
    }`}>
      {/* Cosmic accent for group missions */}
      {isGroupMission && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-info/20 to-transparent"></div>
      )}
      
      {/* Special effects for high-tier missions */}
      {(mission.rankRequirement === 4 || mission.rankRequirement === 5) && (
        <div className="absolute inset-0 bg-gradient-to-br from-rewards-amber/5 via-transparent to-primary/5 pointer-events-none"></div>
      )}

      <CardHeader className="pb-4 relative">
            <div className="flex items-start justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <CardTitle className="text-base md:text-lg leading-tight text-foreground">
                {mission.title}
              </CardTitle>
              <div className="flex items-center gap-1 shrink-0">
                {isLocked && (
                  <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-muted">
                    <Lock className="w-3 h-3 mr-1" />
                    Заблокировано
                  </Badge>
                )}
                {isCompleted && (
                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Завершено
                  </Badge>
                )}
                {isPairedMission && !isLocked && (
                  <Badge variant="outline" className="text-xs bg-soft-cyan/10 text-primary border-soft-cyan/30">
                    <Users className="w-3 h-3 mr-1" />
                    Paired
                  </Badge>
                )}
                {isGroupMission && !isLocked && (
                  <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Squad
                  </Badge>
                )}
                {mission.rankRequirement === 1 && !isLocked && (
                  <Badge variant="outline" className="text-xs bg-rewards-amber/10 text-rewards-amber border-rewards-amber/30">
                    <Star className="w-3 h-3 mr-1" />
                    Rating
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs border ${difficultyColors[mission.rankRequirement as keyof typeof difficultyColors]} w-fit`}>
                <span className="mr-1">{getDifficultyIcon()}</span>
                {requiredRankName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {seasonName}
              </Badge>
            </div>
          </div>
          {!isLocked && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails(mission.id)}
              className="opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <p className="text-muted-foreground text-sm leading-relaxed">{mission.description}</p>
        
        {/* Special notices for group missions */}
        {isGroupMission && (
          <div className="p-3 bg-info/5 border border-info/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-info mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-info">Squad Mission</p>
                <p className="text-xs text-muted-foreground">
                  {mission.category === "Group" 
                    ? "Для выполнения необходима команда, выполнить в одиночку невозможно."
                    : "Лучшие награды при выполнении в команде."
                  }
                </p>
                {mission.rankRequirement === 1 && (
                  <p className="text-xs text-rewards-amber">
                    ⭐ Mentor evaluation required upon completion
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {/* <div className="flex flex-wrap gap-1.5">
          {mission.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-primary-200/60 text-primary-600 border-primary-200">
              {tag}
            </Badge>
          ))}
        </div> */}

        {/* Mission Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{mission.tasks.length} заданий</span>
            </div>
            {(
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">Сборочный цех</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4 text-rewards-amber shrink-0" />
              <span className="font-mono font-semibold text-foreground">
                {mission.rewardMana} Мана
                {isGroupMission && <span className="text-info ml-1">+Bonus</span>}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary shrink-0" />
              <span>+{mission.rewardXp} XP</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 gap-3">
          {!isLocked && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(mission.id)}
              className="text-sm text-muted-foreground border-border flex-1 sm:flex-none"
            >
              {mission.tasks.length} шагов • {mission.tasks.length} доказательств
            </Button>
          )}
          {isLocked && (
            <div className="flex items-center gap-2 flex-1 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Требуется ранг: {requiredRankName}</span>
            </div>
          )}
          <Button 
            onClick={() => isCompleted ? onViewDetails(mission.id) : onLaunch(mission.id)}
            size="sm"
            className={`shrink-0 mission-launch-btn ${
              isLocked
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : isCompleted 
                  ? 'bg-success/10 hover:bg-success/20 text-success border border-success/30' 
                  : isGroupMission 
                    ? 'bg-info hover:bg-info/80 text-white' 
                    : 'bg-primary hover:bg-primary-600 text-white'
            }`}
            disabled={isLocked}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Недоступно</span>
                <span className="sm:hidden">Закрыто</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Посмотреть детали</span>
                <span className="sm:hidden">Детали</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {isGroupMission ? 'Присоединиться к команде' : 'Запустить миссию'}
                </span>
                <span className="sm:hidden">
                  {isGroupMission ? 'Присоединиться' : 'Запустить'}
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}