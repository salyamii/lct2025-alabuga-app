import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Plus, Search, Link2, Target, Zap, Award } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Filter } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Eye, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { CardContent } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { useState } from "react";

interface AdminMissionProps {
  handleCreateMission: () => void;
  handleCreateChain: () => void;
  setSelectedChain: (chain: any) => void;
  setChainCreationOpen: (open: boolean) => void;
}

export function AdminMission({
  handleCreateMission,
  handleCreateChain,
  setSelectedChain,
  setChainCreationOpen,
}: AdminMissionProps) {
  const missions = [
    {
      id: "mission-1",
      title: "Web Development Basics",
      status: "active",
      participants: 500,
      completionRate: 90,
      createdDate: "2024-01-01",
    },
    {
      id: "mission-2",
      title: "Advanced JavaScript",
      status: "completed",
      participants: 300,
      completionRate: 100,
      createdDate: "2023-12-01",
    },
    {
      id: "mission-3",
      title: "Data Structures and Algorithms",
      status: "upcoming",
      participants: 0,
      completionRate: 0,
      createdDate: "2024-06-01",
    },
  ];

  // Mock data for mission chains
  const chains = [
    {
      id: "chain-1",
      title: "React Mastery Journey",
      description:
        "Complete step-by-step progression through React fundamentals to advanced patterns",
      category: "Frontend",
      season: "Delta Constellation",
      isLinear: true,
      autoUnlock: true,
      requiresSequentialCompletion: true,
      status: "active",
      createdDate: "2024-03-01",
      participants: 234,
      completionRate: 82,
      totalMissions: 4,
      currentMissionIndex: 2, // 0-based index
      estimatedTotalDuration: "8 hours",
      completionRewards: {
        xp: 1500,
        mana: 2000,
        artifacts: ["React Master"],
        badges: ["Frontend Specialist"],
      },
      missions: [
        {
          id: "chain-1-mission-1",
          title: "React Fundamentals",
          description: "Learn JSX, components, and props",
          difficulty: "Beginner",
          type: "Individual",
          status: "completed",
          estimatedDuration: "2 hours",
          xpReward: 200,
          manaReward: 300,
        },
        {
          id: "chain-1-mission-2",
          title: "State Management Basics",
          description: "Master useState and useEffect hooks",
          difficulty: "Intermediate",
          type: "Individual",
          status: "completed",
          estimatedDuration: "2 hours",
          xpReward: 300,
          manaReward: 450,
        },
        {
          id: "chain-1-mission-3",
          title: "Component Architecture",
          description: "Build reusable component systems",
          difficulty: "Advanced",
          type: "Group",
          status: "in_progress",
          estimatedDuration: "2 hours",
          xpReward: 400,
          manaReward: 600,
        },
        {
          id: "chain-1-mission-4",
          title: "Advanced React Patterns",
          description:
            "Master context, custom hooks, and performance optimization",
          difficulty: "Expert",
          type: "Individual",
          status: "locked",
          estimatedDuration: "2 hours",
          xpReward: 500,
          manaReward: 750,
        },
      ],
    },
    {
      id: "chain-2",
      title: "Full-Stack Development Path",
      description: "End-to-end web development from frontend to deployment",
      category: "Full-Stack",
      season: "Delta Constellation",
      isLinear: true,
      autoUnlock: false,
      requiresSequentialCompletion: true,
      status: "draft",
      createdDate: "2024-03-05",
      participants: 0,
      completionRate: 0,
      totalMissions: 6,
      currentMissionIndex: 0,
      estimatedTotalDuration: "15 hours",
      completionRewards: {
        xp: 2500,
        mana: 3500,
        artifacts: ["Full-Stack Developer", "System Architect"],
        badges: ["Complete Developer"],
      },
      missions: [
        {
          id: "chain-2-mission-1",
          title: "Frontend Foundations",
          description: "HTML, CSS, and JavaScript essentials",
          difficulty: "Beginner",
          type: "Individual",
          status: "todo",
          estimatedDuration: "3 hours",
          xpReward: 250,
          manaReward: 400,
        },
        {
          id: "chain-2-mission-2",
          title: "React Framework",
          description: "Component-based development",
          difficulty: "Intermediate",
          type: "Individual",
          status: "locked",
          estimatedDuration: "3 hours",
          xpReward: 350,
          manaReward: 500,
        },
        {
          id: "chain-2-mission-3",
          title: "Backend API Development",
          description: "RESTful APIs and database integration",
          difficulty: "Advanced",
          type: "Individual",
          status: "locked",
          estimatedDuration: "3 hours",
          xpReward: 450,
          manaReward: 650,
        },
      ],
    },
    {
      id: "chain-3",
      title: "Leadership Excellence Journey",
      description: "Develop essential leadership and team management skills",
      category: "Leadership",
      season: "Delta Constellation",
      isLinear: false, // Non-linear chain example
      autoUnlock: true,
      requiresSequentialCompletion: false,
      status: "active",
      createdDate: "2024-02-28",
      participants: 89,
      completionRate: 67,
      totalMissions: 3,
      currentMissionIndex: 1,
      estimatedTotalDuration: "6 hours",
      completionRewards: {
        xp: 1200,
        mana: 1600,
        artifacts: ["Leadership Badge"],
        badges: ["Team Leader"],
      },
      missions: [
        {
          id: "chain-3-mission-1",
          title: "Communication Fundamentals",
          description: "Effective team communication strategies",
          difficulty: "Intermediate",
          type: "Group",
          status: "completed",
          estimatedDuration: "2 hours",
          xpReward: 300,
          manaReward: 400,
        },
        {
          id: "chain-3-mission-2",
          title: "Project Management",
          description: "Agile methodologies and team coordination",
          difficulty: "Advanced",
          type: "Group",
          status: "in_progress",
          estimatedDuration: "2 hours",
          xpReward: 400,
          manaReward: 600,
        },
        {
          id: "chain-3-mission-3",
          title: "Mentorship Skills",
          description: "Guide and develop junior team members",
          difficulty: "Expert",
          type: "Event",
          status: "locked",
          estimatedDuration: "2 hours",
          xpReward: 500,
          manaReward: 750,
        },
      ],
    },
  ];

  const [missionsTab, setMissionsTab] = useState("missions");

  return (
    <TabsContent value="missions" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">Управление миссиями</h2>
            <p className="text-sm text-muted-foreground">
              Создание и управление обучающими миссиями
            </p>
          </div>
        </div>

        {/* Mission Tabs */}
        <Card className="card-enhanced">
          <CardHeader>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {[
                { key: "missions", label: "Миссии", icon: Target },
                { key: "chains", label: "Цепочки", icon: Link2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setMissionsTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    missionsTab === key
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
            {missionsTab === "missions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Все миссии</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Поиск миссий..."
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary-600 text-white"
                      onClick={handleCreateMission}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Создать миссию
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{mission.title}</h4>
                          <Badge
                            variant={
                              mission.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {mission.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>{mission.participants} участников</span>
                          <span>{mission.completionRate}% завершено</span>
                          <span>Создано {mission.createdDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {missionsTab === "chains" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Цепи миссий</h3>
                    <p className="text-sm text-muted-foreground">
                      Последовательные пути обучения со связанными миссиями
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Поиск цепей..."
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary-600 text-white"
                      onClick={handleCreateChain}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Создать цепь
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {chains.map((chain) => (
                    <div key={chain.id} className="admin-card p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-info to-soft-cyan rounded-lg flex items-center justify-center">
                            <Link2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-base">
                                  {chain.title}
                                </h4>
                                <Badge
                                  variant={
                                    chain.status === "active"
                                      ? "default"
                                      : chain.status === "draft"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {chain.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {chain.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {chain.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{chain.season}</span>
                                <span>•</span>
                                <span>{chain.totalMissions} миссий</span>
                                <span>•</span>
                                <span>{chain.estimatedTotalDuration}</span>
                                <span>•</span>
                                <span>
                                  {chain.isLinear ? "Линейная" : "Не линейная"}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Участники:
                                </span>
                                <span className="ml-1 font-medium">
                                  {chain.participants.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Завершение:
                                </span>
                                <span className="ml-1 font-medium">
                                  {chain.completionRate}%
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Прогресс:
                                </span>
                                <span className="ml-1 font-medium">
                                  Миссия {chain.currentMissionIndex + 1}/
                                  {chain.totalMissions}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Создано:
                                </span>
                                <span className="ml-1 font-medium">
                                  {chain.createdDate}
                                </span>
                              </div>
                            </div>

                            {/* Chain Configuration Indicators */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {chain.autoUnlock && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-success/10 text-success border-success/20"
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Авто-разблокировка
                                </Badge>
                              )}
                              {chain.requiresSequentialCompletion && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-info/10 text-info border-info/20"
                                >
                                  Последовательная
                                </Badge>
                              )}
                              {chain.isLinear && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-primary/10 text-primary border-primary/20"
                                >
                                  Линейный путь
                                </Badge>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Прогресс цепи</span>
                                <span>
                                  {Math.round(
                                    (chain.currentMissionIndex /
                                      chain.totalMissions) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  (chain.currentMissionIndex /
                                    chain.totalMissions) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedChain(chain);
                              // Could open chain detail view here
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedChain(chain);
                              setChainCreationOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Mission Sequence Preview */}
                      <div className="border-t pt-4">
                        <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Последовательность миссий
                        </h5>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {chain.missions.map((mission, index) => (
                            <div
                              key={mission.id}
                              className="flex items-center gap-2 shrink-0"
                            >
                              <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs min-w-0 ${
                                  mission.status === "completed"
                                    ? "bg-success/10 border-success/20 text-success"
                                    : mission.status === "in_progress"
                                    ? "bg-info/10 border-info/20 text-info"
                                    : mission.status === "locked"
                                    ? "bg-muted border-border text-muted-foreground"
                                    : "bg-background border-border"
                                }`}
                              >
                                <span className="font-medium">{index + 1}</span>
                                <span className="truncate max-w-24">
                                  {mission.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {mission.difficulty[0]}
                                </Badge>
                              </div>
                              {index < chain.missions.length - 1 && (
                                <div className="text-muted-foreground">→</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </TabsContent>
  );
}
