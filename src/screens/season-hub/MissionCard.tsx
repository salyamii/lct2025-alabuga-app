import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, Star, Shield, CheckCircle, Clock } from "lucide-react";
import { Mission, UserMission } from "../../domain";
import { useRankStore } from "../../stores/useRankStore";
import { useEffect } from "react";

interface MissionCardProps {
  mission: Mission;  // Миссия из useMissionStore
  userMission?: UserMission | null; // Миссия пользователя (может быть null)
  seasonName: string;
  isCompleted?: boolean;
  isApproved?: boolean;
  onLaunch: (missionId: number) => void;
  onViewDetails: (missionId: number) => void;
}

export function MissionCard({ mission, userMission, seasonName, isCompleted = false, isApproved = false, onLaunch, onViewDetails }: MissionCardProps) {
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

  const getDifficultyColor = (rankRequirement: number) => {
    const colors = {
      0: "bg-green-500/15 text-green-700 border-green-500/20",
      1: "bg-blue-500/15 text-blue-700 border-blue-500/20", 
      2: "bg-purple-500/15 text-purple-700 border-purple-500/20",
      3: "bg-orange-500/15 text-orange-700 border-orange-500/20",
      4: "bg-red-500/15 text-red-700 border-red-500/20"
    };
    
    // Для рангов 6 и выше используем цвет 5-го ранга
    return colors[Math.min(rankRequirement, 4) as keyof typeof colors] || colors[4];
  };

  const isGroupMission = mission.category === "Group";
  const isPairedMission = mission.category === "Paired";

  return (
    <Card 
      className={`group transition-all duration-300 mission-card relative overflow-hidden hover:elevation-cosmic cursor-pointer ${
        isGroupMission ? 'border-info/30 bg-gradient-to-r from-card to-info/5' : ''
      } ${
        isCompleted ? 'border-success/30 bg-success/5' : ''
      }`}
      onClick={() => onViewDetails(mission.id)}
    >
      {/* Cosmic accent for group missions */}
      {isGroupMission && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-info/20 to-transparent"></div>
      )}
      
      {/* Special effects for high-tier missions */}
      {(mission.rankRequirement === 4 || mission.rankRequirement === 5) && (
        <div className="absolute inset-0 bg-gradient-to-br from-rewards-amber/5 via-transparent to-primary/5 pointer-events-none"></div>
      )}

      <CardHeader className="p-3 pb-3 relative">
        <div className="flex items-start justify-between gap-2 min-w-0">
          {/* Название миссии и баджи */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <CardTitle className="text-base md:text-lg leading-tight text-foreground text-wrap line-clamp-2">
                {mission.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {isCompleted && isApproved && (
                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Завершено
                </Badge>
              )}
              {isCompleted && !isApproved && (
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
                  <Clock className="w-3 h-3 mr-1" />
                  На проверке
                </Badge>
              )}
              {isPairedMission && (
                <Badge variant="outline" className="text-xs bg-soft-cyan/10 text-primary border-soft-cyan/30">
                  <Users className="w-3 h-3 mr-1" />
                  Парная
                </Badge>
              )}
              {isGroupMission && (
                <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Сквад
                </Badge>
              )}
              {mission.rankRequirement === 1 && (
                <Badge variant="outline" className="text-xs bg-rewards-amber/10 text-rewards-amber border-rewards-amber/30">
                  <Star className="w-3 h-3 mr-1" />
                  Рейтинг
                </Badge>
              )}
              <Badge className={`text-xs border ${getDifficultyColor(mission.rankRequirement)} w-fit`}>
                {requiredRankName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {seasonName}
              </Badge>
              <Badge variant="outline" className="text-xs bg-rewards-amber/10 text-rewards-amber border-rewards-amber/20">
                {mission.rewardMana} Мана
              </Badge>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {mission.rewardXp} XP
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}