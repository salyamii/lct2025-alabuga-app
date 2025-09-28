import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { toast } from "sonner";
import {
  Plus,
  X,
  Target,
  Zap,
  FileText,
  Lightbulb,
  Save,
  Star,
  Type,
  QrCode,
  Camera,
  Key,
  MapPin,
  Wifi,
  Heart,
  Calendar,
} from "lucide-react";
import { useMissionStore } from "../../stores/useMissionStore";
import { Mission } from "../../domain/mission";
import { Competency, CompetencyReward } from "../../domain/competency";
import { Skill, SkillReward } from "../../domain/skill";
import { Artifact } from "../../domain/artifact";
import { Task } from "../../domain/task";
import { MissionCategoryEnum, ArtifactRarityEnum } from "../../api/types/apiTypes";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useRankStore } from "../../stores/useRankStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useSkillStore } from "../../stores/useSkillStore";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useTaskStore } from "../../stores/useTaskStore";

interface MissionCreationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProofType =
  | "text"
  | "qr_code"
  | "photo"
  | "secret_word"
  | "geolocation"
  | "rfid";

interface MissionTask {
  id: number;
  title: string;
  description: string;
  isRequired: boolean;
  proofType?: ProofType;
  proofInstructions?: string;
}

interface MissionArtifact {
  id: number;
  title: string;
  description: string;
  rarity: ArtifactRarityEnum;
  imageUrl: string;
}

const PROOF_TYPES = [
  {
    value: "text",
    label: "Текстовый ответ",
    icon: Type,
    description: "Письменный ответ или объяснение",
  },
  {
    value: "qr_code",
    label: "Сканирование QR-кода",
    icon: QrCode,
    description: "Сканировать определенный QR-код",
  },
  {
    value: "photo",
    label: "Загрузка фото",
    icon: Camera,
    description: "Загрузить фото-доказательство",
  },
  {
    value: "secret_word",
    label: "Секретное слово",
    icon: Key,
    description: "Ввести секретную фразу или код",
  },
  {
    value: "geolocation",
    label: "Геолокация",
    icon: MapPin,
    description: "Отметка в определенном месте",
  },
  {
    value: "rfid",
    label: "RFID сканирование",
    icon: Wifi,
    description: "Сканировать RFID-метку или NFC устройство",
  },
];


export function MissionCreationDrawer({
  open,
  onOpenChange,
}: MissionCreationDrawerProps) {
  const { createMission, addTaskToMission, addArtifactToMission, addSkillRewardToMission, addCompetencyRewardToMission } = useMissionStore();
  const { createArtifact } = useArtifactStore();
  const { createTask } = useTaskStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectives: "",
    requirements: "",
    rankId: -1,
    seasonId: -1,
    category: "",
    xpReward: "",
    manaReward: "",
    duration: "",
    maxParticipants: "",
    location: "",
  });

  const { competencies, fetchCompetencies, isLoading: competenciesLoading } = useCompetencyStore();
  const { ranks, fetchRanks, isLoading: ranksLoading } = useRankStore();
  const { seasons, fetchSeasons, isLoading: seasonsLoading } = useSeasonStore();
  const { skills, fetchSkills, isLoading: skillsLoading } = useSkillStore();
  
  const [tasks, setTasks] = useState<MissionTask[]>([
    { id: 1, title: "", description: "", isRequired: true },
  ]);

  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [competencyLevelIncrease, setCompetencyLevelIncrease] = useState<number>(1);
  const [selectedSkills, setSelectedSkills] = useState<SkillReward[]>([]);
  const [missionArtifacts, setMissionArtifacts] = useState<MissionArtifact[]>([
    { id: 1, title: "", description: "", rarity: ArtifactRarityEnum.COMMON, imageUrl: "" }
  ]);
  const [isCreating, setIsCreating] = useState(false);

  // Загружаем компетенции, ранги, сезоны и навыки при открытии drawer
  useEffect(() => {
    if (open) {
      if (competencies.length === 0) {
        fetchCompetencies();
      }
      if (ranks.length === 0) {
        fetchRanks();
      }
      if (seasons.length === 0) {
        fetchSeasons();
      }
      if (skills.length === 0) {
        fetchSkills();
      }
    }
  }, [open, competencies.length, ranks.length, seasons.length, skills.length, fetchCompetencies, fetchRanks, fetchSeasons, fetchSkills]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        description: "",
        isRequired: false,
      },
    ]);
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (id: number, field: keyof MissionTask, value: any) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const addArtifact = () => {
    const newId = Math.max(...missionArtifacts.map((a) => a.id), 0) + 1;
    setMissionArtifacts((prev) => [
      ...prev,
      { id: newId, title: "", description: "", rarity: ArtifactRarityEnum.COMMON, imageUrl: "" }
    ]);
  };

  const removeArtifact = (id: number) => {
    setMissionArtifacts((prev) => prev.filter((artifact) => artifact.id !== id));
  };

  const updateArtifact = (id: number, field: keyof MissionArtifact, value: any) => {
    setMissionArtifacts((prev) =>
      prev.map((artifact) => (artifact.id === id ? { ...artifact, [field]: value } : artifact))
    );
  };


  const toggleSkill = (skillId: number) => {
    setSelectedSkills((prev) => {
      const isSelected = prev.some(skill => skill.skill.id === skillId);
      
      if (isSelected) {
        // Удаляем награду навыка
        return prev.filter(skill => skill.skill.id !== skillId);
      } else {
        // Находим навык в сторе
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
          // Создаем награду навыка с levelIncrease = 1
          const skillReward = new SkillReward(skill, 1);
          return [...prev, skillReward];
        }
        return prev;
      }
    });
  };


  const getProofTypeIcon = (type: ProofType) => {
    const proofType = PROOF_TYPES.find((p) => p.value === type);
    return proofType ? proofType.icon : Type;
  };

  const getRarityInfo = (rarity: ArtifactRarityEnum) => {
    const rarityMap = {
      [ArtifactRarityEnum.COMMON]: {
        label: "Обычный",
        className: "!bg-gray-100 !text-gray-800 !border-gray-300",
        style: { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#d1d5db' }
      },
      [ArtifactRarityEnum.UNCOMMON]: {
        label: "Необычный",
        className: "!bg-emerald-100 !text-emerald-800 !border-emerald-300",
        style: { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' }
      },
      [ArtifactRarityEnum.RARE]: {
        label: "Редкий",
        className: "!bg-blue-100 !text-blue-800 !border-blue-300",
        style: { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#93c5fd' }
      },
      [ArtifactRarityEnum.EPIC]: {
        label: "Эпический",
        className: "!bg-violet-100 !text-violet-800 !border-violet-300",
        style: { backgroundColor: '#ede9fe', color: '#5b21b6', borderColor: '#a78bfa' }
      },
      [ArtifactRarityEnum.LEGENDARY]: {
        label: "Легендарный",
        className: "!bg-amber-100 !text-amber-800 !border-amber-300",
        style: { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fbbf24' }
      }
    };
    
    return rarityMap[rarity] || rarityMap[ArtifactRarityEnum.COMMON];
  };

  const handleCreateMission = async () => {
     // Basic validation
     if (!formData.title || !formData.description || formData.rankId === -1 || formData.seasonId === -1 || !formData.category) {
       toast.error("Пожалуйста, заполните все обязательные поля");
       return;
     }

    if (!selectedCompetency) {
      toast.error("Пожалуйста, выберите компетенцию");
      return;
    }

    if (competencyLevelIncrease < 1) {
      toast.error("Увеличение уровня компетенции должно быть не менее 1");
      return;
    }

    const requiredTasks = tasks.filter((task) => task.isRequired && task.title);
    if (requiredTasks.length === 0) {
      toast.error("Пожалуйста, добавьте хотя бы одно обязательное задание");
      return;
    }

    try {
      setIsCreating(true);
      
      // Парсим задания в доменную модель
      const parsedTasks = tasks
        .filter(task => task.title && task.description) // Только заполненные задания
        .map(task => new Task(0, task.title, task.description));

      // Парсим артефакты в доменную модель
      const parsedArtifacts = missionArtifacts
        .filter(artifact => artifact.title && artifact.description) // Только заполненные артефакты
        .map(artifact => new Artifact(0, artifact.title, artifact.description, artifact.rarity, artifact.imageUrl));

      // Создаем миссию
      const missionData = {
        title: formData.title,
        description: formData.description,
        rewardXp: parseInt(formData.xpReward) || 0,
        rewardMana: parseInt(formData.manaReward) || 0,
        rankRequirement: formData.rankId,
        seasonId: formData.seasonId,
        category: formData.category as MissionCategoryEnum
      };

      const createdMission = await createMission(missionData);

      // Создаем и прикрепляем задания к миссии
      for (const task of parsedTasks) {
        const createdTask = await createTask({
          title: task.title,
          description: task.description
        });
        await addTaskToMission(createdMission.id, createdTask.id);
      }

      // Создаем и прикрепляем артефакты к миссии
      for (const artifact of parsedArtifacts) {
        const createdArtifact = await createArtifact({
          title: artifact.title,
          description: artifact.description,
          rarity: artifact.rarity,
          imageUrl: artifact.imageUrl
        });
        await addArtifactToMission(createdMission.id, createdArtifact.id);
      }

      // Прикрепляем награду компетенции к миссии
      if (selectedCompetency) {
        await addCompetencyRewardToMission(
          createdMission.id, 
          selectedCompetency.id, 
          competencyLevelIncrease
        );
      }

      // Прикрепляем награды навыков к миссии
      for (const skillReward of selectedSkills) {
        await addSkillRewardToMission(
          createdMission.id, 
          skillReward.skill.id, 
          skillReward.levelIncrease
        );
      }

      // Показываем успешное сообщение
      toast.success("Миссия успешно создана! 🚀", {
        description: `"${formData.title}" готова к развертыванию`,
      });
    } catch (error) {
      console.error("Ошибка при создании миссии:", error);
      toast.error("Ошибка при создании миссии. Попробуйте еще раз.");
      return;
    } finally {
      setIsCreating(false);
    }

     // Reset form
     setFormData({
       title: "",
       description: "",
       objectives: "",
       requirements: "",
       rankId: -1,
       seasonId: -1,
       category: "",
       xpReward: "",
       manaReward: "",
       duration: "",
       maxParticipants: "",
       location: "",
     });
      setTasks([{ id: 1, title: "", description: "", isRequired: true }]);
      setSelectedCompetency(null);
      setCompetencyLevelIncrease(1);
      setSelectedSkills([]);
      setMissionArtifacts([{ id: 1, title: "", description: "", rarity: ArtifactRarityEnum.COMMON, imageUrl: "" }]);

    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    toast.success("Миссия сохранена как черновик! 📋");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-6xl flex flex-col h-full">
          <DrawerHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 flex-shrink-0 rounded-t-lg mx-6 p-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Создать новую миссию
                </DrawerTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="px-6 pt-6 pb-12 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Mission Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Обзор миссии
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mission-title">Название миссии *</Label>
                        <Input
                          id="mission-title"
                          placeholder="например, Продвинутые паттерны React"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                        />
                      </div>
                       <div className="space-y-2">
                         <Label htmlFor="mission-rank">
                           Требуемый ранг *
                         </Label>
                         <Select
                           value={formData.rankId === -1 ? "" : formData.rankId.toString()}
                           onValueChange={(value) =>
                             handleInputChange("rankId", parseInt(value))
                           }
                         >
                           <SelectTrigger>
                             <SelectValue placeholder={ranksLoading ? "Загрузка рангов..." : "Выберите ранг"} />
                           </SelectTrigger>
                           <SelectContent>
                             {ranks.map((rank) => (
                               <SelectItem key={rank.id} value={rank.id.toString()}>
                                 {rank.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                      <div className="space-y-2">
                        <Label htmlFor="mission-category">Категория *</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                           <SelectContent>
                             <SelectItem value={MissionCategoryEnum.QUEST}>
                               Квест
                             </SelectItem>
                             <SelectItem value={MissionCategoryEnum.RECRUITING}>
                               Рекрутинг
                             </SelectItem>
                             <SelectItem value={MissionCategoryEnum.LECTURE}>
                               Лекция
                             </SelectItem>
                             <SelectItem value={MissionCategoryEnum.SIMULATOR}>
                               Симулятор
                             </SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mission-location">
                          Местоположение (необязательно)
                        </Label>
                        <Input
                          id="mission-location"
                          placeholder="например, Технический хаб Альфа"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-description">
                        Описание миссии *
                      </Label>
                      <Textarea
                        id="mission-description"
                        placeholder="Подробное описание миссии и целей..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-objectives">Цели обучения</Label>
                      <Textarea
                        id="mission-objectives"
                        placeholder="Что участники изучат и достигнут..."
                        rows={3}
                        value={formData.objectives}
                        onChange={(e) =>
                          handleInputChange("objectives", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-requirements">
                        Предварительные требования
                      </Label>
                      <Textarea
                        id="mission-requirements"
                        placeholder="Необходимые знания, навыки или завершенные миссии..."
                        rows={2}
                        value={formData.requirements}
                        onChange={(e) =>
                          handleInputChange("requirements", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="competency-select">Целевая компетенция *</Label>
                      <Select
                        value={selectedCompetency?.id.toString() || ""}
                        onValueChange={(value) => {
                          const competency = competencies.find(c => c.id.toString() === value);
                          setSelectedCompetency(competency || null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={competenciesLoading ? "Загрузка компетенций..." : "Выберите компетенцию"} />
                        </SelectTrigger>
                        <SelectContent>
                          {competencies.map((competency) => (
                            <SelectItem key={competency.id} value={competency.id.toString()}>
                              {competency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="season-select">Сезон *</Label>
                      <Select
                        value={formData.seasonId === -1 ? "" : formData.seasonId.toString()}
                        onValueChange={(value) => handleInputChange("seasonId", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={seasonsLoading ? "Загрузка сезонов..." : "Выберите сезон"} />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((season) => (
                            <SelectItem key={season.id} value={season.id.toString()}>
                              {season.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>


                {/* Skills Selection */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-info" />
                      Целевые навыки
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {skillsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">Загрузка навыков...</div>
                      </div>
                    ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {skills.map((skill) => {
                         const isSelected = selectedSkills.some(s => s.skill.id === skill.id);

                         return (
                           <div
                             key={skill.id}
                             className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                               isSelected
                                 ? "border-primary bg-primary/5"
                                 : "border-border hover:border-primary/30"
                             }`}
                             onClick={() => toggleSkill(skill.id)}
                           >
                             <div className="flex-1">
                               <p className="font-medium text-sm">
                                 {skill.name}
                               </p>
                               <p className="text-xs text-muted-foreground">
                                 Максимальный уровень: {skill.maxLevel}
                               </p>
                             </div>
                             <Checkbox
                               checked={isSelected}
                               onChange={() => toggleSkill(skill.id)}
                             />
                           </div>
                         );
                       })}
                     </div>
                    )}
                  </CardContent>
                </Card>

                {/* Mission Artifacts */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-info" />
                        Артефакты миссии
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addArtifact}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить артефакт
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {missionArtifacts.map((artifact, index) => (
                      <div
                        key={artifact.id}
                        className="card-enhanced rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              Артефакт {index + 1}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArtifact(artifact.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`artifact-title-${artifact.id}`}>Название артефакта</Label>
                            <Input
                              id={`artifact-title-${artifact.id}`}
                              placeholder="например, Кристалл силы"
                              value={artifact.title}
                              onChange={(e) => updateArtifact(artifact.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`artifact-rarity-${artifact.id}`}>Редкость</Label>
                            <Select
                              value={artifact.rarity}
                              onValueChange={(value) => updateArtifact(artifact.id, "rarity", value as ArtifactRarityEnum)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите редкость" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(ArtifactRarityEnum).map((rarity) => (
                                  <SelectItem key={rarity} value={rarity}>
                                    {getRarityInfo(rarity).label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`artifact-description-${artifact.id}`}>Описание артефакта</Label>
                          <Textarea
                            id={`artifact-description-${artifact.id}`}
                            placeholder="Подробное описание артефакта и его свойств..."
                            rows={3}
                            value={artifact.description}
                            onChange={(e) => updateArtifact(artifact.id, "description", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`artifact-image-${artifact.id}`}>URL изображения</Label>
                          <Input
                            id={`artifact-image-${artifact.id}`}
                            placeholder="https://example.com/artifact-image.jpg"
                            value={artifact.imageUrl}
                            onChange={(e) => updateArtifact(artifact.id, "imageUrl", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>


                {/* Mission Tasks */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-info" />
                        Задания миссии
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addTask}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить задание
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className="card-enhanced rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              Задание {index + 1}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={task.isRequired}
                                onCheckedChange={(checked) =>
                                  updateTask(task.id, "isRequired", checked)
                                }
                              />
                              <Label className="text-sm">Обязательное</Label>
                            </div>
                          </div>
                          {tasks.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTask(task.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Название задания</Label>
                            <Input
                              placeholder="например, Настройка React окружения"
                              value={task.title}
                              onChange={(e) =>
                                updateTask(task.id, "title", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Тип доказательства</Label>
                            <Select
                              onValueChange={(value) =>
                                updateTask(
                                  task.id,
                                  "proofType",
                                  value as ProofType
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип доказательства" />
                              </SelectTrigger>
                              <SelectContent>
                                {PROOF_TYPES.map((proofType) => {
                                  const Icon = proofType.icon;
                                  return (
                                    <SelectItem
                                      key={proofType.value}
                                      value={proofType.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span>{proofType.label}</span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Описание задания</Label>
                          <Textarea
                            placeholder="Подробное описание того, что нужно сделать..."
                            value={task.description}
                            onChange={(e) =>
                              updateTask(task.id, "description", e.target.value)
                            }
                            rows={2}
                          />
                        </div>

                        {task.proofType && (
                          <div className="space-y-2">
                            <Label>Инструкции по доказательству</Label>
                            <Input
                              placeholder={`Инструкции для ${
                                PROOF_TYPES.find(
                                  (p) => p.value === task.proofType
                                )?.label
                              }...`}
                              value={task.proofInstructions || ""}
                              onChange={(e) =>
                                updateTask(
                                  task.id,
                                  "proofInstructions",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}

                        {task.proofType && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              {(() => {
                                const Icon = getProofTypeIcon(task.proofType);
                                return (
                                  <Icon className="w-4 h-4 text-primary" />
                                );
                              })()}
                              <span className="text-sm font-medium">
                                {
                                  PROOF_TYPES.find(
                                    (p) => p.value === task.proofType
                                  )?.label
                                }
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {
                                PROOF_TYPES.find(
                                  (p) => p.value === task.proofType
                                )?.description
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Mission Configuration */}
              <div className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-info" />
                      Конфигурация миссии
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission-xp">Награда XP</Label>
                      <Input
                        id="mission-xp"
                        type="number"
                        placeholder="250"
                        value={formData.xpReward}
                        onChange={(e) =>
                          handleInputChange("xpReward", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-mana">Награда Маны</Label>
                      <Input
                        id="mission-mana"
                        type="number"
                        placeholder="50"
                        value={formData.manaReward}
                        onChange={(e) =>
                          handleInputChange("manaReward", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-duration">
                        Ожидаемая продолжительность (часы)
                      </Label>
                      <Input
                        id="mission-duration"
                        type="number"
                        placeholder="4"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission-participants">
                        Максимум участников
                      </Label>
                      <Input
                        id="mission-participants"
                        type="number"
                        placeholder="20"
                        value={formData.maxParticipants}
                        onChange={(e) =>
                          handleInputChange("maxParticipants", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="competency-level">Увеличение уровня компетенции</Label>
                      <Input
                        id="competency-level"
                        type="number"
                        min="1"
                        value={competencyLevelIncrease}
                        onChange={(e) => setCompetencyLevelIncrease(parseInt(e.target.value) || 1)}
                        placeholder="Введите количество уровней"
                      />
                      <p className="text-xs text-muted-foreground">
                        Количество уровней, на которое повысится компетенция при выполнении миссии
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mission Preview */}
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр миссии
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {formData.title && (
                      <div>
                        <strong>Название:</strong> {formData.title}
                      </div>
                    )}
                     {formData.rankId !== -1 && (
                       <div>
                         <strong>Требуемый ранг:</strong>{" "}
                         <Badge variant="outline" className="text-xs ml-1">
                           {ranks.find(rank => rank.id === formData.rankId)?.name || formData.rankId}
                         </Badge>
                       </div>
                     )}
                     {formData.seasonId !== -1 && (
                       <div>
                         <strong>Сезон:</strong>{" "}
                         <Badge variant="outline" className="text-xs ml-1">
                           {seasons.find(season => season.id === formData.seasonId)?.name || formData.seasonId}
                         </Badge>
                       </div>
                     )}
                     {selectedCompetency && (
                       <div>
                         <strong>Компетенция:</strong>
                         <div className="flex flex-wrap gap-1 mt-1">
                           <Badge
                             variant="secondary"
                             className="text-xs"
                           >
                             {selectedCompetency.name} (+{competencyLevelIncrease})
                           </Badge>
                         </div>
                       </div>
                     )}
                     {selectedSkills.length > 0 && (
                       <div>
                         <strong>Навыки:</strong>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedSkills.map((skillReward) => (
                             <Badge
                               key={skillReward.skill.id}
                               variant="secondary"
                               className="text-xs"
                             >
                               {skillReward.skill.name} (+{skillReward.levelIncrease})
                             </Badge>
                           ))}
                         </div>
                       </div>
                     )}
                     {missionArtifacts.filter(a => a.title && a.description).length > 0 && (
                       <div>
                         <strong>Артефакты:</strong>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {missionArtifacts
                             .filter(artifact => artifact.title && artifact.description)
                             .map((artifact) => (
                               <Badge
                                 key={artifact.id}
                                 variant="secondary"
                                 className="text-xs"
                               >
                                 {artifact.title}
                               </Badge>
                             ))}
                         </div>
                       </div>
                     )}
                    <div>
                      <strong>Задания:</strong>{" "}
                      {tasks.filter((t) => t.title).length}(
                      {tasks.filter((t) => t.title && t.isRequired).length}{" "}
                      обязательных)
                    </div>
                    {(formData.xpReward || formData.manaReward) && (
                      <div className="flex items-center gap-4 pt-2 border-t border-border">
                        {formData.xpReward && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary" />
                            {formData.xpReward} XP
                          </span>
                        )}
                        {formData.manaReward && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-rewards-amber" />
                            {formData.manaReward} Маны
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCreateMission}
                    disabled={isCreating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {isCreating ? "Создание..." : "Создать миссию"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить как черновик
                  </Button>
                </div>
              </div>
            </div>

            {/* Дополнительный отступ снизу */}
            <div className="h-12"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
