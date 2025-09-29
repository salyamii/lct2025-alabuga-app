import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Users, Target, BarChart3, Settings, Zap, Award, Star, Calendar, Trophy, BookOpen, TrendingUp } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { TabsContent } from "../../components/ui/tabs";
import { useMissionStore } from "../../stores/useMissionStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useRankStore } from "../../stores/useRankStore";
import { useSkillStore } from "../../stores/useSkillStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const { missions, fetchMissions } = useMissionStore();
  const { seasons, fetchSeasons } = useSeasonStore();
  const { ranks, fetchRanks } = useRankStore();
  const { skills, fetchSkills } = useSkillStore();
  const { competencies, fetchCompetencies } = useCompetencyStore();
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMissions(),
          fetchSeasons(),
          fetchRanks(),
          fetchSkills(),
          fetchCompetencies(),
        ]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchMissions, fetchSeasons, fetchRanks, fetchSkills, fetchCompetencies]);

  // Вычисляем статистику на основе реальных данных
  const dashboardStats = {
    totalUsers: 1247, // Пока оставляем мок, так как нет пользователей в доменной модели
    activeMissions: missions.length,
    completionRate: missions.length > 0 ? Math.round((missions.filter(m => m.tasks.length > 0).length / missions.length) * 100) : 0,
    totalMana: missions.reduce((sum, mission) => sum + mission.rewardMana, 0),
    totalXp: missions.reduce((sum, mission) => sum + mission.rewardXp, 0),
    totalTasks: missions.reduce((sum, mission) => sum + mission.tasks.length, 0),
    totalArtifacts: missions.reduce((sum, mission) => sum + mission.rewardArtifacts.length, 0),
    totalCompetencies: missions.reduce((sum, mission) => sum + mission.rewardCompetencies.length, 0),
    totalSkills: missions.reduce((sum, mission) => sum + mission.rewardSkills.length, 0),
  };

  // Получаем последние миссии для отображения
  const recentMissions = missions.slice(0, 3).map(mission => ({
    id: mission.id,
    title: mission.title,
    description: mission.description,
    rewardXp: mission.rewardXp,
    rewardMana: mission.rewardMana,
    category: mission.category,
    tasksCount: mission.tasks.length,
    artifactsCount: mission.rewardArtifacts.length,
    competenciesCount: mission.rewardCompetencies.length,
    skillsCount: mission.rewardSkills.length,
  }));

  return (
    <TabsContent value="dashboard" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">Панель управления</h2>
            <p className="text-sm text-muted-foreground">
              Обзор статистики и активности платформы
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Всего пользователей
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.activeMissions}
              </div>
              <div className="text-sm text-muted-foreground">
                Активные миссии
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Процент завершения
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalMana.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Всего маны</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalXp.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Всего опыта</div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalTasks}
              </div>
              <div className="text-sm text-muted-foreground">Всего заданий</div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-pink-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalArtifacts + dashboardStats.totalCompetencies + dashboardStats.totalSkills}
              </div>
              <div className="text-sm text-muted-foreground">Всего наград</div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-teal-500" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {seasons.length}
              </div>
              <div className="text-sm text-muted-foreground">Сезонов</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Missions */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Последние миссии</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Загрузка миссий...</div>
              </div>
            ) : recentMissions.length > 0 ? (
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{mission.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {mission.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {mission.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Target className="w-3 h-3" />
                            {mission.tasksCount} заданий
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium text-orange-600">
                          <Award className="w-4 h-4" />
                          {mission.rewardXp} XP
                        </div>
                        <div className="text-xs text-muted-foreground">Опыт</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                          <Zap className="w-4 h-4" />
                          {mission.rewardMana} маны
                        </div>
                        <div className="text-xs text-muted-foreground">Мана</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium text-pink-600">
                          <Trophy className="w-4 h-4" />
                          {mission.artifactsCount + mission.competenciesCount + mission.skillsCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Наград</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Миссии не найдены</div>
              </div>
            )}
          </CardContent>
        </Card>
    </TabsContent>
  );
}
