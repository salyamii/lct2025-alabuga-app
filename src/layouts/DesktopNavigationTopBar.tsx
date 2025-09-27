import { Rocket, Trophy, Store, Award, User, Shield, Bell, Settings, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useIsMobile } from "../components/ui/use-mobile";


interface DesktopNavigationTopBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onAdminOpen: () => void;
    onNotificationsOpen?: () => void;
    onSettingsOpen?: () => void;
    userRank?: string;
    userMana?: number;
    className?: string;
  }

  export function DesktopNavigationTopBar({ 
    activeTab, 
    onTabChange, 
    onAdminOpen,
    onNotificationsOpen,
    onSettingsOpen,
    userRank = "Космический кадет", 
    userMana = 1250,
    className = ""
  }: DesktopNavigationTopBarProps) {

    return (
        <div className={`cosmic-gradient text-white px-4 py-3 md:px-6 md:py-4 ${className}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3 md:mb-4">
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
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      {userRank}
                    </Badge>
                    <span className="text-xs font-mono text-cyan-200">{userMana.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Desktop user status */}
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {userRank}
                    </Badge>
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
    
            {/* Navigation Tabs - Hidden on Mobile */}
            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="flex w-full bg-white/10 border-white/20 h-12 gap-1">
                  <TabsTrigger 
                    value="missions" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <Rocket className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Миссии</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="progress" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Прогресс</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="store" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <Store className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Магазин</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="badges" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Значки</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="profile" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Профиль</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mentors" 
                    className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline truncate">Менторы</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      );
  }