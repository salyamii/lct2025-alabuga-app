import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { Users, CheckCircle, Star, TrendingUp, BookOpen, GraduationCap, Plus, Filter, Clock, MessageSquare, Calendar } from "lucide-react";



interface MentorshipScreenProps {
    onBack: () => void;
    onPairSelect?: (pairId: string) => void;
  }
  
  export function MentorshipScreen({ onBack, onPairSelect }: MentorshipScreenProps) {
    const [activeTab, setActiveTab] = useState("my-pairs");
  
    const myPairs = [
      {
        id: "pair-1",
        mentor: { name: "Sarah Chen", avatar: "SC", rank: "Senior Navigator", rating: 4.9 },
        mentee: { name: "Alex Morgan", avatar: "AM", rank: "Pilot", rating: 4.7 },
        program: "Frontend Mastery",
        progress: 75,
        nextSession: "Tomorrow at 2:00 PM",
        sessionsCompleted: 8,
        totalSessions: 12,
        status: "active"
      },
      {
        id: "pair-2", 
        mentor: { name: "Mike Johnson", avatar: "MJ", rank: "Captain", rating: 4.8 },
        mentee: { name: "Emma Davis", avatar: "ED", rank: "Cadet", rating: 4.5 },
        program: "React Fundamentals",
        progress: 45,
        nextSession: "Friday at 3:30 PM",
        sessionsCompleted: 5,
        totalSessions: 10,
        status: "active"
      },
      {
        id: "pair-3",
        mentor: { name: "Lisa Anderson", avatar: "LA", rank: "Navigator", rating: 4.6 },
        mentee: { name: "James Wilson", avatar: "JW", rank: "Cadet", rating: 4.3 },
        program: "TypeScript Basics",
        progress: 90,
        nextSession: "Completed",
        sessionsCompleted: 9,
        totalSessions: 9,
        status: "completed"
      }
    ];
  
    const availableMentors = [
      {
        id: "mentor-1",
        name: "Dr. Jennifer Liu",
        avatar: "JL",
        rank: "Master Navigator",
        specialty: "Full Stack Architecture",
        rating: 4.9,
        sessions: 47,
        experience: "8 years",
        nextAvailable: "Next week",
        skills: ["React", "Node.js", "System Design", "Leadership"]
      },
      {
        id: "mentor-2",
        name: "Carlos Rodriguez",
        avatar: "CR", 
        rank: "Senior Captain",
        specialty: "DevOps & Cloud",
        rating: 4.8,
        sessions: 32,
        experience: "6 years", 
        nextAvailable: "In 3 days",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"]
      },
      {
        id: "mentor-3",
        name: "Nina Patel",
        avatar: "NP",
        rank: "Senior Navigator", 
        specialty: "UI/UX Design",
        rating: 4.7,
        sessions: 28,
        experience: "5 years",
        nextAvailable: "Available now",
        skills: ["Figma", "Design Systems", "User Research", "Prototyping"]
      }
    ];
  
    const programs = [
      {
        id: "prog-1",
        title: "Frontend Mastery Track",
        description: "Advanced React, TypeScript, and modern web development",
        duration: "12 weeks",
        level: "Intermediate to Advanced",
        participants: 24,
        rating: 4.8
      },
      {
        id: "prog-2", 
        title: "Leadership & Communication",
        description: "Develop leadership skills and effective communication",
        duration: "8 weeks",
        level: "All levels",
        participants: 18,
        rating: 4.9
      },
      {
        id: "prog-3",
        title: "System Design & Architecture", 
        description: "Learn to design scalable systems and architectures",
        duration: "16 weeks",
        level: "Advanced", 
        participants: 12,
        rating: 4.7
      }
    ];
  
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl">Центр наставничества</h1>
                <p className="text-sm text-muted-foreground">
                  Свяжитесь с наставниками и продвигайтесь по карьерной лестнице
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Запросить наставника
              </Button>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-pairs">Мое наставничество</TabsTrigger>
              <TabsTrigger value="mentors">Найти наставников</TabsTrigger>
              <TabsTrigger value="programs">Программы</TabsTrigger>
            </TabsList>
  
            {/* My Mentorship Pairs */}
            <TabsContent value="my-pairs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Overview */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="orbital-border">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-2xl font-mono">3</p>
                      <p className="text-xs text-muted-foreground">Активные пары</p>
                    </CardContent>
                  </Card>
                  <Card className="orbital-border">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-success/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <p className="text-2xl font-mono">22</p>
                      <p className="text-xs text-muted-foreground">Сессий завершено</p>
                    </CardContent>
                  </Card>
                  <Card className="orbital-border">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-info/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Star className="w-4 h-4 text-info" />
                      </div>
                      <p className="text-2xl font-mono">4.7</p>
                      <p className="text-xs text-muted-foreground">Средний рейтинг</p>
                    </CardContent>
                  </Card>
                  <Card className="orbital-border">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-rewards-amber/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-rewards-amber" />
                      </div>
                      <p className="text-2xl font-mono">73%</p>
                      <p className="text-xs text-muted-foreground">Средний прогресс</p>
                    </CardContent>
                  </Card>
                </div>
  
                {/* Mentorship Pairs */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Текущие пары наставничества</h3>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Фильтр
                    </Button>
                  </div>
                  
                  {myPairs.map((pair) => (
                    <Card 
                      key={pair.id} 
                      className="orbital-border cursor-pointer hover:elevation-cosmic transition-all"
                      onClick={() => onPairSelect?.(pair.id)}
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Pair Info */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-6 mb-4">
                              {/* Mentor */}
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback>{pair.mentor.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{pair.mentor.name}</p>
                                  <p className="text-xs text-muted-foreground">{pair.mentor.rank}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-8 h-px bg-border"></div>
                                <span className="text-xs">наставляет</span>
                                <div className="w-8 h-px bg-border"></div>
                              </div>
                              
                              {/* Mentee */}
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback>{pair.mentee.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{pair.mentee.name}</p>
                                  <p className="text-xs text-muted-foreground">{pair.mentee.rank}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-base">{pair.program}</h4>
                                  <Badge variant={pair.status === "completed" ? "default" : "secondary"}>
                                    {pair.status}
                                  </Badge>
                                </div>
                                <Progress value={pair.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>{pair.sessionsCompleted} / {pair.totalSessions} сессий</span>
                                  <span>{pair.progress}% завершено</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Следующая:</span>
                                <span className="font-medium">{pair.nextSession}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="flex-1">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Чат
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                Запланировать
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
  
            {/* Find Mentors */}
            <TabsContent value="mentors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableMentors.map((mentor) => (
                  <Card key={mentor.id} className="orbital-border hover:elevation-cosmic transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>{mentor.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground">{mentor.rank}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-warning fill-current" />
                            <span className="text-xs">{mentor.rating}</span>
                            <span className="text-xs text-muted-foreground">({mentor.sessions} сессий)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Специализация</p>
                        <p className="text-sm text-muted-foreground">{mentor.specialty}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Навыки</p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{mentor.experience} опыта</span>
                        <span>{mentor.nextAvailable}</span>
                      </div>
                      
                      <Button className="w-full bg-primary hover:bg-primary-600 text-white">
                        Запросить наставничество
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
  
            {/* Programs */}
            <TabsContent value="programs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <Card key={program.id} className="orbital-border hover:elevation-cosmic transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-2">{program.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {program.description}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center ml-4">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Продолжительность</p>
                          <p className="font-medium">{program.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Уровень</p>
                          <p className="font-medium">{program.level}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{program.participants} участников</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning fill-current" />
                            <span>{program.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Узнать больше
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }