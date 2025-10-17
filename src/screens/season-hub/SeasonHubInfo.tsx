import { Card, CardContent } from "../../components/ui/card";
import { Stars, Calendar, Users, Orbit, Zap, Clock } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

interface CosmicEvent {
  id: string;
  title: string;
  description: string;
  timeLeft: string;
  bonusMultiplier: string;
  participants: number;
  isActive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

interface SeasonHubInfoProps {
  season: {
    id: string;
    name: string;
    timeRemaining: string;
    progress: number;
    totalMissions: number;
    completedMissions: number;
    participants: number;
  };
  cosmicEvents?: CosmicEvent[];
}

export function SeasonHubInfo({ season, cosmicEvents = [] }: SeasonHubInfoProps) {
  return (
    <Card className="cosmic-gradient text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
      <CardContent className="p-4 md:p-6 relative">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Orbit className="w-6 h-6 icon-rotate" />
                </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-wrap">{season.name}</h2>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Stars className="w-8 h-8 md:w-10 md:h-10 text-primary-dark icon-flowing-glow" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="badge-on-gradient text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {season.timeRemaining} осталось
              </Badge>
              <Badge className="badge-on-gradient text-xs">
                <Users className="w-3 h-3 mr-1" />
                {season.participants.toLocaleString()} участников
              </Badge>
            </div>
            <div className="text-white/90 text-right">
              <div className="font-bold text-2xl leading-tight">
                {season.completedMissions}/{season.totalMissions}
              </div>
              <div className="text-xs whitespace-nowrap">Заданий завершено</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Твой Прогресс Сезона</span>
            <span>{season.progress}%</span>
          </div>
          <Progress value={season.progress} className="h-2 bg-white/20" />
        </div>

        {/* Cosmic Events */}
        {cosmicEvents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-rewards-amber icon-glow-pulse" />
              <h3 className="text-sm font-semibold">Активные космические ивенты</h3>
            </div>
            <p className="text-xs text-white/70 mb-3">
              Специальные события с бонусами • Успей принять участие
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {cosmicEvents.map((event) => (
                <Card key={event.id} className="event-card-shimmer relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform" style={{border: 'none'}}>
                  {/* Animated border gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-30 event-card-glow`}
                    style={{
                      borderRadius: 'inherit'
                    }}
                  ></div>
                  {/* Card background */}
                  <div className="absolute inset-[2px] bg-card rounded-lg z-0"></div>
                  {/* Background gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-5`}></div>
                  <CardContent className="p-2 relative z-10">
                    <div className="flex flex-col gap-2">
                      {/* Icon + Title in one line */}
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r ${event.gradient} rounded-md flex items-center justify-center flex-shrink-0`}>
                          <event.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                        </div>
                        <h4 className="font-semibold line-clamp-1 text-left flex-1" style={{ fontSize: '11px' }}>
                          {event.title}
                        </h4>
                      </div>
                      
                      {/* Description */}
                      <p className="text-muted-foreground line-clamp-2 text-left" style={{ fontSize: '9px', lineHeight: '1.4' }}>
                        {event.description}
                      </p>
                      
                      {/* Badges in one row */}
                      <div className="flex items-center gap-1 justify-start flex-wrap">
                        <Badge variant="outline" className="!h-5 !px-1.5 !py-0 border-white/20" style={{ fontSize: '9px' }}>
                          <Clock className="w-2.5 h-2.5 mr-0.5" />
                          {event.timeLeft}
                        </Badge>
                        <Badge className="!h-5 !px-1.5 !py-0 bg-rewards-amber/10 text-rewards-amber border-rewards-amber/20 font-semibold" style={{ fontSize: '9px' }}>
                          {event.bonusMultiplier}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
