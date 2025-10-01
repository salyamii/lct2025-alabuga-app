import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { X, Plus, Trash2, Award, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { useOverlayStore } from "../../stores/useOverlayStore";
import { useUserStore } from "../../stores/useUserStore";
import { useArtifactStore } from "../../stores/useArtifactStore";
import { useCompetencyStore } from "../../stores/useCompetencyStore";
import { useSkillStore } from "../../stores/useSkillStore";
import { User, Artifact, Competency, Skill, UserCompetency } from "../../domain";
import { Skeleton } from "../../components/ui/skeleton";

export function UserEditDrawer() {
  const { userEditOpen, closeUserEdit, selectedUserLogin } = useOverlayStore();
  const { 
    fetchUser,
    updateUserByLogin,
    addArtifactToUser, 
    removeArtifactFromUser,
    addCompetencyToUser,
    updateUserCompetencyLevel,
    removeCompetencyFromUser,
    addSkillToUser,
    updateUserSkillLevel,
    removeSkillFromUser
  } = useUserStore();
  const { artifacts, fetchArtifacts } = useArtifactStore();
  const { competencies, fetchCompetencies } = useCompetencyStore();
  const { skills, fetchSkills } = useSkillStore();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    rankId: 0,
    xp: 0,
    mana: 0,
  });

  // Загрузка данных при открытии дравера
  useEffect(() => {
    if (userEditOpen && selectedUserLogin) {
      loadData();
    } else {
      // Сброс при закрытии
      setUser(null);
      setFormData({ 
        firstName: "", 
        lastName: "", 
        password: "",
        rankId: 0,
        xp: 0,
        mana: 0,
      });
    }
  }, [userEditOpen, selectedUserLogin]);

  const loadData = async () => {
    if (!selectedUserLogin) return;

    setIsLoading(true);
    try {
      // Загружаем данные пользователя
      const userData = await fetchUser(selectedUserLogin);
      setUser(userData);
      
      if (userData) {
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: "",
          rankId: userData.rankId,
          xp: userData.xp,
          mana: userData.mana,
        });
      }

      // Загружаем справочники
      await Promise.all([
        fetchArtifacts(),
        fetchCompetencies(),
        fetchSkills(),
      ]);
    } catch (error) {
      toast.error('Не удалось загрузить данные пользователя');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUser(null);
    setFormData({ 
      firstName: "", 
      lastName: "", 
      password: "",
      rankId: 0,
      xp: 0,
      mana: 0,
    });
    closeUserEdit();
  };

  const handleUpdateBasicInfo = async () => {
    if (!user || !selectedUserLogin) return;

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        rankId: formData.rankId,
        exp: formData.xp,
        mana: formData.mana,
      };

      // Добавляем пароль только если он был введен
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      await updateUserByLogin(selectedUserLogin, updateData);
      toast.success('Базовая информация обновлена');
      
      // Перезагружаем данные пользователя
      await loadData();
    } catch (error) {
      toast.error('Не удалось обновить информацию');
    }
  };

  // Управление артефактами
  const handleAddArtifact = async (artifactId: number) => {
    if (!user) return;

    try {
      await addArtifactToUser(user.login, artifactId);
      toast.success('Артефакт добавлен');
      await loadData();
    } catch (error) {
      console.error('Ошибка добавления артефакта:', error);
      toast.error('Не удалось добавить артефакт');
    }
  };

  const handleRemoveArtifact = async (artifactId: number) => {
    if (!user) return;

    try {
      await removeArtifactFromUser(user.login, artifactId);
      toast.success('Артефакт удален');
      await loadData();
    } catch (error) {
      console.error('Ошибка удаления артефакта:', error);
      toast.error('Не удалось удалить артефакт');
    }
  };

  // Управление компетенциями
  const handleAddCompetency = async (competencyId: number, level: number) => {
    if (!user) return;

    try {
      await addCompetencyToUser(user.login, competencyId, level);
      toast.success('Компетенция добавлена');
      await loadData();
    } catch (error) {
      console.error('Ошибка добавления компетенции:', error);
      toast.error('Не удалось добавить компетенцию');
    }
  };

  const handleUpdateCompetencyLevel = async (competencyId: number, level: number) => {
    if (!user) return;

    try {
      await updateUserCompetencyLevel(user.login, competencyId, level);
      toast.success('Уровень компетенции обновлен');
      await loadData();
    } catch (error) {
      console.error('Ошибка обновления компетенции:', error);
      toast.error('Не удалось обновить уровень компетенции');
    }
  };

  const handleRemoveCompetency = async (competencyId: number) => {
    if (!user) return;

    try {
      await removeCompetencyFromUser(user.login, competencyId);
      toast.success('Компетенция удалена');
      await loadData();
    } catch (error) {
      console.error('Ошибка удаления компетенции:', error);
      toast.error('Не удалось удалить компетенцию');
    }
  };

  // Управление навыками
  const handleAddSkill = async (competencyId: number, skillId: number, level: number) => {
    if (!user) return;

    try {
      await addSkillToUser(user.login, competencyId, skillId, level);
      toast.success('Навык добавлен');
      await loadData();
    } catch (error) {
      console.error('Ошибка добавления навыка:', error);
      toast.error('Не удалось добавить навык');
    }
  };

  const handleUpdateSkillLevel = async (competencyId: number, skillId: number, level: number) => {
    if (!user) return;

    try {
      await updateUserSkillLevel(user.login, competencyId, skillId, level);
      toast.success('Уровень навыка обновлен');
      await loadData();
    } catch (error) {
      console.error('Ошибка обновления навыка:', error);
      toast.error('Не удалось обновить уровень навыка');
    }
  };

  const handleRemoveSkill = async (competencyId: number, skillId: number) => {
    if (!user) return;

    try {
      await removeSkillFromUser(user.login, competencyId, skillId);
      toast.success('Навык удален');
      await loadData();
    } catch (error) {
      console.error('Ошибка удаления навыка:', error);
      toast.error('Не удалось удалить навык');
    }
  };

  // Доступные для добавления артефакты
  const availableArtifacts = artifacts.filter(
    art => !user?.artifacts.some(uArt => uArt.id === art.id)
  );

  // Доступные для добавления компетенции
  const availableCompetencies = competencies.filter(
    comp => !user?.competencies.some(uComp => uComp.id === comp.id)
  );

  return (
    <Drawer open={userEditOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Редактирование пользователя</DrawerTitle>
              <DrawerDescription>
                {user ? `${user.fullName} (${user.login})` : 'Загрузка...'}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : user ? (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="artifacts">Артефакты</TabsTrigger>
                <TabsTrigger value="competencies">Компетенции</TabsTrigger>
                <TabsTrigger value="stats">Статистика</TabsTrigger>
              </TabsList>

              {/* Базовая информация */}
              <TabsContent value="basic" className="space-y-4">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">Базовая информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Логин</Label>
                        <Input value={user.login} disabled />
                      </div>

                      <div className="space-y-2">
                        <Label>Роль</Label>
                        <Input value={user.role} disabled />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Новый пароль
                          <span className="text-xs text-muted-foreground ml-2">(оставьте пустым, чтобы не менять)</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Введите новый пароль"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rankId">ID Ранга</Label>
                        <Input
                          id="rankId"
                          type="number"
                          min="0"
                          value={formData.rankId}
                          onChange={(e) => setFormData({ ...formData, rankId: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="xp">Опыт (XP)</Label>
                        <Input
                          id="xp"
                          type="number"
                          min="0"
                          value={formData.xp}
                          onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mana">Мана</Label>
                        <Input
                          id="mana"
                          type="number"
                          min="0"
                          value={formData.mana}
                          onChange={(e) => setFormData({ ...formData, mana: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <Button onClick={handleUpdateBasicInfo} className="w-full">
                      Сохранить изменения
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Артефакты */}
              <TabsContent value="artifacts" className="space-y-4">
                {/* Текущие артефакты */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Award className="w-4 h-4 inline-block mr-2" />
                      Текущие артефакты ({user.artifacts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.artifacts.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        У пользователя нет артефактов
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {user.artifacts.map((artifact) => (
                          <div
                            key={artifact.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium text-sm">{artifact.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {artifact.rarity}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveArtifact(artifact.id)}
                              className="text-danger hover:text-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Доступные артефакты */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Plus className="w-4 h-4 inline-block mr-2" />
                      Добавить артефакт
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableArtifacts.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Нет доступных артефактов для добавления
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableArtifacts.map((artifact) => (
                          <div
                            key={artifact.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium text-sm">{artifact.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {artifact.rarity}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddArtifact(artifact.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Добавить
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Компетенции */}
              <TabsContent value="competencies" className="space-y-4">
                {/* Текущие компетенции */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Target className="w-4 h-4 inline-block mr-2" />
                      Текущие компетенции ({user.competencies.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.competencies.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        У пользователя нет компетенций
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {user.competencies.map((userComp) => (
                          <Card key={userComp.id} className="border">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{userComp.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Уровень: {userComp.userLevel} / {userComp.maxLevel}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    max={userComp.maxLevel}
                                    value={userComp.userLevel}
                                    onChange={(e) => {
                                      const newLevel = parseInt(e.target.value) || 0;
                                      handleUpdateCompetencyLevel(userComp.id, newLevel);
                                    }}
                                    className="w-20"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCompetency(userComp.id)}
                                    className="text-danger hover:text-danger"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Навыки компетенции */}
                              {userComp.skills.length > 0 && (
                                <>
                                  <Separator />
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground">
                                      Навыки:
                                    </div>
                                    {userComp.skills.map((skill) => (
                                      <div
                                        key={skill.id}
                                        className="flex items-center justify-between p-2 rounded bg-muted/50"
                                      >
                                        <div className="flex-1">
                                          <div className="text-sm">{skill.name}</div>
                                          <div className="text-xs text-muted-foreground">
                                            Уровень: {skill.userLevel} / {skill.maxLevel}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="number"
                                            min="0"
                                            max={skill.maxLevel}
                                            value={skill.userLevel}
                                            onChange={(e) => {
                                              const newLevel = parseInt(e.target.value) || 0;
                                              handleUpdateSkillLevel(userComp.id, skill.id, newLevel);
                                            }}
                                            className="w-16 h-8 text-xs"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveSkill(userComp.id, skill.id)}
                                            className="text-danger hover:text-danger h-8 w-8 p-0"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}

                                    {/* Добавить навык к этой компетенции */}
                                    <div className="pt-2">
                                      <Select
                                        onValueChange={(skillId) => {
                                          handleAddSkill(userComp.id, parseInt(skillId), 0);
                                        }}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="Добавить навык" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {skills
                                            .filter(skill => !userComp.skills.some(s => s.id === skill.id))
                                            .map((skill) => (
                                              <SelectItem key={skill.id} value={skill.id.toString()}>
                                                {skill.name}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Добавить компетенцию */}
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Plus className="w-4 h-4 inline-block mr-2" />
                      Добавить компетенцию
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableCompetencies.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Нет доступных компетенций для добавления
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableCompetencies.map((comp) => (
                          <div
                            key={comp.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{comp.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Макс. уровень: {comp.maxLevel}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddCompetency(comp.id, 0)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Добавить
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Статистика */}
              <TabsContent value="stats" className="space-y-4">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-base">Статистика пользователя</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{user.xp}</div>
                        <div className="text-xs text-muted-foreground">Опыт</div>
                      </div>
                      <div>
                        <Target className="w-8 h-8 mx-auto mb-2 text-info" />
                        <div className="text-2xl font-bold">{user.mana}</div>
                        <div className="text-xs text-muted-foreground">Мана</div>
                      </div>
                      <div>
                        <Award className="w-8 h-8 mx-auto mb-2 text-success" />
                        <div className="text-2xl font-bold">{user.artifacts.length}</div>
                        <div className="text-xs text-muted-foreground">Артефактов</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ранг ID:</span>
                        <span className="font-medium">{user.rankId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Миссий завершено:</span>
                        <span className="font-medium">{user.completedMissionsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Всего миссий:</span>
                        <span className="font-medium">{user.totalMissionsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Компетенций:</span>
                        <span className="font-medium">{user.competencies.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Пользователь не найден
            </div>
          )}
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Закрыть
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

