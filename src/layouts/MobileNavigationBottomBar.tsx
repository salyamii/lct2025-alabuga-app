import { Rocket, Trophy, User, GraduationCap, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";


interface MobileNavigationBottomBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
  }

  export function MobileNavigationBottomBar({ activeTab, onTabChange, className = "" }: MobileNavigationBottomBarProps) {

    const tabs = [
        { id: "season", label: "Сезон", icon: Rocket },
        { id: "progress", label: "Прогресс", icon: TrendingUp },
        { id: "mentors", label: "Ментор-хаб", icon: GraduationCap },
        { id: "store", label: "Магазин", icon: ShoppingBag },
        { id: "badges", label: "Артефакты", icon: Trophy },
        { id: "profile", label: "Профиль", icon: User },
      ];


      
    return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 ${className}`}>
      <div className="flex h-16 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`h-full flex-1 px-0 rounded-none flex items-center justify-center ${
                isActive 
                  ? 'text-primary bg-primary/5 border-t-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={tab.label}
            >
              <Icon className="w-6 h-6" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}