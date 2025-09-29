import { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Plus,
  X,
  Target,
  Zap,
  Star,
  Link2,
  Trash2,
  GripVertical,
  Unlink,
} from "lucide-react";
import { Mission } from "../../domain/mission";

interface ChainMission {
  mission: Mission;
  prerequisites: number[]; // IDs of prerequisite missions
  order: number; // порядок в цепочке
}

interface MissionChainBuilderProps {
  missions: Mission[];
  selectedMissions: Mission[];
  onMissionsChange: (missions: Mission[]) => void;
  onDependenciesChange: (dependencies: { [missionId: string]: string[] }) => void;
}

export function MissionChainBuilder({
  missions,
  selectedMissions,
  onMissionsChange,
  onDependenciesChange,
}: MissionChainBuilderProps) {
  const [chainMissions, setChainMissions] = useState<ChainMission[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [useDependencies, setUseDependencies] = useState<boolean>(true);

  // Инициализируем цепочку миссий при изменении выбранных миссий
  useEffect(() => {
    const newChainMissions: ChainMission[] = selectedMissions.map((mission, index) => ({
      mission,
      prerequisites: [],
      order: index + 1,
    }));
    setChainMissions(newChainMissions);
  }, [selectedMissions]);

  // Добавляем миссию в цепочку
  const addMissionToChain = (mission: Mission) => {
    if (selectedMissions.some(m => m.id === mission.id)) return;
    
    const newMissions = [...selectedMissions, mission];
    onMissionsChange(newMissions);
  };

  // Удаляем миссию из цепочки
  const removeMissionFromChain = (missionId: number) => {
    const newMissions = selectedMissions.filter(m => m.id !== missionId);
    onMissionsChange(newMissions);
    
    // Обновляем зависимости после удаления
    updateDependencies();
  };

  // Обновляем зависимости (включая наследованные)
  const updateDependencies = () => {
    const newDependencies: { [missionId: string]: string[] } = {};
    chainMissions.forEach(chainMission => {
      const allDeps = getAllDependencies(chainMission.mission.id);
      if (allDeps.length > 0) {
        newDependencies[chainMission.mission.id.toString()] = allDeps.map(prereqId => 
          prereqId.toString()
        );
      }
    });
    onDependenciesChange(newDependencies);
  };

  // Добавляем зависимость
  const addPrerequisite = (missionId: number, prerequisiteId: number) => {
    setChainMissions(prev => prev.map(chainMission => {
      if (chainMission.mission.id === missionId) {
        const newPrerequisites = [...chainMission.prerequisites, prerequisiteId];
        return { ...chainMission, prerequisites: newPrerequisites };
      }
      return chainMission;
    }));
  };

  // Удаляем зависимость
  const removePrerequisite = (missionId: number, prerequisiteId: number) => {
    setChainMissions(prev => prev.map(chainMission => {
      if (chainMission.mission.id === missionId) {
        const newPrerequisites = chainMission.prerequisites.filter(id => id !== prerequisiteId);
        return { ...chainMission, prerequisites: newPrerequisites };
      }
      return chainMission;
    }));
  };

  // Очищаем все связи между миссиями
  const clearAllDependencies = () => {
    setChainMissions(prev => prev.map(chainMission => ({
      ...chainMission,
      prerequisites: []
    })));
  };

  // Обновляем зависимости при изменении цепочки
  useEffect(() => {
    updateDependencies();
  }, [chainMissions]);

  // Очищаем зависимости при выключении чекбокса
  useEffect(() => {
    if (!useDependencies) {
      clearAllDependencies();
    }
  }, [useDependencies]);

  // Алгоритм проверки циклических зависимостей
  const hasCircularDependency = (missionId: number, prerequisiteId: number): boolean => {
    // Создаем граф зависимостей
    const graph = new Map<number, number[]>();
    
    // Добавляем существующие зависимости
    chainMissions.forEach(chainMission => {
      if (chainMission.prerequisites.length > 0) {
        graph.set(chainMission.mission.id, chainMission.prerequisites);
      }
    });
    
    // Добавляем новую зависимость для проверки
    const currentDeps = graph.get(missionId) || [];
    graph.set(missionId, [...currentDeps, prerequisiteId]);
    
    // DFS для поиска цикла
    const visited = new Set<number>();
    const recursionStack = new Set<number>();
    
    const dfs = (node: number): boolean => {
      if (recursionStack.has(node)) return true; // Цикл найден
      if (visited.has(node)) return false;
      
      visited.add(node);
      recursionStack.add(node);
      
      const dependencies = graph.get(node) || [];
      for (const dep of dependencies) {
        if (dfs(dep)) return true;
      }
      
      recursionStack.delete(node);
      return false;
    };
    
    // Проверяем все узлы
    for (const node of Array.from(graph.keys())) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }
    
    return false;
  };

  // Получаем доступные миссии (не добавленные в цепочку) с фильтром по категории
  const availableMissions = missions.filter(mission => 
    !selectedMissions.some(m => m.id === mission.id) &&
    (categoryFilter === "all" || mission.category === categoryFilter)
  );

  // Получаем уникальные категории для фильтра
  const categories = Array.from(new Set(missions.map(mission => mission.category)));

  // Получаем все зависимости миссии (включая наследованные)
  const getAllDependencies = (missionId: number): number[] => {
    const mission = chainMissions.find(m => m.mission.id === missionId);
    if (!mission) return [];
    
    const allDeps = new Set<number>();
    
    // Добавляем прямые зависимости
    mission.prerequisites.forEach(depId => {
      allDeps.add(depId);
      // Рекурсивно добавляем зависимости зависимостей
      getAllDependencies(depId).forEach(inheritedDep => {
        allDeps.add(inheritedDep);
      });
    });
    
    return Array.from(allDeps);
  };

  // Получаем миссии, которые могут быть зависимостями для выбранной миссии
  const getAvailablePrerequisites = (currentMissionId: number) => {
    const allDependencies = getAllDependencies(currentMissionId);
    
    return chainMissions.filter(chainMission => {
      // Исключаем саму миссию
      if (chainMission.mission.id === currentMissionId) return false;
      
      // Исключаем миссии, от которых уже есть зависимость (прямая или наследованная)
      // НО оставляем те, которые уже выбраны как прямые зависимости
      const isDirectlySelected = chainMissions.find(m => m.mission.id === currentMissionId)?.prerequisites.includes(chainMission.mission.id);
      if (allDependencies.includes(chainMission.mission.id) && !isDirectlySelected) return false;
      
      // Проверяем, не создаст ли эта зависимость циклическую зависимость
      return !hasCircularDependency(currentMissionId, chainMission.mission.id);
    });
  };

  // Обработчики drag & drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Переупорядочиваем миссии
    const newMissions = [...selectedMissions];
    const draggedMission = newMissions[draggedIndex];
    
    // Удаляем перетаскиваемую миссию
    newMissions.splice(draggedIndex, 1);
    
    // Вставляем её в новую позицию
    const newIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newMissions.splice(newIndex, 0, draggedMission);
    
    // Обновляем выбранные миссии
    onMissionsChange(newMissions);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Доступные миссии */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Доступные миссии
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="category-filter" className="text-sm text-muted-foreground">
                Категория:
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableMissions.map(mission => (
              <Button
                key={mission.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left hover:bg-primary/5"
                onClick={() => addMissionToChain(mission)}
              >
                <div className="flex items-center gap-2 w-full mb-2">
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm truncate flex-1">
                    {mission.title}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {mission.tasks.length} заданий
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {mission.rewardXp} XP
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {mission.rewardMana} маны
                  </div>
                </div>
                <Badge variant="outline" className="text-xs mt-2">
                  {mission.category}
                </Badge>
              </Button>
            ))}
          </div>
          {availableMissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Все миссии добавлены в цепочку
            </div>
          )}
        </CardContent>
      </Card>

      {/* Конструктор цепочки */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Конструктор цепочки миссий
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Перетаскивайте миссии для изменения порядка выполнения
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-dependencies"
                  checked={useDependencies}
                  onCheckedChange={(checked) => setUseDependencies(checked as boolean)}
                />
                <Label htmlFor="use-dependencies" className="text-sm">
                  Использовать зависимости
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllDependencies}
                disabled={!useDependencies}
                className="flex items-center gap-2"
              >
                <Unlink className="w-4 h-4" />
                Очистить связи
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chainMissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Выберите первую миссию из доступных</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chainMissions.map((chainMission, index) => (
                <div key={`mission-${chainMission.mission.id}`}>
                  {/* Drop zone above mission */}
                  {draggedIndex !== null && draggedIndex !== index && (
                    <div
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`h-1 mx-4 rounded-full transition-all duration-200 ${
                        dragOverIndex === index 
                          ? "bg-primary shadow-lg" 
                          : "bg-transparent hover:bg-primary/20"
                      }`}
                    />
                  )}
                  
                  
                  {/* Mission card */}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 border rounded-lg bg-card transition-all duration-200 ${
                      draggedIndex === index 
                        ? "opacity-50 scale-95" 
                        : dragOverIndex === index 
                          ? "border-primary shadow-lg scale-105" 
                          : "hover:shadow-md"
                    }`}
                  >
                    {/* Основная строка с информацией о миссии */}
                    <div className="flex items-center gap-4">
                      {/* Номер миссии */}
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {chainMission.order}
                      </div>
                      
                      {/* Drag handle */}
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" />
                      
                      {/* Название миссии */}
                      <h4 className="font-medium text-sm truncate flex-shrink-0 min-w-0">
                        {chainMission.mission.title}
                      </h4>
                      
                      {/* Данные о миссии (выровнены слева от имени) */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {chainMission.mission.tasks.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {chainMission.mission.rewardXp} XP
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {chainMission.mission.rewardMana} Мана
                        </span>
                      </div>
                      
                      {/* Бейджи */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {chainMission.mission.category}
                        </Badge>
                        {chainMission.prerequisites.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {chainMission.prerequisites.length}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Кнопка удаления (крайняя справа) */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMissionFromChain(chainMission.mission.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 ml-auto flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Управление зависимостями (на следующей строке) */}
                    {index > 0 && useDependencies && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex flex-wrap gap-2">
                          {getAvailablePrerequisites(chainMission.mission.id).map(prereqMission => {
                            const isSelected = chainMission.prerequisites.includes(prereqMission.mission.id);
                            return (
                              <Button
                                key={prereqMission.mission.id}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => {
                                  if (isSelected) {
                                    removePrerequisite(chainMission.mission.id, prereqMission.mission.id);
                                  } else {
                                    addPrerequisite(chainMission.mission.id, prereqMission.mission.id);
                                  }
                                }}
                              >
                                {isSelected ? "✓" : "+"} {prereqMission.mission.title}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Drop zone below last mission */}
                  {draggedIndex !== null && index === chainMissions.length - 1 && (
                    <div
                      onDragOver={(e) => handleDragOver(e, index + 1)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index + 1)}
                      className={`h-1 mx-4 rounded-full transition-all duration-200 ${
                        dragOverIndex === index + 1 
                          ? "bg-primary shadow-lg" 
                          : "bg-transparent hover:bg-primary/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
