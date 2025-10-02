import { Card, CardContent } from "../../components/ui/card";
import { Zap, Clock } from "lucide-react";
import { Badge } from "../../components/ui/badge";

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

interface SeasonHubActiveEventsProps {
  cosmicEvents: CosmicEvent[];
}

export function SeasonHubActiveEvents({ cosmicEvents }: SeasonHubActiveEventsProps) {
  if (cosmicEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 min-w-0">
        <Zap className="w-5 h-5 text-rewards-amber" />
        <h3 className="text-lg font-semibold text-wrap">Активные космические ивенты</h3>
        <Badge variant="secondary" className="animate-pulse">Активен</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cosmicEvents.map((event) => (
          <Card key={event.id} className="orbital-border relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-5`}></div>
            <CardContent className="p-4 relative">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${event.gradient} rounded-lg flex items-center justify-center`}>
                  <event.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-wrap">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 text-wrap">{event.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.timeLeft}
                    </Badge>
                    <Badge className="text-xs bg-rewards-amber/10 text-rewards-amber">
                      {event.bonusMultiplier}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
