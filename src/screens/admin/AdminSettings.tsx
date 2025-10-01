import { TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Store, Star, Crown, Target, FileText, Gem, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { AdminCompetency } from "./AdminCompetency";
import { AdminRank } from "./AdminRank";
import { AdminSkill } from "./AdminSkill";
import { AdminTask } from "./AdminTask";
import { AdminArtifact } from "./AdminArtifact";
import { AdminStore } from "./AdminStore";
import { Competency } from "../../domain/competency";
import { Rank } from "../../domain/rank";
import { Skill } from "../../domain/skill";
import { Task } from "../../domain/task";
import { Artifact } from "../../domain/artifact";
import { StoreItem } from "../../domain/store";
import { useState } from "react";

interface AdminSettingsProps {
    handleFetchCompetencies: () => Promise<void>;
    handleFetchRanks: () => Promise<void>;
    handleFetchMissions: () => Promise<void>;
    handleFetchSkills: () => Promise<void>;
    handleFetchTasks: () => Promise<void>;
    handleFetchArtifacts: () => Promise<void>;
    handleFetchStoreItems: () => Promise<void>;
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
    handleCreateTask: () => void;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (task: Task) => void;
    setSelectedTask: (task: Task) => void;
    handleCreateArtifact: () => void;
    handleEditArtifact: (artifact: Artifact) => void;
    handleDeleteArtifact: (artifact: Artifact) => void;
    setSelectedArtifact: (artifact: Artifact) => void;
    handleCreateStoreItem: () => void;
    handleEditStoreItem: (item: StoreItem) => void;
    handleDeleteStoreItem: (item: StoreItem) => void;
    setSelectedStoreItem: (item: StoreItem) => void;
}

export function AdminSettings({ 
    handleFetchCompetencies,
    handleFetchRanks,
    handleFetchMissions,
    handleFetchSkills,
    handleFetchTasks,
    handleFetchArtifacts,
    handleFetchStoreItems,
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
    setSelectedSkill,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
    setSelectedTask,
    handleCreateArtifact,
    handleEditArtifact,
    handleDeleteArtifact,
    setSelectedArtifact,
    handleCreateStoreItem,
    handleEditStoreItem,
    handleDeleteStoreItem,
    setSelectedStoreItem
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
                    { key: "tasks", label: "Задания", icon: FileText },
                    { key: "artifacts", label: "Артефакты", icon: Gem },
                    { key: "store", label: "Магазин", icon: ShoppingBag },
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
                      handleFetchCompetencies={handleFetchCompetencies}
                      handleFetchSkills={handleFetchSkills}
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
                      handleFetchRanks={handleFetchRanks}
                      handleFetchMissions={handleFetchMissions}
                      handleFetchCompetencies={handleFetchCompetencies}
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
                      handleFetchSkills={handleFetchSkills}
                      handleCreateSkill={handleCreateSkill}
                      handleEditSkill={handleEditSkill}
                      handleDeleteSkill={handleDeleteSkill}
                      setSelectedSkill={setSelectedSkill}
                    />
                  </div>
                )}

                {settingsTab === "tasks" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление заданиями</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление заданиями системы
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateTask}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Добавить задание
                      </Button>
                    </div>
                    <AdminTask
                      handleFetchTasks={handleFetchTasks}
                      handleCreateTask={handleCreateTask}
                      handleEditTask={handleEditTask}
                      handleDeleteTask={handleDeleteTask}
                      setSelectedTask={setSelectedTask}
                    />
                  </div>
                )}

                {settingsTab === "artifacts" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление артефактами</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление артефактами системы
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateArtifact}
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        Добавить артефакт
                      </Button>
                    </div>
                    <AdminArtifact
                      handleFetchArtifacts={handleFetchArtifacts}
                      handleCreateArtifact={handleCreateArtifact}
                      handleEditArtifact={handleEditArtifact}
                      handleDeleteArtifact={handleDeleteArtifact}
                      setSelectedArtifact={setSelectedArtifact}
                    />
                  </div>
                )}

                {settingsTab === "store" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Управление магазином</h2>
                        <p className="text-sm text-muted-foreground">
                          Создание, редактирование и управление товарами магазина
                        </p>
                      </div>
                      <Button
                        className="bg-primary hover:bg-primary-600 text-white"
                        onClick={handleCreateStoreItem}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Добавить товар
                      </Button>
                    </div>
                    <AdminStore
                      handleFetchStoreItems={handleFetchStoreItems}
                      handleCreateStoreItem={handleCreateStoreItem}
                      handleEditStoreItem={handleEditStoreItem}
                      handleDeleteStoreItem={handleDeleteStoreItem}
                      setSelectedStoreItem={setSelectedStoreItem}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
        </TabsContent>
    );
}