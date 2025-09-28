import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Target, Users, Code, Palette, ChevronRight } from "lucide-react";


interface OnboardingScreenProps {
    onComplete: () => void;
  }
  
  export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedSquadron, setSelectedSquadron] = useState<string>("");
  
    const steps = [
      { title: "Добро пожаловать", description: "Введение в Alabuga Talents" },
      { title: "Цели", description: "Выберите свои цели" },
      { title: "Команда", description: "Присоединитесь к команде" },
      { title: "Готов", description: "Запустите ваше путешествие" }
    ];
  
    const goals = [
      { id: "frontend", title: "Frontend Разработка", icon: Code, description: "React, TypeScript, UI/UX" },
      { id: "backend", title: "Backend Разработка", icon: Code, description: "API, База данных, Архитектура" },
      { id: "design", title: "UI/UX Дизайн", icon: Palette, description: "Системы дизайна, Прототипирование" },
      { id: "leadership", title: "Лидерство Команды", icon: Users, description: "Управление, Менторинг" },
      { id: "devops", title: "DevOps и Инфраструктура", icon: Target, description: "CI/CD, Cloud, Мониторинг" },
      { id: "mobile", title: "Мобильная Разработка", icon: Code, description: "iOS, Android, React Native" }
    ];
  
    const squadrons = [
      { id: "alpha", name: "Эскадрилья Альфа", description: "Frontend специалисты", members: 12, color: "bg-primary" },
      { id: "beta", name: "Эскадрилья Бета", description: "Full-stack разработчики", members: 15, color: "bg-info" },
      { id: "gamma", name: "Эскадрилья Гамма", description: "Backend инженеры", members: 10, color: "bg-success" },
      { id: "delta", name: "Эскадрилья Дельта", description: "Команда дизайна и UX", members: 8, color: "bg-rewards-amber" }
    ];
  
    const handleGoalToggle = (goalId: string) => {
      setSelectedGoals(prev => 
        prev.includes(goalId) 
          ? prev.filter(id => id !== goalId)
          : [...prev, goalId]
      );
    };
  
    const handleNext = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    };
  
    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };
  
    const canProceed = () => {
      switch (currentStep) {
        case 1: return selectedGoals.length > 0;
        case 2: return selectedSquadron !== "";
        default: return true;
      }
    };
  
    const renderStepContent = () => {
      switch (currentStep) {
        case 0:
          return (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-info rounded-full mx-auto flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl mb-4">Добро пожаловать в Центр Управления Миссиями</h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  Вы готовы отправиться в эпическое путешествие профессионального роста. 
                  Выполняйте миссии, зарабатывайте артефакты и продвигайтесь по званиям в нашей космической платформе обучения.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <Code className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Миссии Навыков</p>
                </div>
                <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                  <Users className="w-6 h-6 text-info mx-auto mb-2" />
                  <p className="text-sm font-medium">Командная Работа</p>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <Target className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-sm font-medium">Карьерный Рост</p>
                </div>
              </div>
            </div>
          );
  
        case 1:
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl mb-4">Выберите Цели Ваших Миссий</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Выберите навыки, которые хотите развивать. Вы всегда сможете добавить больше позже.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <Card 
                      key={goal.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'orbital-border ring-2 ring-primary ring-offset-2' 
                          : 'orbital-border hover:elevation-cosmic'
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary' : 'bg-muted'
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-base">{goal.title}</h3>
                              {isSelected ? (
                                <CheckCircle className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {selectedGoals.length > 0 && (
                <div className="text-center">
                  <Badge variant="outline" className="text-sm">
                    {selectedGoals.length} {selectedGoals.length === 1 ? 'цель' : selectedGoals.length < 5 ? 'цели' : 'целей'} выбрано
                  </Badge>
                </div>
              )}
            </div>
          );
  
        case 2:
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl mb-4">Присоединитесь к Вашей Эскадрилье</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Выберите эскадрилью, которая соответствует вашим интересам и целям.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {squadrons.map((squadron) => {
                  const isSelected = selectedSquadron === squadron.id;
                  return (
                    <Card 
                      key={squadron.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'orbital-border ring-2 ring-primary ring-offset-2' 
                          : 'orbital-border hover:elevation-cosmic'
                      }`}
                      onClick={() => setSelectedSquadron(squadron.id)}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${squadron.color} flex items-center justify-center`}>
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-base">{squadron.name}</h3>
                              {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{squadron.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {squadron.members} {squadron.members === 1 ? 'участник' : squadron.members < 5 ? 'участника' : 'участников'}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
  
        case 3:
          return (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-success to-primary rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl mb-4">Готов к Запуску!</h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  Ваш профиль пилота настроен и готов. Давайте начнем ваше путешествие к звездам!
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Выбранные Цели:</span>
                  <Badge>{selectedGoals.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Эскадрилья:</span>
                  <Badge variant="outline">
                    {squadrons.find(s => s.id === selectedSquadron)?.name}
                  </Badge>
                </div>
              </div>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg md:text-xl">Брифинг Миссии</h1>
              <Badge variant="outline" className="text-xs">
                Шаг {currentStep + 1} из {steps.length}
              </Badge>
            </div>
            <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
            
            {/* Steps */}
            <div className="mt-4 flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Step Content */}
          <div className="mb-8 md:mb-12">
            {renderStepContent()}
          </div>
  
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={onComplete}
                className="text-muted-foreground"
              >
                Пропустить Настройку
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary-600 text-white flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Запустить Центр Управления Миссиями' : 'Продолжить'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }