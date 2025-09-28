import { Award, Rocket, Store, Trophy, User, Users } from "lucide-react";
import { Button } from "../components/ui/button";


interface MobileNavigationBottomBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
  }

  export function MobileNavigationBottomBar({ activeTab, onTabChange, className = "" }: MobileNavigationBottomBarProps) {

    const tabs = [
        { id: "season", label: "Сезон", icon: Rocket },
        { id: "progress", label: "Прогресс", icon: Trophy },
        { id: "store", label: "Магазин", icon: Store },
        { id: "badges", label: "Значки", icon: Award },
        { id: "profile", label: "Профиль", icon: User },
        { id: "mentors", label: "Менторы", icon: Users },
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
              className={`h-full flex-1 px-0 rounded-none flex flex-col items-center justify-center gap-1 ${
                isActive 
                  ? 'text-primary bg-primary/5 border-t-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}