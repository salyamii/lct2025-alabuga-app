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

interface MissionChainCardProps {
  branch: {
    id: string;
    title: string;
    description?: string;
    rule: {
      type: "ALL" | "ANY" | "MAND_AND_ANY";
      display: string;
    };
    progress: {
      completed: number;
      total: number;
    };
    nextMission?: {
      title: string;
    } | null;
    rewards?: {
      xp?: number;
      mana?: number;
      artifacts?: string[];
    };
  };
  onOpenBranch: (branchId: string) => void;
}

export function MissionChainCard({ branch, onOpenBranch }: MissionChainCardProps) {
  const progressPercentage = Math.round((branch.progress.completed / branch.progress.total) * 100);
  
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
            <h3 className="font-semibold text-base leading-tight">{branch.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${getRuleChipClass(branch.rule.type)}`}
              >
                {branch.rule.display}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span>{branch.progress.completed} of {branch.progress.total} missions • {progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Next Mission */}
        {branch.nextMission && (
          <div className="text-sm">
            <span className="text-muted-foreground">Следующее задание: </span>
            <span className="font-medium">{branch.nextMission.title}</span>
          </div>
        )}

        {/* Rewards */}
        {branch.rewards && (
          <div className="flex items-center gap-2 flex-wrap">
            {branch.rewards.xp && (
              <Badge variant="outline" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {branch.rewards.xp} XP
              </Badge>
            )}
            {branch.rewards.mana && (
              <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                <Zap className="w-3 h-3 mr-1" />
                {branch.rewards.mana} Мана
              </Badge>
            )}
            {branch.rewards.artifacts && branch.rewards.artifacts.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {branch.rewards.artifacts.length} Артефакты
              </Badge>
            )}
          </div>
        )}

        {/* CTA */}
        <Button 
          variant="secondary"
          size="sm" 
          className="w-full"
          onClick={() => onOpenBranch(branch.id)}
        >
          Открыть цепочку
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}