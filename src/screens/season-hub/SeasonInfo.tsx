import { Card, CardContent } from "../../components/ui/card";
import { Stars, Target, Calendar, Users, FileText, Orbit } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";

interface SeasonInfoProps {
  season: {
    id: string;
    name: string;
    phase: string;
    description: string;
    timeRemaining: string;
    progress: number;
    totalMissions: number;
    completedMissions: number;
    participants: number;
    rewards: {
      seasonBadge: string;
      finalReward: string;
      bonusMana: number;
    };
  };
  onSkillPathOpen: () => void;
  onSeasonSettings?: () => void;
}

export function SeasonInfo({ 
  season, 
  onSkillPathOpen, 
  onSeasonSettings 
}: SeasonInfoProps) {
  return (
    <Card className="cosmic-gradient text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
      <div className="absolute top-4 right-4 opacity-30">
        <Stars className="w-12 h-12" />
      </div>
      <CardContent className="p-4 md:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Orbit className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{season.name}</h2>
                <p className="text-white/80 text-sm">Сезон {season.phase}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm md:text-base max-w-md">
              {season.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {season.timeRemaining} осталось
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                <Users className="w-3 h-3 mr-1" />
                {season.participants.toLocaleString()} участников
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="text-white/90 text-sm text-center sm:text-right">
              <div className="font-bold text-lg">{season.completedMissions}/{season.totalMissions}</div>
              <div className="text-xs">Заданий завершено</div>
            </div>
            <Button 
              variant="secondary"
              onClick={onSkillPathOpen}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
            >
              <Target className="w-4 h-4 mr-2" />
              Дерево компетенций
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Прогресс сезона</span>
            <span>{season.progress}%</span>
          </div>
          <Progress value={season.progress} className="h-2 bg-white/20" />
        </div>
        {onSeasonSettings && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <Button 
              variant="ghost"
              onClick={onSeasonSettings}
              className="text-white/90 hover:text-white hover:bg-white/10 text-sm w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              Центр управления сезоном
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
