import { Rocket, Shield, Bell, Settings } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useUserStore } from "../stores/useUserStore";
import { useRankStore } from "../stores/useRankStore";
import { useEffect } from "react";

interface TopAppBarProps {
  onAdminOpen: () => void;
  onNotificationsOpen?: () => void;
  onSettingsOpen?: () => void;
  className?: string;
}

export function TopAppBar({ 
  onAdminOpen,
  onNotificationsOpen,
  onSettingsOpen,
  className = ""
}: TopAppBarProps) {
  const { user } = useUserStore();
  const { ranks, fetchRanks } = useRankStore();

  // Загружаем ранги, если их еще нет
  useEffect(() => {
    if (ranks.length === 0) {
      fetchRanks();
    }
  }, [ranks.length, fetchRanks]);

  // Получаем реальные данные пользователя
  const userMana = user?.mana || 0;
  const currentRank = ranks.find(r => r.id === user?.rankId);
  const userRank = currentRank?.name;

  return (
    <div className={`cosmic-gradient text-white px-4 py-3 md:px-6 md:py-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Rocket className="w-3 h-3 md:w-5 md:h-5" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Алабуга</h1>
              <p className="text-xs text-white/80 hidden sm:block">Коммандный центр талантов</p>
            </div>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile user status */}
            <div className="sm:hidden">
              <div className="flex items-center gap-2">
                {userRank && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {userRank}
                  </Badge>
                )}
                <span className="text-xs font-mono text-cyan-200">{userMana.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Desktop user status */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2">
                {userRank && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {userRank}
                  </Badge>
                )}
                <span className="text-sm">
                  <span className="text-white/80">Мана:</span>{" "}
                  <span className="font-mono text-cyan-200">{userMana.toLocaleString()}</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 p-2"
                onClick={onAdminOpen}
                title="Admin Panel"
              >
                <Shield className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 p-2 relative"
                onClick={onNotificationsOpen}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {/* Notification badge */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 p-2"
                onClick={onSettingsOpen}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
