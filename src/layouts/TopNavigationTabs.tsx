import { Rocket, Trophy, User, GraduationCap, TrendingUp, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

interface TopNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function TopNavigationTabs({ 
  activeTab, 
  onTabChange,
  className = ""
}: TopNavigationTabsProps) {
  return (
    <div className={`px-4 md:px-6 pb-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="flex w-full bg-white/10 border-white/20 h-12 gap-1">
            <TabsTrigger 
              value="season" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Сезон</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Прогресс</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mentors" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Ментор-хаб</span>
            </TabsTrigger>
            <TabsTrigger 
              value="store" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Магазин</span>
            </TabsTrigger>
            <TabsTrigger 
              value="badges" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Артефакты</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex-1 min-w-0 flex items-center justify-center gap-2 whitespace-nowrap data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline truncate">Профиль</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
