import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Clock, Coins, ChevronRight, MapPin, Users, Star, Shield, Zap, Rocket } from "lucide-react";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    purpose: string;
    tags: string[];
    timeEstimate: string;
    rewards: {
      mana: number;
      xp: number;
    };
    location?: string;
    participants?: number;
    maxParticipants?: number;
    difficulty: "Cadet" | "Navigator" | "Commander" | "Admiral" | "Fleet Admiral";
    isPaired?: boolean;
    isGroupMission?: boolean;
    mentorRatingRequired?: boolean;
    requiresTeam?: boolean;
    steps: number;
    proofs: number;
    episode?: number;
    isLocked?: boolean;
  };
  onLaunch: (missionId: string) => void;
  onViewDetails: (missionId: string) => void;
}

export function MissionCard({ mission, onLaunch, onViewDetails }: MissionCardProps) {
  const difficultyColors = {
    "Cadet": "bg-green-500/15 text-green-700 border-green-500/20",
    "Navigator": "bg-blue-500/15 text-blue-700 border-blue-500/20", 
    "Commander": "bg-purple-500/15 text-purple-700 border-purple-500/20",
    "Admiral": "bg-orange-500/15 text-orange-700 border-orange-500/20",
    "Fleet Admiral": "bg-red-500/15 text-red-700 border-red-500/20"
  };

  const getDifficultyIcon = () => {
    switch (mission.difficulty) {
      case "Cadet": return "🛸";
      case "Navigator": return "🚀";
      case "Commander": return "⭐";
      case "Admiral": return "🌟";
      case "Fleet Admiral": return "👑";
      default: return "🚀";
    }
  };

  return (
    <Card className={`group hover:elevation-cosmic transition-all duration-300 mission-card relative overflow-hidden ${
      mission.isGroupMission ? 'border-info/30 bg-gradient-to-r from-card to-info/5' : ''
    }`}>
      {/* Cosmic accent for group missions */}
      {mission.isGroupMission && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-info/20 to-transparent"></div>
      )}
      
      {/* Special effects for high-tier missions */}
      {(mission.difficulty === "Admiral" || mission.difficulty === "Fleet Admiral") && (
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
                {mission.isPaired && (
                  <Badge variant="outline" className="text-xs bg-soft-cyan/10 text-primary border-soft-cyan/30">
                    <Users className="w-3 h-3 mr-1" />
                    Paired
                  </Badge>
                )}
                {mission.isGroupMission && (
                  <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Squad
                  </Badge>
                )}
                {mission.mentorRatingRequired && (
                  <Badge variant="outline" className="text-xs bg-rewards-amber/10 text-rewards-amber border-rewards-amber/30">
                    <Star className="w-3 h-3 mr-1" />
                    Rating
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs border ${difficultyColors[mission.difficulty]} w-fit`}>
                <span className="mr-1">{getDifficultyIcon()}</span>
                {mission.difficulty}
              </Badge>
              {mission.episode && (
                <Badge variant="secondary" className="text-xs">
                  Episode {mission.episode}
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(mission.id)}
            className="opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        <p className="text-muted-foreground text-sm leading-relaxed">{mission.purpose}</p>
        
        {/* Special notices for group missions */}
        {mission.isGroupMission && (
          <div className="p-3 bg-info/5 border border-info/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-info mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-info">Squad Mission</p>
                <p className="text-xs text-muted-foreground">
                  {mission.requiresTeam 
                    ? "Team coordination required. Mission cannot be completed solo."
                    : "Better rewards when completed with squadmates."
                  }
                </p>
                {mission.mentorRatingRequired && (
                  <p className="text-xs text-rewards-amber">
                    ⭐ Mentor evaluation required upon completion
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {mission.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-primary-200/60 text-primary-600 border-primary-200">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Mission Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{mission.timeEstimate}</span>
            </div>
            {mission.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{mission.location}</span>
              </div>
            )}
            {mission.participants !== undefined && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 shrink-0" />
                <span>
                  {mission.participants}
                  {mission.maxParticipants ? ` / ${mission.maxParticipants}` : ''} pilots
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4 text-rewards-amber shrink-0" />
              <span className="font-mono font-semibold text-foreground">
                {mission.rewards.mana} Mana
                {mission.isGroupMission && <span className="text-info ml-1">+Bonus</span>}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary shrink-0" />
              <span>+{mission.rewards.xp} Flight XP</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(mission.id)}
            className="text-sm text-muted-foreground border-border flex-1 sm:flex-none"
          >
            {mission.steps} Steps • {mission.proofs} Proofs
          </Button>
          <Button 
            onClick={() => onLaunch(mission.id)}
            size="sm"
            className={`shrink-0 mission-launch-btn ${
              mission.isGroupMission 
                ? 'bg-info hover:bg-info/80 text-white' 
                : 'bg-primary hover:bg-primary-600 text-white'
            }`}
            disabled={mission.isLocked}
          >
            <Rocket className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">
              {mission.isGroupMission ? 'Join Squad' : 'Launch Mission'}
            </span>
            <span className="sm:hidden">
              {mission.isGroupMission ? 'Join' : 'Launch'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}