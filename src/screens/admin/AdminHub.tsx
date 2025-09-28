import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, Target, BarChart3, Settings, Plus, ArrowLeft, Shield, MapPin, Calendar, GitBranch, Link2, Store, Award, Zap } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Eye, Edit, MoreHorizontal, Search, Filter, Star, Trash2 } from "lucide-react";
import { cn } from "../../components/ui/utils";
import { toast } from "sonner";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useMissionStore } from "../../stores/useMissionStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useUserStore } from "../../stores/useUserStore";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { Progress } from "../../components/ui/progress";


interface AdminScreenProps {
    onBack: () => void;
    onUserDetailOpen: (userId: string) => void;
  }
  
  export function AdminScreen({ onBack, onUserDetailOpen }: AdminScreenProps) {
    const [missionCreationOpen, setMissionCreationOpen] = useState(false);
    const [badgeCreationOpen, setBadgeCreationOpen] = useState(false);
    const [rewardCreationOpen, setRewardCreationOpen] = useState(false);
    const [storeManagementOpen, setStoreManagementOpen] = useState(false);
    const [branchCreationOpen, setBranchCreationOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [chainCreationOpen, setChainCreationOpen] = useState(false);
    const [selectedChain, setSelectedChain] = useState<any>(null);
    const [seasonsTab, setSeasonsTab] = useState("overview");
    
    const dashboardStats = {
      totalUsers: 1247,
      activeMissions: 23,
      completionRate: 87.3,
      totalMana: 125420
    };
  
    // Mock data for seasons
    const seasons = [
      {
        id: "season-delta",
        name: "Delta Constellation",
        phase: "Deep Space Operations",
        status: "active",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        participants: 2847,
        totalMissions: 12,
        totalEpisodes: 3,
        totalBranches: 5,
        completionRate: 67
      },
      {
        id: "season-gamma",
        name: "Gamma Nebula",
        phase: "Exploration Phase",
        status: "completed",
        startDate: "2023-10-01",
        endDate: "2024-01-01",
        participants: 3241,
        totalMissions: 15,
        totalEpisodes: 4,
        totalBranches: 7,
        completionRate: 94
      },
      {
        id: "season-epsilon",
        name: "Epsilon Galaxy",
        phase: "Advanced Operations",
        status: "upcoming",
        startDate: "2024-05-01",
        endDate: "2024-08-01",
        participants: 0,
        totalMissions: 18,
        totalEpisodes: 5,
        totalBranches: 8,
        completionRate: 0
      }
    ];
  
    // Mock data for branches
    const branches = [
      {
        id: "branch-1",
        title: "Frontend Development Path",
        description: "Complete frontend development skills from basics to advanced",
        category: "Frontend",
        rule: {
          type: "MAND_AND_ANY" as const,
          display: "MAND 2 + ANY 1",
          mandatoryCount: 2,
          anyCount: 1
        },
        progress: {
          completed: 3,
          total: 5
        },
        status: "active",
        season: "Delta Constellation",
        createdDate: "2024-03-01",
        participants: 147,
        completionRate: 78,
        rewards: {
          xp: 800,
          mana: 1200,
          artifacts: ["Frontend Expert", "UI Master"]
        }
      },
      {
        id: "branch-2",
        title: "Backend Infrastructure",
        description: "Build robust backend systems and APIs",
        category: "Backend",
        rule: {
          type: "ALL" as const,
          display: "ALL",
          mandatoryCount: 0,
          anyCount: 0
        },
        progress: {
          completed: 2,
          total: 4
        },
        status: "active",
        season: "Delta Constellation",
        createdDate: "2024-02-28",
        participants: 93,
        completionRate: 65,
        rewards: {
          xp: 1000,
          mana: 1500,
          artifacts: ["Backend Architect"]
        }
      },
      {
        id: "branch-3",
        title: "DevOps & Deployment",
        description: "Master deployment pipelines and infrastructure",
        category: "DevOps",
        rule: {
          type: "ANY" as const,
          display: "ANY 3",
          mandatoryCount: 0,
          anyCount: 3
        },
        progress: {
          completed: 1,
          total: 6
        },
        status: "draft",
        season: "Delta Constellation",
        createdDate: "2024-03-05",
        participants: 0,
        completionRate: 0,
        rewards: {
          xp: 1200,
          mana: 1800,
          artifacts: ["DevOps Engineer", "Cloud Specialist", "Pipeline Master"]
        }
      }
    ];
  
    // Mock data for mission chains
    const chains = [
      {
        id: "chain-1",
        title: "React Mastery Journey",
        description: "Complete step-by-step progression through React fundamentals to advanced patterns",
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
          badges: ["Frontend Specialist"]
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
            manaReward: 300
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
            manaReward: 450
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
            manaReward: 600
          },
          {
            id: "chain-1-mission-4",
            title: "Advanced React Patterns",
            description: "Master context, custom hooks, and performance optimization",
            difficulty: "Expert",
            type: "Individual",
            status: "locked",
            estimatedDuration: "2 hours",
            xpReward: 500,
            manaReward: 750
          }
        ]
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
          badges: ["Complete Developer"]
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
            manaReward: 400
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
            manaReward: 500
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
            manaReward: 650
          }
        ]
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
          badges: ["Team Leader"]
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
            manaReward: 400
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
            manaReward: 600
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
            manaReward: 750
          }
        ]
      }
    ];
  
    const handleCreateMission = () => {
      setMissionCreationOpen(true);
    };
  
    const handleCreateReward = () => {
      setRewardCreationOpen(true);
    };
  
    const handleCreateBadge = () => {
      setBadgeCreationOpen(true);
    };
  
    const handleManageStore = () => {
      setStoreManagementOpen(true);
    };
  
    const handleCreateBranch = () => {
      setBranchCreationOpen(true);
    };
  
    const handleCreateChain = () => {
      setChainCreationOpen(true);
    };
  
    const recentUsers = [
      {
        id: "user-1",
        name: "Alex Morgan",
        email: "alex.morgan@company.com",
        rank: "Navigator",
        joinDate: "2024-03-10",
        lastActive: "2 hours ago",
        status: "active"
      },
      {
        id: "user-2",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        rank: "Commander",
        joinDate: "2024-02-15",
        lastActive: "1 day ago",
        status: "active"
      },
      {
        id: "user-3",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        rank: "Cadet",
        joinDate: "2024-03-12",
        lastActive: "3 days ago",
        status: "inactive"
      }
    ];
  
    const missions = [
      {
        id: "mission-1",
        title: "Web Development Basics",
        status: "active",
        participants: 500,
        completionRate: 90,
        createdDate: "2024-01-01"
      },
      {
        id: "mission-2",
        title: "Advanced JavaScript",
        status: "completed",
        participants: 300,
        completionRate: 100,
        createdDate: "2023-12-01"
      },
      {
        id: "mission-3",
        title: "Data Structures and Algorithms",
        status: "upcoming",
        participants: 0,
        completionRate: 0,
        createdDate: "2024-06-01"
      }
    ];
  
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
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
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold">Панель администратора</h1>
                  <p className="text-sm text-muted-foreground">Управление миссиями, пользователями и настройками платформы</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="dashboard">Панель управления</TabsTrigger>
              <TabsTrigger value="missions">Миссии</TabsTrigger>
              <TabsTrigger value="seasons">Сезоны</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
  
            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-enhanced">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{dashboardStats.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Всего пользователей</div>
                  </CardContent>
                </Card>
  
                <Card className="card-enhanced">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-info/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <Target className="w-6 h-6 text-info" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{dashboardStats.activeMissions}</div>
                    <div className="text-sm text-muted-foreground">Активные миссии</div>
                  </CardContent>
                </Card>
  
                <Card className="card-enhanced">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <BarChart3 className="w-6 h-6 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{dashboardStats.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Процент завершения</div>
                  </CardContent>
                </Card>
  
                <Card className="card-enhanced">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-rewards-amber/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                      <Settings className="w-6 h-6 text-rewards-amber" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{dashboardStats.totalMana.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Всего маны</div>
                  </CardContent>
                </Card>
              </div>
  
              {/* Recent Activity */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Последняя активность пользователей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            {user.rank}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                          <Badge 
                            variant={user.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="missions" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Управление миссиями</h2>
                  <p className="text-sm text-muted-foreground">Создание и управление обучающими миссиями</p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-white" onClick={handleCreateMission}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать миссию
                </Button>
              </div>
  
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Все миссии</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Поиск миссий..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Фильтр
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {missions.map((mission) => (
                      <div key={mission.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{mission.title}</h4>
                            <Badge 
                              variant={mission.status === "active" ? "default" : "secondary"}
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
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="seasons" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Управление сезонами</h2>
                  <p className="text-sm text-muted-foreground">Управление сезонами, эпизодами и ветвями миссий</p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить сезон
                </Button>
              </div>
  
              {/* Season Tabs */}
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    {[
                      { key: "overview", label: "Обзор", icon: MapPin },
                      { key: "episodes", label: "Эпизоды", icon: Calendar },
                      { key: "branches", label: "Ветви", icon: GitBranch },
                      { key: "chains", label: "Цепи", icon: Link2 }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setSeasonsTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          seasonsTab === key 
                            ? 'bg-background text-foreground shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  {seasonsTab === "overview" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Все сезоны</h3>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Поиск сезонов..." className="pl-9 w-64" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Фильтр
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {seasons.map((season) => (
                          <div key={season.id} className="admin-card p-4 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                                  <Star className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <h4 className="font-semibold text-base">{season.name}</h4>
                                    <p className="text-sm text-muted-foreground">{season.phase}</p>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Участники:</span>
                                      <span className="ml-1 font-medium">{season.participants.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Эпизоды:</span>
                                      <span className="ml-1 font-medium">{season.totalEpisodes}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Ветви:</span>
                                      <span className="ml-1 font-medium">{season.totalBranches}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Завершение:</span>
                                      <span className="ml-1 font-medium">{season.completionRate}%</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={season.status === "active" ? "default" : season.status === "completed" ? "secondary" : "outline"}
                                      className="text-xs"
                                    >
                                      {season.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {season.startDate} - {season.endDate}
                                    </span>
                                  </div>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {seasonsTab === "episodes" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Эпизоды сезона</h3>
                        <Button className="bg-primary hover:bg-primary-600 text-white" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить эпизод
                        </Button>
                      </div>
                      
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p>Управление эпизодами скоро будет доступно</p>
                        <p className="text-xs">Создание и организация эпизодов миссий в рамках сезонов</p>
                      </div>
                    </div>
                  )}
  
                  {seasonsTab === "branches" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Ветви миссий</h3>
                        <Button 
                          className="bg-primary hover:bg-primary-600 text-white" 
                          size="sm"
                          onClick={handleCreateBranch}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Создать ветвь
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Поиск ветвей..." className="pl-9 w-64" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все статусы</SelectItem>
                            <SelectItem value="active">Активные</SelectItem>
                            <SelectItem value="draft">Черновики</SelectItem>
                            <SelectItem value="archived">Архивные</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все категории</SelectItem>
                            <SelectItem value="frontend">Frontend</SelectItem>
                            <SelectItem value="backend">Backend</SelectItem>
                            <SelectItem value="devops">DevOps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        {branches.map((branch) => {
                          const getRuleChipClass = (ruleType: string) => {
                            switch (ruleType) {
                              case "ALL": return "bg-muted text-muted-foreground";
                              case "ANY": return "bg-primary-200 text-primary";
                              case "MAND_AND_ANY": return "bg-info/10 text-info border-info/20";
                              default: return "bg-muted text-muted-foreground";
                            }
                          };
  
                          const progressPercentage = Math.round((branch.progress.completed / branch.progress.total) * 100);
  
                          return (
                            <div key={branch.id} className="admin-card p-4 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                                    <GitBranch className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="space-y-3 flex-1">
                                    <div>
                                      <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-semibold text-base">{branch.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${getRuleChipClass(branch.rule.type)}`}
                                        >
                                          {branch.rule.display}
                                        </Badge>
                                        <Badge 
                                          variant={branch.status === "active" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {branch.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{branch.description}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Категория:</span>
                                        <span className="ml-1 font-medium">{branch.category}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Участники:</span>
                                        <span className="ml-1 font-medium">{branch.participants}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Успешность:</span>
                                        <span className="ml-1 font-medium">{branch.completionRate}%</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Создано:</span>
                                        <span className="ml-1 font-medium">{branch.createdDate}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Прогресс миссий</span>
                                        <span>{branch.progress.completed} из {branch.progress.total} миссий • {progressPercentage}%</span>
                                      </div>
                                      <Progress value={progressPercentage} className="h-2" />
                                    </div>
                                    
                                    {branch.rewards && (
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {branch.rewards.xp && (
                                          <Badge variant="outline" className="text-xs">
                                            <Star className="w-3 h-3 mr-1" />
                                            {branch.rewards.xp} XP
                                          </Badge>
                                        )}
                                        {branch.rewards.mana && (
                                          <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                                            <Zap className="w-3 h-3 mr-1" />
                                            {branch.rewards.mana} Mana
                                          </Badge>
                                        )}
                                        {branch.rewards.artifacts && branch.rewards.artifacts.length > 0 && (
                                          <Badge variant="outline" className="text-xs">
                                            <Award className="w-3 h-3 mr-1" />
                                            {branch.rewards.artifacts.length} Артефактов
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedBranch(branch);
                                      setBranchCreationOpen(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
  
                  {seasonsTab === "chains" && (
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
                            <Input placeholder="Поиск цепей..." className="pl-9 w-64" />
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
                                      <h4 className="font-semibold text-base">{chain.title}</h4>
                                      <Badge 
                                        variant={chain.status === "active" ? "default" : chain.status === "draft" ? "outline" : "secondary"}
                                        className="text-xs"
                                      >
                                        {chain.status}
                                      </Badge>
                                      <Badge 
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {chain.category}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{chain.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span>{chain.season}</span>
                                      <span>•</span>
                                      <span>{chain.totalMissions} миссий</span>
                                      <span>•</span>
                                      <span>{chain.estimatedTotalDuration}</span>
                                      <span>•</span>
                                      <span>{chain.isLinear ? "Линейная" : "Не линейная"}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Участники:</span>
                                      <span className="ml-1 font-medium">{chain.participants.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Завершение:</span>
                                      <span className="ml-1 font-medium">{chain.completionRate}%</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Прогресс:</span>
                                      <span className="ml-1 font-medium">
                                        Миссия {(chain.currentMissionIndex + 1)}/{chain.totalMissions}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Создано:</span>
                                      <span className="ml-1 font-medium">{chain.createdDate}</span>
                                    </div>
                                  </div>
  
                                  {/* Chain Configuration Indicators */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {chain.autoUnlock && (
                                      <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                                        <Zap className="w-3 h-3 mr-1" />
                                        Авто-разблокировка
                                      </Badge>
                                    )}
                                    {chain.requiresSequentialCompletion && (
                                      <Badge variant="secondary" className="text-xs bg-info/10 text-info border-info/20">
                                        Последовательная
                                      </Badge>
                                    )}
                                    {chain.isLinear && (
                                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                        Линейный путь
                                      </Badge>
                                    )}
                                  </div>
  
                                  {/* Progress Bar */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>Прогресс цепи</span>
                                      <span>{Math.round((chain.currentMissionIndex / chain.totalMissions) * 100)}%</span>
                                    </div>
                                    <Progress 
                                      value={(chain.currentMissionIndex / chain.totalMissions) * 100} 
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
                                  <div key={mission.id} className="flex items-center gap-2 shrink-0">
                                    <div 
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs min-w-0 ${
                                        mission.status === 'completed' 
                                          ? 'bg-success/10 border-success/20 text-success' 
                                          : mission.status === 'in_progress'
                                          ? 'bg-info/10 border-info/20 text-info'
                                          : mission.status === 'locked'
                                          ? 'bg-muted border-border text-muted-foreground'
                                          : 'bg-background border-border'
                                      }`}
                                    >
                                      <span className="font-medium">{index + 1}</span>
                                      <span className="truncate max-w-24">{mission.title}</span>
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs px-1 py-0"
                                      >
                                        {mission.difficulty[0]}
                                      </Badge>
                                    </div>
                                    {index < chain.missions.length - 1 && (
                                      <div className="text-muted-foreground">
                                        →
                                      </div>
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
  
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Управление пользователями</h2>
                  <p className="text-sm text-muted-foreground">Управление учетными записями и правами пользователей</p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>
  
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Все пользователи</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Поиск пользователей..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Фильтр
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Присоединился {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            {user.rank}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onUserDetailOpen(user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Настройки платформы</h2>
                <p className="text-sm text-muted-foreground">Настройка системных предпочтений и политик</p>
              </div>
  
              {/* Management Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button onClick={handleCreateReward} className="h-20 bg-rewards-amber hover:bg-rewards-amber/90 text-white flex-col">
                  <Store className="w-6 h-6 mb-2" />
                  Создать награду
                </Button>
                <Button onClick={handleCreateBadge} className="h-20 bg-info hover:bg-info/90 text-white flex-col">
                  <Award className="w-6 h-6 mb-2" />
                  Создать значок
                </Button>
                <Button onClick={handleManageStore} className="h-20 bg-primary hover:bg-primary-600 text-white flex-col">
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
                        <p className="text-sm text-muted-foreground">Разрешить регистрацию новых пользователей</p>
                      </div>
                      <Button variant="outline" size="sm">Включено</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Авто-одобрение миссий</h4>
                        <p className="text-sm text-muted-foreground">Автоматически одобрять отправленные миссии</p>
                      </div>
                      <Button variant="outline" size="sm">Отключено</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Система уведомлений</h4>
                        <p className="text-sm text-muted-foreground">Отправлять уведомления пользователям</p>
                      </div>
                      <Button variant="outline" size="sm">Включено</Button>
                    </div>
                  </CardContent>
                </Card>
  
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Метрики платформы</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ежедневные активные пользователи</span>
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
                      <Badge variant="default" className="text-xs bg-success text-white">Здоровая</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
  
        {/* Drawers */}
        <MissionCreationDrawer 
          open={missionCreationOpen}
          onOpenChange={setMissionCreationOpen}
        />
        
        <BadgeCreationDrawer 
          open={badgeCreationOpen}
          onOpenChange={setBadgeCreationOpen}
        />
        
        <RewardCreationDrawer 
          open={rewardCreationOpen}
          onOpenChange={setRewardCreationOpen}
        />
        
        <StoreManagementDrawer 
          open={storeManagementOpen}
          onOpenChange={setStoreManagementOpen}
        />
        
        <BranchCreationDrawer 
          open={branchCreationOpen}
          onOpenChange={(open) => {
            setBranchCreationOpen(open);
            if (!open) {
              setSelectedBranch(null);
            }
          }}
          editBranch={selectedBranch}
        />
        
        <MissionChainCreationDrawer 
          open={chainCreationOpen}
          onOpenChange={(open) => {
            setChainCreationOpen(open);
            if (!open) {
              setSelectedChain(null);
            }
          }}
          editChain={selectedChain}
        />
      </div>
    );
  }

// Заглушки для компонентов Drawer
const MissionCreationDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => null;
const BadgeCreationDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => null;
const RewardCreationDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => null;
const StoreManagementDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => null;
const BranchCreationDrawer = ({ open, onOpenChange, editBranch }: { open: boolean; onOpenChange: (open: boolean) => void; editBranch?: any }) => null;
const MissionChainCreationDrawer = ({ open, onOpenChange, editChain }: { open: boolean; onOpenChange: (open: boolean) => void; editChain?: any }) => null;