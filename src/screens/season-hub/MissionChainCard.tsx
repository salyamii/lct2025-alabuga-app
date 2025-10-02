import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { 
  ChevronRight,
  Star,
  Zap,
  Award
} from "lucide-react";
import { MissionChain } from "../../domain";

interface MissionChainCardProps {
  missionChain: MissionChain;
  userMissions: any[] | null;
  onOpenChain: (missionChainId: number) => void;
}

export function MissionChainCard({ missionChain, userMissions, onOpenChain }: MissionChainCardProps) {
  // Вычисляем количество завершенных миссий в цепочке
  const completedMissionsCount = missionChain.missions.filter(mission => {
    const userMission = userMissions?.find(um => um.id === mission.id);
    return userMission?.isCompleted && userMission?.isApproved || false;
  }).length;

  const totalMissionsCount = missionChain.missions.length;
  const progressPercentage = totalMissionsCount > 0 
    ? Math.round((completedMissionsCount / totalMissionsCount) * 100) 
    : 0;

  // Собираем все артефакты-награды из миссий цепочки
  const rewardArtifacts = missionChain.missions.reduce((artifacts, mission) => {
    if (mission.rewardArtifacts && mission.rewardArtifacts.length > 0) {
      return [...artifacts, ...mission.rewardArtifacts];
    }
    return artifacts;
  }, [] as any[]);
  
  const getRuleChipClass = (ruleType: string) => {
    switch (ruleType) {
      case "ALL": return "bg-muted text-muted-foreground";
      case "ANY": return "bg-primary-200 text-primary";
      case "MAND_AND_ANY": return "bg-info/10 text-info border-info/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="card-enhanced">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight text-wrap line-clamp-2">{missionChain.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-xs ${getRuleChipClass("ALL")}`}
              >
                {missionChain.missions.length} миссий
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span>{completedMissionsCount} из {totalMissionsCount} миссий • {progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Rewards */}
        {missionChain.rewardXp && missionChain.rewardMana && (
          <div className="flex items-center gap-2 flex-wrap min-w-0">
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
              {missionChain.rewardXp} XP
            </Badge>
              <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                <Zap className="w-3 h-3 mr-1" />
                {missionChain.rewardMana} Мана
              </Badge>
            {rewardArtifacts.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {rewardArtifacts.length} Артефакт{rewardArtifacts.length === 1 ? '' : rewardArtifacts.length < 5 ? 'а' : 'ов'}
              </Badge>
            )}
          </div>
        )}

        {/* CTA */}
        <Button 
          variant="secondary"
          size="sm" 
          className="w-full"
          onClick={() => onOpenChain(missionChain.id)}
        >
          Открыть цепочку
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}