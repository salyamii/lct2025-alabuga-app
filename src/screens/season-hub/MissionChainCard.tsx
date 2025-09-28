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
import { MissionChain } from "../../domain/missionChain";

interface MissionChainCardProps {
  // missionChain: {
  //   id: string;
  //   title: string;
  //   description?: string;
  //   rule: {
  //     type: "ALL" | "ANY" | "MAND_AND_ANY";
  //     display: string;
  //   };
  //   progress: {  
  //     completed: number;
  //     total: number;
  //   };
  //   nextMission?: {
  //     title: string;
  //   } | null;
  //   rewards?: {
  //     xp?: number;
  //     mana?: number;
  //     artifacts?: string[];
  //   };
  // };
  missionChain: MissionChain;
  onOpenChain: (missionChainId: number) => void;
}

export function MissionChainCard({ missionChain: missionChain, onOpenChain: onOpenChain }: MissionChainCardProps) {
  const progressPercentage = Math.round((1 / missionChain.missions.length) * 100);
  
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight">{missionChain.name}</h3>
            <div className="flex items-center gap-2 mt-1">
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
            <span>{1} of {missionChain.missions.length} миссий • {progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Rewards */}
        {missionChain.rewardXp && missionChain.rewardMana && (
          <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
              {missionChain.rewardXp} XP
            </Badge>
              <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                <Zap className="w-3 h-3 mr-1" />
                {missionChain.rewardMana} Мана
              </Badge>
            {(
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                2 Артефакты
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