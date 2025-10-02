import { useState } from "react";
import { Lightbulb, MessageSquare, Users, BookOpen, Palette, Target, Shield, Briefcase, BarChart3, Trophy, Zap, Award, TrendingUp, Flame, Calendar, TreePine, ChevronRight, Play, ArrowUp, Code, Star, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";


interface ProgressHubProps {
    onMissionDetails: (missionId: string) => void;
    onSkillPathOpen?: () => void;
  }
  
  // Career Paths - Professional tracks with subskills
  const careerTracks = {
    "Technical": {
      name: "Техническое развитие",
      description: "Разработка программного обеспечения и технические навыки",
      subskills: [
        {
          id: "html-css",
          name: "HTML & CSS",
          currentLevel: 5,
          maxLevel: 7,
          completions: 12,
          lastActivity: "2024-03-15",
          squadronPercentile: 85,
          personalProgress: "+15%",
          recommendedMissions: [
            { id: "html-1", title: "Advanced CSS Grid Mastery", xp: 200, mana: 300, artifacts: ["CSS Expert"] },
            { id: "html-2", title: "Responsive Design Patterns", xp: 250, mana: 400, artifacts: ["Responsive Master"] },
            { id: "html-3", title: "CSS Animation Workshop", xp: 180, mana: 250, artifacts: ["Animation Specialist"] }
          ]
        },
        {
          id: "javascript-ts",
          name: "JavaScript & TypeScript",
          currentLevel: 4,
          maxLevel: 7,
          completions: 8,
          lastActivity: "2024-03-14",
          squadronPercentile: 72,
          personalProgress: "+8%",
          recommendedMissions: [
            { id: "js-1", title: "Advanced TypeScript Patterns", xp: 300, mana: 450, artifacts: ["TS Master"] },
            { id: "js-2", title: "Async Programming Mastery", xp: 350, mana: 500, artifacts: ["Async Expert"] },
            { id: "js-3", title: "Performance Optimization", xp: 400, mana: 600, artifacts: ["Performance Pro"] }
          ]
        },
        {
          id: "react",
          name: "React Development",
          currentLevel: 6,
          maxLevel: 7,
          completions: 15,
          lastActivity: "2024-03-16",
          squadronPercentile: 92,
          personalProgress: "+23%",
          recommendedMissions: [
            { id: "react-1", title: "React Server Components", xp: 400, mana: 600, artifacts: ["RSC Expert"] },
            { id: "react-2", title: "Advanced State Management", xp: 350, mana: 500, artifacts: ["State Master"] },
            { id: "react-3", title: "React Performance Optimization", xp: 450, mana: 700, artifacts: ["React Pro"] }
          ]
        },
        {
          id: "node-backend",
          name: "Node.js & Backend",
          currentLevel: 3,
          maxLevel: 7,
          completions: 6,
          lastActivity: "2024-03-10",
          squadronPercentile: 65,
          personalProgress: "+5%",
          recommendedMissions: [
            { id: "node-1", title: "REST API Design Mastery", xp: 300, mana: 400, artifacts: ["API Architect"] },
            { id: "node-2", title: "Database Integration Pro", xp: 350, mana: 500, artifacts: ["DB Master"] },
            { id: "node-3", title: "Microservices Architecture", xp: 400, mana: 600, artifacts: ["Microservices Pro"] }
          ]
        },
        {
          id: "devops-docker",
          name: "DevOps & Docker",
          currentLevel: 2,
          maxLevel: 7,
          completions: 3,
          lastActivity: "2024-03-08",
          squadronPercentile: 45,
          personalProgress: "+2%",
          recommendedMissions: [
            { id: "devops-1", title: "Docker Containerization Basics", xp: 250, mana: 350, artifacts: ["Docker Starter"] },
            { id: "devops-2", title: "CI/CD Pipeline Setup", xp: 300, mana: 450, artifacts: ["Pipeline Pro"] },
            { id: "devops-3", title: "Kubernetes Fundamentals", xp: 400, mana: 600, artifacts: ["K8s Novice"] }
          ]
        }
      ]
    },
    "Product": {
      name: "Управление продуктом",
      description: "Стратегия продукта и пользовательский опыт",
      subskills: [
        {
          id: "user-research",
          name: "User Research",
          currentLevel: 3,
          maxLevel: 7,
          completions: 7,
          lastActivity: "2024-03-12",
          squadronPercentile: 78,
          personalProgress: "+12%",
          recommendedMissions: [
            { id: "ux-1", title: "Advanced User Interview Techniques", xp: 250, mana: 350, artifacts: ["Research Pro"] },
            { id: "ux-2", title: "Usability Testing Workshop", xp: 300, mana: 400, artifacts: ["Testing Expert"] },
            { id: "ux-3", title: "Data-Driven UX Decisions", xp: 350, mana: 500, artifacts: ["UX Analyst"] }
          ]
        },
        {
          id: "product-strategy",
          name: "Product Strategy",
          currentLevel: 2,
          maxLevel: 7,
          completions: 4,
          lastActivity: "2024-03-09",
          squadronPercentile: 58,
          personalProgress: "+7%",
          recommendedMissions: [
            { id: "strat-1", title: "Product Roadmap Planning", xp: 300, mana: 450, artifacts: ["Strategy Master"] },
            { id: "strat-2", title: "Market Analysis & Positioning", xp: 350, mana: 500, artifacts: ["Market Analyst"] },
            { id: "strat-3", title: "Competitive Intelligence", xp: 250, mana: 350, artifacts: ["Intel Specialist"] }
          ]
        }
      ]
    },
    "Research": {
      name: "Исследования и разработка",
      description: "Научные исследования и инновации",
      subskills: [
        {
          id: "data-science",
          name: "Data Science & ML",
          currentLevel: 4,
          maxLevel: 7,
          completions: 9,
          lastActivity: "2024-03-13",
          squadronPercentile: 88,
          personalProgress: "+18%",
          recommendedMissions: [
            { id: "ml-1", title: "Advanced Machine Learning", xp: 400, mana: 600, artifacts: ["ML Expert"] },
            { id: "ml-2", title: "Deep Learning Fundamentals", xp: 450, mana: 700, artifacts: ["DL Specialist"] },
            { id: "ml-3", title: "MLOps & Model Deployment", xp: 350, mana: 500, artifacts: ["MLOps Pro"] }
          ]
        },
        {
          id: "research-methods",
          name: "Research Methodology",
          currentLevel: 3,
          maxLevel: 7,
          completions: 6,
          lastActivity: "2024-03-11",
          squadronPercentile: 70,
          personalProgress: "+10%",
          recommendedMissions: [
            { id: "research-1", title: "Experimental Design Mastery", xp: 300, mana: 400, artifacts: ["Research Designer"] },
            { id: "research-2", title: "Statistical Analysis Pro", xp: 350, mana: 500, artifacts: ["Stats Expert"] },
            { id: "research-3", title: "Research Ethics & Integrity", xp: 250, mana: 350, artifacts: ["Ethics Specialist"] }
          ]
        }
      ]
    }
  };

  export function ProgressHub({ onMissionDetails, onSkillPathOpen }: ProgressHubProps) {
    const [selectedCareerTrack, setSelectedCareerTrack] = useState<keyof typeof careerTracks>("Technical");
    const [subskillModalOpen, setSubskillModalOpen] = useState(false);
    const [selectedSubskill, setSelectedSubskill] = useState<any>(null);
    
    const recentActions = [
      {
        id: "action-1",
        type: "mission_completed",
        title: "Продвинутые паттерны React",
        subtitle: "Миссия выполнена с оценкой 95%",
        timestamp: "2 часа назад",
        missionId: "mission-1"
      },
      {
        id: "action-2", 
        type: "mentorship",
        title: "Сессия обзора карты звезд",
        subtitle: "Менторил Алекса по основам навигации",
        timestamp: "5 часов назад",
        missionId: "mission-2"
      },
      {
        id: "action-3",
        type: "rank_up",
        title: "Повышение в звании",
        subtitle: "Продвинулся до звания Навигатор",
        timestamp: "1 день назад",
        missionId: null
      }
    ];
  
    // Core Competencies - 9 key competencies for pilots
    const coreCompetencies = [
      {
        id: "faith-in-cause",
        name: "Вера в дело",
        nameEn: "Faith in the Cause", 
        icon: Shield,
        currentLevel: 4,
        maxLevel: 5,
        progress: 1,
        nextGate: "Проведите 2 миссии по защите интересов организации",
        description: "Убежденность в правильности целей и готовность отстаивать принципы",
        recommendedMissions: [
          { id: "mission-faith-1", title: "Защита корпоративных ценностей" },
          { id: "mission-faith-2", title: "Миссия по продвижению миссии компании" }
        ]
      },
      {
        id: "striving-for-more",
        name: "Стремление к большему",
        nameEn: "Striving for More",
        icon: TrendingUp,
        currentLevel: 3,
        maxLevel: 5,
        progress: 2,
        nextGate: "Выполните 2 миссии по личному развитию и достижению целей",
        description: "Постоянное стремление к совершенствованию и достижению новых высот",
        recommendedMissions: [
          { id: "mission-strive-1", title: "Постановка и достижение амбициозных целей" },
          { id: "mission-strive-2", title: "Мастер-класс по личной мотивации" }
        ]
      },
      {
        id: "communication",
        name: "Общение",
        nameEn: "Communication",
        icon: MessageSquare,
        currentLevel: 4,
        maxLevel: 5,
        progress: 1,
        nextGate: "Проведите 1 презентацию для команды и 1 переговоры с клиентом",
        description: "Эффективные навыки вербального и письменного общения",
        recommendedMissions: [
          { id: "mission-comm-1", title: "Мастерство публичных выступлений" },
          { id: "mission-comm-2", title: "Переговоры и деловая переписка" }
        ]
      },
      {
        id: "analytics",
        name: "Аналитика",
        nameEn: "Analytics",
        icon: BarChart3,
        currentLevel: 3,
        maxLevel: 5,
        progress: 0,
        nextGate: "Выполните 3 миссии по анализу данных и принятию решений",
        description: "Аналитическое мышление и принятие решений на основе данных",
        recommendedMissions: [
          { id: "mission-anal-1", title: "Анализ ключевых показателей эффективности" },
          { id: "mission-anal-2", title: "Принятие стратегических решений на основе данных" }
        ]
      },
      {
        id: "command",
        name: "Командование",
        nameEn: "Command",
        icon: Users,
        currentLevel: 2,
        maxLevel: 5,
        progress: 3,
        nextGate: "Возглавите 3 командные миссии и проведите 1 оперативное совещание",
        description: "Лидерские качества и способность управлять командой",
        recommendedMissions: [
          { id: "mission-cmd-1", title: "Основы командного лидерства" },
          { id: "mission-cmd-2", title: "Управление операционными процессами" }
        ]
      },
      {
        id: "jurisprudence",
        name: "Юриспруденция",
        nameEn: "Jurisprudence",
        icon: BookOpen,
        currentLevel: 2,
        maxLevel: 5,
        progress: 2,
        nextGate: "Изучите 2 нормативных акта и проведите 1 консультацию по правовым вопросам",
        description: "Знание правовых основ и нормативного регулирования деятельности",
        recommendedMissions: [
          { id: "mission-law-1", title: "Изучение корпоративного права" },
          { id: "mission-law-2", title: "Соблюдение нормативных требований" }
        ]
      },
      {
        id: "3d-thinking",
        name: "Трёхмерное мышление",
        nameEn: "3D Thinking",
        icon: Target,
        currentLevel: 3,
        maxLevel: 5,
        progress: 1,
        nextGate: "Выполните 2 миссии по системному анализу и стратегическому планированию",
        description: "Системное мышление и способность видеть связи между различными аспектами",
        recommendedMissions: [
          { id: "mission-3d-1", title: "Системный анализ сложных процессов" },
          { id: "mission-3d-2", title: "Стратегическое планирование и прогнозирование" }
        ]
      },
      {
        id: "basic-economics",
        name: "Базовая экономика",
        nameEn: "Basic Economics",
        icon: Briefcase,
        currentLevel: 2,
        maxLevel: 5,
        progress: 2,
        nextGate: "Проведите 2 анализа экономических показателей и 1 оценку рентабельности",
        description: "Понимание экономических принципов и финансовых показателей",
        recommendedMissions: [
          { id: "mission-econ-1", title: "Основы финансового анализа" },
          { id: "mission-econ-2", title: "Экономические модели и прогнозирование" }
        ]
      },
      {
        id: "aerospace-navigation",
        name: "Основы аэронавигации",
        nameEn: "Aerospace Navigation Basics",
        icon: Trophy,
        currentLevel: 5,
        maxLevel: 5,
        progress: 0,
        nextGate: "Максимальный уровень достигнут",
        description: "Фундаментальные знания в области аэронавигации и космических технологий",
        recommendedMissions: [
          { id: "mission-nav-1", title: "Продвинутые методы космической навигации" },
          { id: "mission-nav-2", title: "Мастер-класс по пилотированию" }
        ]
      }
    ];
  
    const progressData = [
      { name: 'Week 1', xp: 180, percentage: 28 },
      { name: 'Week 2', xp: 320, percentage: 49 },
      { name: 'Week 3', xp: 280, percentage: 43 },
      { name: 'Week 4', xp: 450, percentage: 69 },
      { name: 'Week 5', xp: 520, percentage: 80 },
      { name: 'Week 6', xp: 380, percentage: 58 },
      { name: 'Week 7', xp: 650, percentage: 100 }
    ];
  
    const handleSubskillClick = (subskill: any, track: keyof typeof careerTracks) => {
      setSelectedSubskill({ ...subskill, track });
      setSubskillModalOpen(true);
    };
  
    const handleMissionsFilter = (subskillId: string) => {
      setSubskillModalOpen(false);
      // This would filter missions on Season Hub - for now we'll show a toast
      console.log(`Filter missions for subskill: ${subskillId}`);
    };
  
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6 min-w-0">
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="core-competencies">Компетенции</TabsTrigger>
            <TabsTrigger value="career-paths">Карьера</TabsTrigger>
          </TabsList>
  
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Rank Card */}
          <Card className="orbital-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between min-w-0">
                <Trophy className="w-8 h-8 text-rewards-amber" />
                <Badge className="bg-primary-200 text-primary-600">Текущий</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold">Навигатор</h3>
              <p className="text-sm text-muted-foreground">Звание пилота</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Прогресс до Командира</span>
                  <span>Нужно 550 XP</span>
                </div>
                <Progress value={81.7} className="h-2" />
              </div>
            </CardContent>
          </Card>
  
          {/* Mana Card */}
          <Card className="orbital-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between min-w-0">
                <Zap className="w-8 h-8 text-soft-cyan" />
                <Badge variant="outline">Баланс</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold font-mono">1,250</h3>
              <p className="text-sm text-muted-foreground">Мана доступна</p>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="text-success">+450</span> заработано на этой неделе
                </p>
              </div>
            </CardContent>
          </Card>
  
          {/* Missions Card */}
          <Card className="orbital-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between min-w-0">
                <Target className="w-8 h-8 text-primary" />
                <Badge variant="outline">Выполнено</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold">47</h3>
              <p className="text-sm text-muted-foreground">Миссии</p>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="text-success">8</span> в этом месяце
                </p>
              </div>
            </CardContent>
          </Card>
  
          {/* Artifacts Card */}
          <Card className="orbital-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between min-w-0">
                <Award className="w-8 h-8 text-navy-accent" />
                <Badge variant="outline">Получено</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-muted-foreground">Артефакты</p>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="text-success">3</span> в этом сезоне
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Enhanced Self vs Self Performance */}
        <Card className="elevation-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-info" />
Аналитика полетов
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rewards-amber" />
                  <span className="text-sm font-medium">Текущая серия</span>
                </div>
                <div className="text-2xl font-bold">7 дней</div>
                <p className="text-xs text-muted-foreground">Личный рекорд: 12 дней</p>
              </div>
  
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Недельный счет</span>
                </div>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-success">+12% vs прошлая неделя</p>
              </div>
  
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium">Ранг в эскадрилье</span>
                </div>
                <div className="text-2xl font-bold">#3</div>
                <p className="text-xs text-muted-foreground">из 12 пилотов</p>
              </div>
            </div>
  
            {/* Trend Chart - Simple Bar Visualization */}
            <div className="space-y-3">
              <h4 className="font-medium">Тренд недельного XP полетов</h4>
              <div className="space-y-2">
                {progressData.map((week, index) => (
                  <div key={week.name} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-muted-foreground">{week.name}</div>
                    <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
                        style={{ width: `${week.percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-xs font-mono text-right">{week.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Percentiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <h5 className="font-medium text-sm mb-2">vs Эскадрилья</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Выполнение миссий</span>
                    <span className="text-success">85-й процентиль</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Оценка качества</span>
                    <span className="text-success">92-й процентиль</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">vs Личный рекорд</h5>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Этот месяц</span>
                    <span className="text-success">+23%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Этот квартал</span>
                    <span className="text-success">+41%</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Next Rank Goal */}
            <div className="bg-primary-200/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">Следующий ранг: Командир</h5>
                <Badge className="bg-primary text-white">Цель</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Требуется XP полетов</span>
                  <span>550 / 550</span>
                </div>
                <Progress value={81.7} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Выполните еще 2-3 миссии уровня Командира для продвижения
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between min-w-0">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-text-icon" />
                Недавняя активность полетов
              </CardTitle>
              {onSkillPathOpen && (
                <Button 
                  onClick={onSkillPathOpen}
                  className="bg-primary hover:bg-primary-600 text-white"
                >
                  <TreePine className="w-4 h-4 mr-2" />
                  Дерево развития навыков
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    action.type === 'mission_completed' ? 'bg-success' :
                    action.type === 'mentorship' ? 'bg-info' :
                    'bg-rewards-amber'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="min-w-0">
                      <h4 className="font-medium text-wrap line-clamp-2">{action.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {action.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                  </div>
                  {action.missionId && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onMissionDetails(action.missionId!)}
                      className="flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </TabsContent>
  
          <TabsContent value="core-competencies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreCompetencies.map((competency) => {
                const IconComponent = competency.icon;
                const levelProgress = (competency.currentLevel / competency.maxLevel) * 100;
                
                return (
                  <Card key={competency.id} className="orbital-border">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{competency.name}</h3>
                          <p className="text-xs text-muted-foreground">{competency.nameEn}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Уровень</span>
                          <span className="font-medium">L{competency.currentLevel} / L{competency.maxLevel}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: competency.maxLevel }).map((_, index) => (
                            <div
                              key={index}
                              className={`h-2 flex-1 rounded-full ${
                                index < competency.currentLevel
                                  ? 'bg-primary'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        {competency.currentLevel < competency.maxLevel && (
                          <p className="text-xs text-muted-foreground">
                            Следующий этап: {competency.nextGate}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Рекомендуемые миссии:</h4>
                        <div className="space-y-1">
                          {competency.recommendedMissions.slice(0, 2).map((mission) => (
                            <Button
                              key={mission.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs h-auto p-2"
                              onClick={() => onMissionDetails(mission.id)}
                            >
                              <Play className="w-3 h-3 mr-2" />
                              {mission.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {competency.progress > 0 && competency.currentLevel < competency.maxLevel && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            {competency.progress} выполнений до L{competency.currentLevel + 1}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
  
          <TabsContent value="career-paths" className="space-y-6">
            {/* Track Selection */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(careerTracks).map((track) => (
                <Button
                  key={track}
                  variant={selectedCareerTrack === track ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCareerTrack(track as keyof typeof careerTracks)}
                  className="text-sm"
                >
                  {track}
                </Button>
              ))}
            </div>
  
            {/* Track Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Subskill List */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{careerTracks[selectedCareerTrack].name}</h3>
                  <p className="text-sm text-muted-foreground">{careerTracks[selectedCareerTrack].description}</p>
                </div>
                
                <div className="space-y-3">
                  {careerTracks[selectedCareerTrack].subskills.map((subskill: any) => (
                    <Card 
                      key={subskill.id} 
                      className="orbital-border cursor-pointer hover:elevation-cosmic transition-all"
                      onClick={() => handleSubskillClick(subskill, selectedCareerTrack)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{subskill.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>L{subskill.currentLevel}/{subskill.maxLevel}</span>
                              <span>•</span>
                              <span>{subskill.completions} выполнений</span>
                              <span>•</span>
                              <span>{subskill.squadronPercentile}-й процентиль</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <ArrowUp className="w-3 h-3 mr-1 text-success" />
                              {subskill.personalProgress}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: subskill.maxLevel }).map((_, index) => (
                              <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full ${
                                  index < subskill.currentLevel
                                    ? 'bg-primary'
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
  
              {/* Right: Selected Subskill Preview */}
              <div className="lg:sticky lg:top-6 lg:self-start">
                <Card className="orbital-border">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-info rounded-lg mx-auto flex items-center justify-center">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Выберите поднавык</h3>
                        <p className="text-sm text-muted-foreground">
                          Нажмите на любой поднавык для просмотра детального прогресса и рекомендуемых миссий
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
  
        {/* Subskill Sheet Modal */}
        <Dialog open={subskillModalOpen} onOpenChange={setSubskillModalOpen}>
          <DialogContent className="w-[90vw] max-w-[720px] h-[90vh] max-h-[600px] p-0">
            {selectedSubskill && (
              <>
                <DialogHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <DialogTitle className="text-xl font-semibold">
                        {selectedSubskill.track} / {selectedSubskill.name}
                      </DialogTitle>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Level:</span>
                          <Badge className="bg-primary text-white">
                            L{selectedSubskill.currentLevel}/{selectedSubskill.maxLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Squadron:</span>
                          <span className="font-medium">{selectedSubskill.squadronPercentile}th percentile</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 max-w-xs">
                        {Array.from({ length: selectedSubskill.maxLevel }).map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 flex-1 rounded-full ${
                              index < selectedSubskill.currentLevel
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSubskillModalOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </DialogHeader>
  
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Выполнения</h4>
                      <div className="text-2xl font-bold">{selectedSubskill.completions}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Последняя активность</h4>
                      <div className="text-sm">{selectedSubskill.lastActivity}</div>
                    </div>
                  </div>
                  
                  {/* Next Level Gates */}
                  {selectedSubskill.currentLevel < selectedSubskill.maxLevel && (
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Следующий уровень: L{selectedSubskill.currentLevel + 1}</h4>
                      <p className="text-sm text-muted-foreground">
                        Выполните ЛЮБЫЕ 2 миссии ниже для продвижения
                      </p>
                    </div>
                  )}
                  
                  {/* Recommended Missions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Рекомендуемые миссии</h4>
                    <div className="space-y-3">
                      {selectedSubskill.recommendedMissions.map((mission: any) => (
                        <Card key={mission.id} className="orbital-border cursor-pointer hover:elevation-cosmic transition-all"
                              onClick={() => onMissionDetails(mission.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm">{mission.title}</h5>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    {mission.xp} XP
                                  </Badge>
                                  <Badge variant="outline" className="text-xs text-rewards-amber border-rewards-amber/20">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {mission.mana} Mana
                                  </Badge>
                                  {mission.artifacts.map((artifact: string) => (
                                    <Badge key={artifact} variant="outline" className="text-xs">
                                      <Award className="w-3 h-3 mr-1" />
                                      {artifact}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
  
                <div className="border-t border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Личный прогресс: {selectedSubskill.personalProgress} vs прошлый месяц
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        onClick={() => setSubskillModalOpen(false)}
                      >
                        Закрыть
                      </Button>
                      <Button 
                        onClick={() => handleMissionsFilter(selectedSubskill.id)}
                        className="bg-primary hover:bg-primary-600 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Открыть миссии уровня
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }