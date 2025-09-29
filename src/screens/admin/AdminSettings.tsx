import { TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Store, Zap, Award, BarChart3, Star, Crown, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { AdminCompetency } from "./AdminCompetency";
import { AdminRank } from "./AdminRank";
import { AdminSkill } from "./AdminSkill";
import { Competency } from "../../domain/competency";
import { Rank } from "../../domain/rank";
import { Skill } from "../../domain/skill";
import { useState } from "react";

interface AdminSettingsProps {
    handleCreateReward: () => void;
    handleCreateBadge: () => void;
    handleManageStore: () => void;
    handleCreateCompetency: () => void;
    handleEditCompetency: (competency: Competency) => void;
    handleDeleteCompetency: (competency: Competency) => void;
    setSelectedCompetency: (competency: Competency) => void;
    handleCreateRank: () => void;
    handleEditRank: (rank: Rank) => void;
    handleDeleteRank: (rank: Rank) => void;
    setSelectedRank: (rank: Rank) => void;
    handleCreateSkill: () => void;
    handleEditSkill: (skill: Skill) => void;
    handleDeleteSkill: (skill: Skill) => void;
    setSelectedSkill: (skill: Skill) => void;
}

export function AdminSettings({ 
    handleCreateReward, 
    handleCreateBadge, 
    handleManageStore,
    handleCreateCompetency,
    handleEditCompetency,
    handleDeleteCompetency,
    setSelectedCompetency,
    handleCreateRank,
    handleEditRank,
    handleDeleteRank,
    setSelectedRank,
    handleCreateSkill,
    handleEditSkill,
    handleDeleteSkill,
    setSelectedSkill
}: AdminSettingsProps) {
    const [settingsTab, setSettingsTab] = useState("platform");

    return (
        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
                  <h2 className="text-lg font-semibold">Настройки платформы</h2>
                  <p className="text-sm text-muted-foreground">
                    Настройка системных предпочтений, политик, компетенций, рангов и навыков
                  </p>
                </div>
              </div>

            {/* Settings Tabs */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  {[
                    { key: "platform", label: "Платформа", icon: Store },
                    { key: "competencies", label: "Компетенции", icon: Star },
                    { key: "ranks", label: "Ранги", icon: Crown },
                    { key: "skills", label: "Навыки", icon: Target },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSettingsTab(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        settingsTab === key
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {settingsTab === "platform" && (
                  <div className="space-y-6">

            {/* Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={handleCreateReward}
                className="h-20 bg-rewards-amber hover:bg-rewards-amber/90 text-white flex-col"
              >
                <Store className="w-6 h-6 mb-2" />
                Создать награду
              </Button>
              <Button
                onClick={handleCreateBadge}
                className="h-20 bg-info hover:bg-info/90 text-white flex-col"
              >
                <Award className="w-6 h-6 mb-2" />
                Создать значок
              </Button>
              <Button
                onClick={handleManageStore}
                className="h-20 bg-primary hover:bg-primary-600 text-white flex-col"
              >
                <Zap className="w-6 h-6 mb-2" />
                Управление магазином
              </Button>
              <Button className="h-20 bg-success hover:bg-success/90 text-white flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Аналитика
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Общие настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Регистрация пользователей</h4>
                      <p className="text-sm text-muted-foreground">
                        Разрешить регистрацию новых пользователей
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Включено
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Авто-одобрение миссий</h4>
                      <p className="text-sm text-muted-foreground">
                        Автоматически одобрять отправленные миссии
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Отключено
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Система уведомлений</h4>
                      <p className="text-sm text-muted-foreground">
                        Отправлять уведомления пользователям
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Включено
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Метрики платформы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Ежедневные активные пользователи
                    </span>
                    <span className="font-mono text-sm">847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Миссии завершены сегодня</span>
                    <span className="font-mono text-sm">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Среднее время сессии</span>
                    <span className="font-mono text-sm">24м</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Состояние системы</span>
                    <Badge
                      variant="default"
                      className="text-xs bg-success text-white"
                    >
                      Здоровая
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
                  </div>
                )}

                {settingsTab === "competencies" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление компетенциями</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление компетенциями системы
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateCompetency}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Добавить компетенцию
                      </Button>
                    </div>
                    <AdminCompetency
                      handleCreateCompetency={handleCreateCompetency}
                      handleEditCompetency={handleEditCompetency}
                      handleDeleteCompetency={handleDeleteCompetency}
                      setSelectedCompetency={setSelectedCompetency}
                    />
                  </div>
                )}

                {settingsTab === "ranks" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление рангами</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление рангами системы
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateRank}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Добавить ранг
                      </Button>
                    </div>
                    <AdminRank
                      handleCreateRank={handleCreateRank}
                      handleEditRank={handleEditRank}
                      handleDeleteRank={handleDeleteRank}
                      setSelectedRank={setSelectedRank}
                    />
                  </div>
                )}

                {settingsTab === "skills" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление навыками</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление навыками системы
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateSkill}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Добавить навык
                      </Button>
                    </div>
                    <AdminSkill
                      handleCreateSkill={handleCreateSkill}
                      handleEditSkill={handleEditSkill}
                      handleDeleteSkill={handleDeleteSkill}
                      setSelectedSkill={setSelectedSkill}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
        </TabsContent>
    );
}