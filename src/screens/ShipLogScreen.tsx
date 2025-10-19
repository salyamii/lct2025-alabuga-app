import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  ArrowLeft, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Award 
} from "lucide-react";

interface ShipLogScreenProps {
    onBack: () => void;
    totalMissions: number;
    completedMissions: number;
  }
  
  export function ShipLogScreen({ onBack, totalMissions, completedMissions }: ShipLogScreenProps) {
    const logEntries = [
      {
        id: "log-1",
        date: "2024-03-15",
        time: "14:30",
        type: "mission_completed",
        title: "Миссия завершена: Погружение в React Hooks",
        description: "Успешно завершена продвинутая миссия по React hooks с полной подачей доказательств.",
        rewards: { mana: 250, xp: 100 },
        status: "success"
      },
      {
        id: "log-2",
        date: "2024-03-14",
        time: "16:45",
        title: "Повышение ранга",
        description: "Повышен до ранга Навигатора после прохождения оценки навыков.",
        type: "rank_up",
        status: "success"
      },
      {
        id: "log-3",
        date: "2024-03-14",
        time: "11:20",
        title: "Миссия начата: Архитектура компонентов",
        description: "Начата продвинутая миссия по архитектуре компонентов в Frontend Lab.",
        type: "mission_started",
        status: "info"
      },
      {
        id: "log-4",
        date: "2024-03-13",
        time: "09:15",
        title: "Прогресс по навыкам",
        description: "Завершено 3/5 уровней в пути навыков Frontend Mastery.",
        type: "skill_progress",
        status: "info"
      },
      {
        id: "log-5",
        date: "2024-03-12",
        time: "15:30",
        title: "Миссия провалена: Оптимизация базы данных",
        description: "Не удалось завершить миссию в отведенное время. Повторная попытка доступна через 24 часа.",
        type: "mission_failed",
        status: "error"
      }
    ];
  
    const stats = {
      totalMissions: totalMissions,
      completedMissions: completedMissions,
      failedMissions: 0, // Всегда 0%
      skippedMissions: 1, // 10% от общего количества миссий
      totalFlightHours: 247,
      totalMana: 8450,
      totalXP: 3200,
      currentStreak: 12
    };
  
    const getStatusIcon = (status: string) => {
      switch (status) {
        case "success":
          return <CheckCircle2 className="w-4 h-4 text-success" />;
        case "error":
          return <XCircle className="w-4 h-4 text-danger" />;
        case "warning":
          return <AlertCircle className="w-4 h-4 text-warning" />;
        default:
          return <Activity className="w-4 h-4 text-info" />;
      }
    };
  
    const getTypeLabel = (type: string) => {
      switch (type) {
        case "mission_completed":
          return "Миссия завершена";
        case "mission_started":
          return "Миссия начата";
        case "mission_failed":
          return "Миссия провалена";
        case "rank_up":
          return "Повышение ранга";
        case "skill_progress":
          return "Прогресс навыков";
        default:
          return "Активность";
      }
    };
  
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold">Журнал корабля</h1>
                  <p className="text-sm text-muted-foreground">Полная запись полетов и история активности</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="activity">Активность</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
            </TabsList>
  
            <TabsContent value="activity" className="space-y-4">
              <Card className="orbital-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Недавняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logEntries.map((entry) => (
                      <div key={entry.id} className="p-3 md:p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors space-y-3">
                        {/* Первая строка: дата, время, статус, бадж */}
                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">{entry.date}</span>
                            <span className="sm:hidden">{entry.date.split('-')[2]}/{entry.date.split('-')[1]}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{entry.time}</span>
                          </div>
                          {getStatusIcon(entry.status)}
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(entry.type)}
                          </Badge>
                        </div>

                        {/* Контент под первой строкой */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm md:text-base">{entry.title}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                          {entry.rewards && (
                            <div className="flex items-center gap-3 md:gap-4 text-xs">
                              <span className="text-rewards-amber font-medium">+{entry.rewards.mana} Mana</span>
                              <span className="text-info font-medium">+{entry.rewards.xp} XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="orbital-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.totalMissions}</div>
                    <div className="text-sm text-muted-foreground">Всего миссий</div>
                  </CardContent>
                </Card>
  
                <Card className="orbital-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.completedMissions}</div>
                    <div className="text-sm text-muted-foreground">Завершено</div>
                  </CardContent>
                </Card>
  
                <Card className="orbital-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-info/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <Clock className="w-6 h-6 text-info" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.totalFlightHours}ч</div>
                    <div className="text-sm text-muted-foreground">Часов полета</div>
                  </CardContent>
                </Card>
  
                <Card className="orbital-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-rewards-amber/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-rewards-amber" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Дней подряд</div>
                  </CardContent>
                </Card>
              </div>
  
              <Card className="orbital-border">
                <CardHeader>
                  <CardTitle>Процент успеха миссий</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Завершено</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${(stats.completedMissions / stats.totalMissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{Math.round((stats.completedMissions / stats.totalMissions) * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Провалено</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-danger h-2 rounded-full" 
                            style={{ width: `${(stats.failedMissions / stats.totalMissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{Math.round((stats.failedMissions / stats.totalMissions) * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Пропущено</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-warning h-2 rounded-full" 
                            style={{ width: `${(stats.skippedMissions / stats.totalMissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono">{Math.round((stats.skippedMissions / stats.totalMissions) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="achievements" className="space-y-4">
              <Card className="orbital-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-rewards-amber" />
                    Недавние достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Навигатор React",
                        description: "Освоил основы React и продвинутые паттерны",
                        date: "2024-03-15",
                        rarity: "Редкое"
                      },
                      {
                        title: "Скорость света",
                        description: "Завершил миссию в рекордное время",
                        date: "2024-03-12",
                        rarity: "Эпическое"
                      },
                      {
                        title: "Пилот-ментор",
                        description: "Успешно наставлял 5 младших разработчиков",
                        date: "2024-03-10",
                        rarity: "Легендарное"
                      },
                      {
                        title: "Серия миссий",
                        description: "Завершил 10 миссий подряд",
                        date: "2024-03-08",
                        rarity: "Обычное"
                      }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                        <div className="w-12 h-12 bg-gradient-to-br from-rewards-amber to-warning rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Получено {achievement.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }