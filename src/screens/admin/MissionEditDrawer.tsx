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
  Edit,
} from "lucide-react";
import { useMissionStore } from "../../stores/useMissionStore";
import { useTaskStore } from "../../stores/useTaskStore";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useRankStore } from "../../stores/useRankStore";
import { useSeasonStore } from "../../stores/useSeasonStore";
import { useSkillStore } from "../../stores/useSkillStore";
import mediaService from "../../api/services/mediaService";
import { Mission } from "../../domain/mission";
import { Competency, CompetencyReward } from "../../domain/competency";
import { Skill, SkillReward } from "../../domain/skill";
import { Artifact } from "../../domain/artifact";
import { Task } from "../../domain/task";
import { MissionCategoryEnum, ArtifactRarityEnum } from "../../api/types/apiTypes";

interface MissionEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mission: Mission | null;
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

export function MissionEditDrawer({
  open,
  onOpenChange,
  mission,
}: MissionEditDrawerProps) {
  const { updateMission, addTaskToMission, removeTaskFromMission, addArtifactToMission, removeArtifactFromMission, addSkillRewardToMission, removeSkillRewardFromMission, addCompetencyRewardToMission, removeCompetencyRewardFromMission } = useMissionStore();
  const { createTask, updateTask, deleteTask } = useTaskStore();
  const { createArtifact, updateArtifact, deleteArtifact } = useArtifactStore();
  const { competencies, fetchCompetencies, isLoading: competenciesLoading } = useCompetencyStore();
  const { ranks, fetchRanks, isLoading: ranksLoading } = useRankStore();
  const { seasons, fetchSeasons, isLoading: seasonsLoading } = useSeasonStore();
  const { skills, fetchSkills, isLoading: skillsLoading } = useSkillStore();

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

  const [tasks, setTasks] = useState<MissionTask[]>([]);
  
  // Новая структура для компетенций с их навыками
  const [competencyRewards, setCompetencyRewards] = useState<Array<{
    id: number;
    competency: Competency | null;
    levelIncrease: number;
    skillRewards: Array<{ skillId: number; levelIncrease: number }>;
  }>>([]);

  // Отдельные навыки (не привязанные к компетенциям)
  const [standaloneSkillRewards, setStandaloneSkillRewards] = useState<Array<{
    id: number;
    skill: Skill | null;
    levelIncrease: number;
  }>>([]);

  const [missionArtifacts, setMissionArtifacts] = useState<MissionArtifact[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Заполняем форму данными миссии при открытии
  useEffect(() => {
    if (mission && open) {
      setFormData({
        title: mission.title,
        description: mission.description,
        objectives: "", // Добавить в доменную модель если нужно
        requirements: "", // Добавить в доменную модель если нужно
        rankId: mission.rankRequirement,
        seasonId: mission.seasonId,
        category: mission.category,
        xpReward: mission.rewardXp.toString(),
        manaReward: mission.rewardMana.toString(),
        duration: "",
        maxParticipants: "",
        location: "",
      });

      // Заполняем задания
      setTasks(mission.tasks.map((task, index) => ({
        id: index + 1,
        title: task.title,
        description: task.description,
        isRequired: true,
      })));

      // Заполняем компетенции с их навыками
      const compRewards = mission.rewardCompetencies.map((cr, idx) => {
        // Находим навыки, которые относятся к этой компетенции
        const compSkillIds = cr.competency.skills.map(s => s.id);
        const relatedSkills = mission.rewardSkills.filter(sr => 
          compSkillIds.includes(sr.skill.id)
        );
        
        return {
          id: idx + 1,
          competency: cr.competency,
          levelIncrease: cr.levelIncrease,
          skillRewards: relatedSkills.map(sr => ({
            skillId: sr.skill.id,
            levelIncrease: sr.levelIncrease
          }))
        };
      });
      setCompetencyRewards(compRewards.length > 0 ? compRewards : [{ id: 1, competency: null, levelIncrease: 1, skillRewards: [] }]);

      // Заполняем отдельные навыки (не привязанные к компетенциям)
      const allCompetencySkillIds = mission.rewardCompetencies.flatMap(cr => 
        cr.competency.skills.map(s => s.id)
      );
      const standalone = mission.rewardSkills
        .filter(sr => !allCompetencySkillIds.includes(sr.skill.id))
        .map((sr, idx) => ({
          id: idx + 1,
          skill: sr.skill,
          levelIncrease: sr.levelIncrease
        }));
      setStandaloneSkillRewards(standalone);

      // Заполняем артефакты
      setMissionArtifacts(mission.rewardArtifacts.map((artifact, index) => ({
        id: index + 1,
        title: artifact.title,
        description: artifact.description,
        rarity: artifact.rarity,
        imageUrl: artifact.imageUrl,
      })));
    }
  }, [mission, open]);

  // Загружаем данные при открытии drawer
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

  const updateTaskField = (id: number, field: keyof MissionTask, value: any) => {
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

  const updateArtifactField = (id: number, field: keyof MissionArtifact, value: any) => {
    setMissionArtifacts((prev) =>
      prev.map((artifact) => (artifact.id === id ? { ...artifact, [field]: value } : artifact))
    );
  };

  // Методы для управления компетенциями
  const addCompetencyReward = () => {
    const newId = Math.max(...competencyRewards.map(c => c.id), 0) + 1;
    setCompetencyRewards(prev => [
      ...prev,
      { id: newId, competency: null, levelIncrease: 1, skillRewards: [] }
    ]);
  };

  const removeCompetencyReward = (id: number) => {
    setCompetencyRewards(prev => prev.filter(c => c.id !== id));
  };

  const updateCompetencyReward = (id: number, field: 'competency' | 'levelIncrease', value: any) => {
    setCompetencyRewards(prev => prev.map(c => {
      if (c.id === id) {
        if (field === 'competency') {
          const competency = value as Competency | null;
          const skillRewards = competency 
            ? competency.skills.map(skill => ({ skillId: skill.id, levelIncrease: 1 }))
            : [];
          return { ...c, competency, skillRewards };
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const updateSkillInCompetency = (competencyId: number, skillId: number, levelIncrease: number) => {
    setCompetencyRewards(prev => prev.map(c => {
      if (c.id === competencyId) {
        const updatedSkillRewards = c.skillRewards.map(sr =>
          sr.skillId === skillId ? { ...sr, levelIncrease } : sr
        );
        return { ...c, skillRewards: updatedSkillRewards };
      }
      return c;
    }));
  };

  // Методы для управления отдельными навыками
  const addStandaloneSkill = () => {
    const newId = Math.max(...standaloneSkillRewards.map(s => s.id), 0, 0) + 1;
    setStandaloneSkillRewards(prev => [
      ...prev,
      { id: newId, skill: null, levelIncrease: 1 }
    ]);
  };

  const removeStandaloneSkill = (id: number) => {
    setStandaloneSkillRewards(prev => prev.filter(s => s.id !== id));
  };

  const updateStandaloneSkill = (id: number, field: 'skill' | 'levelIncrease', value: any) => {
    setStandaloneSkillRewards(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Метод для загрузки изображения артефакта
  const handleImageUpload = async (artifactId: number, file: File) => {
    try {
      setUploadingImages(prev => ({ ...prev, [artifactId]: true }));
      
      const response = await mediaService.uploadFile(file);
      const imageUrl = response.data.url;
      
      updateArtifactField(artifactId, "imageUrl", imageUrl);
      toast.success("Изображение успешно загружено!");
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Ошибка при загрузке изображения");
    } finally {
      setUploadingImages(prev => ({ ...prev, [artifactId]: false }));
    }
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

  const handleUpdateMission = async () => {
    if (!mission) return;

    // Basic validation
    if (!formData.title || !formData.description || formData.rankId === -1 || formData.seasonId === -1 || !formData.category) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Проверяем, что выбрана хотя бы одна компетенция
    const validCompetencies = competencyRewards.filter(cr => cr.competency !== null);
    if (validCompetencies.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы одну компетенцию");
      return;
    }

    const requiredTasks = tasks.filter((task) => task.isRequired && task.title);
    if (requiredTasks.length === 0) {
      toast.error("Пожалуйста, добавьте хотя бы одно обязательное задание");
      return;
    }

    try {
      setIsUpdating(true);
      
      // Обновляем основную информацию миссии
      const missionData = {
        title: formData.title,
        description: formData.description,
        rewardXp: parseInt(formData.xpReward) || 0,
        rewardMana: parseInt(formData.manaReward) || 0,
        rankRequirement: formData.rankId,
        seasonId: formData.seasonId,
        category: formData.category as MissionCategoryEnum
      };

      await updateMission(mission.id, missionData);

      // TODO: Добавить логику для обновления заданий, артефактов, навыков и компетенций
      // Это потребует сравнения текущего состояния с новым и выполнения соответствующих операций

      // Показываем успешное сообщение
      toast.success("Миссия успешно обновлена! ✨", {
        description: `"${formData.title}" была изменена`,
      });
    } catch (error) {
      console.error("Ошибка при обновлении миссии:", error);
      toast.error("Ошибка при обновлении миссии. Попробуйте еще раз.");
      return;
    } finally {
      setIsUpdating(false);
    }

    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    toast.success("Изменения сохранены как черновик! 📋");
    onOpenChange(false);
  };

  if (!mission) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-6xl flex flex-col h-full">
          <DrawerHeader className="border-b border-border bg-gradient-to-r from-card to-primary/5 flex-shrink-0 rounded-t-lg mx-6 p-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <DrawerTitle className="text-lg font-semibold">
                  Редактировать миссию
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
                          value={formData.category}
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

                {/* Competency Rewards */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        Выбор компетенций *
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addCompetencyReward}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить компетенцию
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competencyRewards.map((compReward, index) => {
                      const selectedComp = compReward.competency;
                      
                      return (
                        <div key={compReward.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              Компетенция {index + 1}
                            </Badge>
                            {competencyRewards.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCompetencyReward(compReward.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Компетенция *</Label>
                              <Select
                                value={selectedComp?.id.toString() || ""}
                                onValueChange={(value) => {
                                  const comp = competencies.find(c => c.id.toString() === value);
                                  updateCompetencyReward(compReward.id, 'competency', comp || null);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={competenciesLoading ? "Загрузка..." : "Выберите компетенцию"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {competencies.map((comp) => (
                                    <SelectItem key={comp.id} value={comp.id.toString()}>
                                      {comp.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Повышение уровня *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={compReward.levelIncrease}
                                onChange={(e) => updateCompetencyReward(compReward.id, 'levelIncrease', parseInt(e.target.value) || 1)}
                                placeholder="1"
                              />
                            </div>
                          </div>

                          {/* Навыки компетенции */}
                          {selectedComp && selectedComp.skills.length > 0 && (
                            <div className="space-y-3 pt-3 border-t">
                              <p className="text-sm font-medium">Навыки компетенции:</p>
                              {compReward.skillRewards.map(skillReward => {
                                const skill = selectedComp.skills.find(s => s.id === skillReward.skillId);
                                if (!skill) return null;

                                return (
                                  <div key={skillReward.skillId} className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{skill.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Макс. уровень: {skill.maxLevel}
                                      </p>
                                    </div>
                                    <div className="w-24">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={skillReward.levelIncrease}
                                        onChange={(e) => updateSkillInCompetency(compReward.id, skillReward.skillId, parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        className="text-sm"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Standalone Skills */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-info" />
                        Отдельные навыки
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={addStandaloneSkill}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить навык
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Навыки, не связанные с компетенциями (необязательно)
                    </p>
                    
                    {standaloneSkillRewards.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Нет отдельных навыков
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {standaloneSkillRewards.map((skillReward, index) => (
                          <div key={skillReward.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                Навык {index + 1}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStandaloneSkill(skillReward.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Навык *</Label>
                                <Select
                                  value={skillReward.skill?.id.toString() || ""}
                                  onValueChange={(value) => {
                                    const skill = skills.find(s => s.id.toString() === value);
                                    updateStandaloneSkill(skillReward.id, 'skill', skill || null);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={skillsLoading ? "Загрузка..." : "Выберите навык"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {skills.map((skill) => (
                                      <SelectItem key={skill.id} value={skill.id.toString()}>
                                        {skill.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Повышение уровня *</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={skillReward.levelIncrease}
                                  onChange={(e) => updateStandaloneSkill(skillReward.id, 'levelIncrease', parseInt(e.target.value) || 1)}
                                  placeholder="1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
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
                              onChange={(e) => updateArtifactField(artifact.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`artifact-rarity-${artifact.id}`}>Редкость</Label>
                            <Select
                              value={artifact.rarity}
                              onValueChange={(value) => updateArtifactField(artifact.id, "rarity", value as ArtifactRarityEnum)}
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
                            onChange={(e) => updateArtifactField(artifact.id, "description", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`artifact-image-${artifact.id}`}>Изображение артефакта</Label>
                          <div className="flex items-center gap-3">
                            <Input
                              id={`artifact-image-${artifact.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(artifact.id, file);
                                }
                              }}
                              disabled={uploadingImages[artifact.id]}
                              className="flex-1"
                            />
                            {uploadingImages[artifact.id] && (
                              <span className="text-xs text-muted-foreground">Загрузка...</span>
                            )}
                            {artifact.imageUrl && !uploadingImages[artifact.id] && (
                              <Badge variant="outline" className="text-xs bg-success/10 text-success">
                                ✓ Загружено
                              </Badge>
                            )}
                          </div>
                          {artifact.imageUrl && (
                            <p className="text-xs text-muted-foreground truncate">
                              {artifact.imageUrl}
                            </p>
                          )}
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
                                  updateTaskField(task.id, "isRequired", checked)
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
                                updateTaskField(task.id, "title", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Тип доказательства</Label>
                            <Select
                              onValueChange={(value) =>
                                updateTaskField(
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
                              updateTaskField(task.id, "description", e.target.value)
                            }
                            rows={2}
                          />
                        </div>
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
                  </CardContent>
                </Card>

                {/* Mission Preview */}
                <Card className="card-enhanced bg-gradient-to-br from-primary/5 to-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-rewards-amber" />
                      Предварительный просмотр изменений
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
                     {competencyRewards.filter(cr => cr.competency).length > 0 && (
                       <div>
                         <strong>Компетенции:</strong>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {competencyRewards
                             .filter(cr => cr.competency)
                             .map((cr) => (
                               <Badge
                                 key={cr.id}
                                 variant="secondary"
                                 className="text-xs"
                               >
                                 {cr.competency!.name} (+{cr.levelIncrease})
                               </Badge>
                             ))}
                         </div>
                       </div>
                     )}
                     {standaloneSkillRewards.filter(sr => sr.skill).length > 0 && (
                       <div>
                         <strong>Отдельные навыки:</strong>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {standaloneSkillRewards
                             .filter(sr => sr.skill)
                             .map((sr) => (
                               <Badge
                                 key={sr.id}
                                 variant="secondary"
                                 className="text-xs"
                               >
                                 {sr.skill!.name} (+{sr.levelIncrease})
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
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        <strong>ID миссии:</strong> {mission.id}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleUpdateMission}
                    disabled={isUpdating}
                    className="w-full bg-primary hover:bg-primary-600 text-white disabled:opacity-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isUpdating ? "Обновление..." : "Обновить миссию"}
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
