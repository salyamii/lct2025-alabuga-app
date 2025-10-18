import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Check,
  X,
  AlertTriangle,
  Eye,
  Camera,
  MapPin,
  QrCode,
  Code,
  Clock,
  Flag,
  ZoomIn,
  ExternalLink,
  Smartphone,
  Wifi,
  Navigation,
} from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { UserMission, User } from "../../domain";

// Функция для форматирования даты в читаемый формат
const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Moscow'
  });
};

// Функция для форматирования QR payload с читаемой датой
const formatQrPayload = (payload: any): any => {
  if (!payload) return payload;
  
  const formatted = { ...payload };
  if (formatted.timestamp) {
    formatted.timestamp = formatDateTime(formatted.timestamp);
  }
  return formatted;
};

interface AdminModerationProps {
  handleFetchAllUsers: () => Promise<void>;
  handleFetchUserMissionsByLogin: (userLogin: string) => Promise<UserMission[]>;
  handleApproveUserMission: (
    missionId: number,
    userLogin: string
  ) => Promise<void>;
  onUserPreviewOpen: (userLogin: string) => void;
}

export function AdminModeration({
  handleFetchAllUsers,
  handleFetchUserMissionsByLogin,
  handleApproveUserMission,
  onUserPreviewOpen,
}: AdminModerationProps) {
  const { allUsers } = useUserStore();
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<{
    mission: UserMission;
    user: User;
  } | null>(null);
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);
  const [pendingMissions, setPendingMissions] = useState<
    Array<{ mission: UserMission; user: User }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Загружаем миссии кандидатов при монтировании компонента
  useEffect(() => {
    loadPendingMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPendingMissions = async () => {
    setIsLoadingMissions(true);
    try {
      // Загружаем всех пользователей
      await handleFetchAllUsers();

      // Фильтруем только кандидатов
      const candidates = allUsers.filter(
        (user) => user.role.toLowerCase() !== "hr" && user.role.toLowerCase() !== "admin"
      );

      // Загружаем миссии для каждого кандидата
      const missionsWithUsers: Array<{ mission: UserMission; user: User }> = [];

      for (const candidate of candidates) {
        console.log('🔍 Candidate:', candidate.login, candidate.role);
        try {
          const userMissions = await handleFetchUserMissionsByLogin(
            candidate.login
          );
          // Фильтруем только завершенные, но не одобренные миссии
          const pendingMissions = userMissions.filter(
            (mission) => mission.isCompleted && !mission.isApproved
          );

          // Добавляем миссии с информацией о пользователе
          pendingMissions.forEach((mission) => {
            missionsWithUsers.push({ mission, user: candidate });
          });
        } catch (error) {
          console.error(
            `Ошибка загрузки миссий для ${candidate.login}:`,
            error
          );
        }
      }

      setPendingMissions(missionsWithUsers);
    } catch (error) {
      console.error("Ошибка загрузки миссий:", error);
      toast.error("Не удалось загрузить миссии для модерации");
    } finally {
      setIsLoadingMissions(false);
    }
  };

  // Генерируем моковые данные для каждой миссии
  const getMockData = (missionId: number) => {
    const types = ["photo", "qr", "config", "location"];
    const riskScores = ["low", "medium", "high"];
    const cameras = [
      "iPhone 14",
      "Samsung Galaxy S23",
      "Google Pixel 7",
      "OnePlus 11",
    ];
    const locations = [
      { lat: 55.7558, lng: 49.1221, name: "Цех A - Зона производства" },
      { lat: 55.752, lng: 49.118, name: "Сборочная точка B" },
      { lat: 55.7495, lng: 49.1305, name: "Производственная линия 3" },
      { lat: 55.758, lng: 49.125, name: "Склад готовой продукции" },
    ];

    // Используем ID миссии как seed для консистентности
    const seed = missionId;
    const type = types[seed % types.length];
    const riskScore = riskScores[seed % riskScores.length];
    const camera = cameras[seed % cameras.length];
    const location = locations[seed % locations.length];
    const flagged = seed % 3 === 0; // 33% шанс быть отмеченным

    return {
      type,
      riskScore,
      flagged,
      content: {
        photos:
          type === "photo"
            ? ["/submission-1.jpg", "/submission-2.jpg"]
            : undefined,
        qrCode:
          type === "qr"
            ? `SF-SAFETY-2024-${String(missionId).padStart(3, "0")}`
            : undefined,
        qrPayload:
          type === "qr"
            ? {
                type: "emergency_drill",
                location: "assembly_point_b",
                timestamp: new Date().toISOString(),
              }
            : undefined,
        configCode:
          type === "config"
            ? `LEAN_PARAMS: efficiency=0.85, waste_reduction=12%, cycle_time=45s`
            : undefined,
        description:
          "Описание выполнения миссии с детальным отчетом о проделанной работе",
        location,
        exif: {
          camera,
          timestamp: new Date().toISOString(),
          gps: true,
        },
        deviceIntegrity: flagged ? "flagged" : "verified",
      },
    };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo":
        return Camera;
      case "qr":
        return QrCode;
      case "config":
        return Code;
      case "location":
        return MapPin;
      default:
        return Camera;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-100 text-emerald-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApproveMission = async () => {
    if (!selectedSubmission) return;

    try {
      await handleApproveUserMission(
        selectedSubmission.mission.id,
        selectedSubmission.user.login
      );
      toast.success("Миссия успешно подтверждена");

      // Удаляем миссию из локального списка
      setPendingMissions(prev => 
        prev.filter(item => 
          !(item.mission.id === selectedSubmission.mission.id && 
            item.user.login === selectedSubmission.user.login)
        )
      );

      // Сбрасываем выбранную миссию
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Ошибка подтверждения миссии:", error);
      toast.error("Не удалось подтвердить миссию");
    }
  };

  const handleReturn = (reason: string) => {
    toast.success(`Миссия возвращена на доработку: ${reason}`);
    // Сбрасываем выбранную миссию
    setSelectedSubmission(null);
    // Здесь можно добавить логику для возврата миссии
  };

  const handleReject = () => {
    toast.success("Миссия отклонена");
    // Сбрасываем выбранную миссию
    setSelectedSubmission(null);
    // Здесь можно добавить логику для отклонения миссии
  };

  const handleBulkAccept = async () => {
    if (selectedSubmissions.length === 0) return;
    
    try {
      // Здесь можно добавить логику для пакетного подтверждения
      // Пока что просто удаляем из локального списка
      setPendingMissions(prev => 
        prev.filter(item => 
          !selectedSubmissions.includes(`${item.user.login}-${item.mission.id}`)
        )
      );
      
      toast.success(`${selectedSubmissions.length} отправок принято`);
      setSelectedSubmissions([]);
    } catch (error) {
      console.error("Ошибка пакетного подтверждения:", error);
      toast.error("Не удалось подтвердить миссии");
    }
  };

  // Фильтрация миссий
  const filteredMissions = useMemo(() => {
    let filtered = pendingMissions;

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ({ mission, user }) =>
          mission.title.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query) ||
          user.login.toLowerCase().includes(query)
      );
    }

    // Фильтр по типу (используем моковые данные)
    if (typeFilter !== "all") {
      filtered = filtered.filter(({ mission }) => {
        const mockData = getMockData(mission.id);
        return mockData.type === typeFilter;
      });
    }

    // Фильтр по риску (используем моковые данные)
    if (riskFilter !== "all") {
      filtered = filtered.filter(({ mission }) => {
        const mockData = getMockData(mission.id);
        return mockData.riskScore === riskFilter;
      });
    }

    return filtered;
  }, [pendingMissions, searchQuery, typeFilter, riskFilter]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Очередь модерации</h2>
          <p className="text-sm text-muted-foreground">
            Проверка доказательств выполнения миссий
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            {pendingMissions.length} На проверке
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {
              pendingMissions.filter(({ mission }) => {
                const mockData = getMockData(mission.id);
                return mockData.riskScore === "high";
              }).length
            }{" "}
            Высокий риск
          </Badge>
          <Button variant="outline" size="sm" onClick={handleBulkAccept}>
            Пакетное принятие
          </Button>
        </div>
      </div>

      {/* Split view layout */}
      <div className="flex gap-6">
        {/* Left Queue */}
        <div className="w-96 space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  placeholder="Поиск по названию миссии или пользователю..."
                  className="pl-9 truncate"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="photo">Фото</SelectItem>
                    <SelectItem value="qr">QR код</SelectItem>
                    <SelectItem value="config">Конфигурация</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Риск" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Queue List */}
          <div className="space-y-2 overflow-auto max-h-[600px] pr-4">
            {isLoadingMissions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Загрузка миссий...</div>
              </div>
            ) : (
              filteredMissions.map(({ mission, user }) => {
                const mockData = getMockData(mission.id);
                const TypeIcon = getTypeIcon(mockData.type);
                const isSelected =
                  selectedSubmission?.mission.id === mission.id &&
                  selectedSubmission?.user.login === user.login;

                return (
                  <div
                    key={`${user.login}-${mission.id}`}
                    className={`p-3 cursor-pointer transition-all duration-200 rounded-xl border ${
                      isSelected
                        ? "ring-1 ring-primary bg-primary/10 border-primary shadow-md outline-none"
                        : "hover:bg-muted/50 border-border hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedSubmission({ mission, user })}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-br from-primary to-primary/80 shadow-lg scale-105"
                            : "bg-gradient-to-br from-primary to-info"
                        }`}
                      >
                        <span className="text-white font-semibold text-sm">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TypeIcon className="w-4 h-4 text-muted-foreground" />
                          <span
                            className={`font-medium text-sm truncate ${
                              isSelected ? "text-primary" : ""
                            }`}
                          >
                            {user.fullName}
                          </span>
                          {mockData.flagged && (
                            <Flag className="w-3 h-3 text-orange-500" />
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {mission.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          ID: {mission.id}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date().toLocaleTimeString()}
                          </span>
                          <Badge
                            variant="outline"
                            className={getRiskColor(mockData.riskScore)}
                          >
                            {mockData.riskScore === "low"
                              ? "низкий"
                              : mockData.riskScore === "medium"
                              ? "средний"
                              : "высокий"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!isLoadingMissions && filteredMissions.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Очередь пуста</p>
                <p className="text-sm">Все миссии проверены</p>
              </div>
            </Card>
          )}
        </div>

        <Separator orientation="vertical" className="h-auto" />

        {/* Right Detail */}
        <div className="flex-1">
          {selectedSubmission ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedSubmission.mission.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedSubmission.user.fullName}
                  </p>
                </div>
                <Badge
                  className={getRiskColor(
                    getMockData(selectedSubmission.mission.id).riskScore
                  )}
                >
                  {getMockData(selectedSubmission.mission.id).riskScore ===
                  "low"
                    ? "низкий"
                    : getMockData(selectedSubmission.mission.id).riskScore ===
                      "medium"
                    ? "средний"
                    : "высокий"}{" "}
                  риск
                </Badge>
              </div>

              {/* Media Viewer */}
              {getMockData(selectedSubmission.mission.id).content.photos && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Медиа доказательства</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {getMockData(
                      selectedSubmission.mission.id
                    ).content.photos?.map((photo: string, index: number) => (
                      <div key={index} className="relative">
                        <div 
                          className="aspect-square w-full bg-muted rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => {
                            // TODO: Реализовать увеличение фотографии
                          }}
                        >
                          <Camera className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* QR Code Details */}
              {getMockData(selectedSubmission.mission.id).content.qrCode && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">QR код</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Код:
                      </span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {
                          getMockData(selectedSubmission.mission.id).content
                            .qrCode
                        }
                      </code>
                    </div>
                    {getMockData(selectedSubmission.mission.id).content
                      .qrPayload && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Данные:
                        </span>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(
                            formatQrPayload(
                              getMockData(selectedSubmission.mission.id).content
                                .qrPayload
                            ),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* EXIF/Metadata */}
              {getMockData(selectedSubmission.mission.id).content.exif && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">EXIF данные</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Устройство:</span>
                      <p className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        {
                          getMockData(selectedSubmission.mission.id).content
                            .exif.camera
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Временная метка:
                      </span>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(
                          getMockData(selectedSubmission.mission.id).content
                            .exif.timestamp
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPS:</span>
                      <p className="flex items-center gap-1">
                        {getMockData(selectedSubmission.mission.id).content.exif
                          .gps ? (
                          <>
                            <Navigation className="w-3 h-3 text-emerald-500" />{" "}
                            Включен
                          </>
                        ) : (
                          <>
                            <Navigation className="w-3 h-3 text-muted-foreground" />{" "}
                            Выключен
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Целостность:
                      </span>
                      <p className="flex items-center gap-1">
                        {getMockData(selectedSubmission.mission.id).content
                          .deviceIntegrity === "verified" ? (
                          <>
                            <Wifi className="w-3 h-3 text-emerald-500" />{" "}
                            Проверено
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-500" />{" "}
                            Отмечено
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Location */}
              {getMockData(selectedSubmission.mission.id).content.location && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Местоположение</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {
                          getMockData(selectedSubmission.mission.id).content
                            .location.name
                        }
                      </span>
                    </div>
                    <div className="h-32 bg-muted/30 rounded flex items-center justify-center">
                      <div className="text-center text-muted-foreground text-sm">
                        <MapPin className="w-6 h-6 mx-auto mb-1" />
                        <p>
                          Карта:{" "}
                          {
                            getMockData(selectedSubmission.mission.id).content
                              .location.lat
                          }
                          ,{" "}
                          {
                            getMockData(selectedSubmission.mission.id).content
                              .location.lng
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Context */}
              <Card className="p-4">
                <h3 className="font-medium mb-3">Контекст</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Название миссии:
                    </span>
                    <p>{selectedSubmission.mission.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Кандидат:</span>
                    <p className="flex items-center gap-2">
                      {selectedSubmission.user.fullName}
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={() =>
                          onUserPreviewOpen(selectedSubmission.user.login)
                        }
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Посмотреть профиль
                      </Button>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Описание миссии:
                    </span>
                    <p>{selectedSubmission.mission.description}</p>
                  </div>
                </div>
              </Card>

              {/* Decision Panel */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Решение</h3>
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    onClick={handleApproveMission}
                    className="flex-1 gap-2 !bg-emerald-600 hover:!bg-emerald-700 !text-white !border-emerald-600"
                  >
                    <Check className="w-4 h-4" />
                    Подтвердить
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleReturn("Требуется доработка")}
                    className="flex-1 gap-2"
                  >
                    <X className="w-4 h-4" />
                    Вернуть
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    className="flex-1 gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Отклонить
                  </Button>
                </div>

                {/* Return Reasons */}
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Быстрые причины возврата:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Плохое качество изображения",
                      "Отсутствуют данные геолокации",
                      "Неверная временная метка",
                      "Недостаточно доказательств",
                    ].map((reason) => (
                      <Button
                        key={reason}
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturn(reason)}
                      >
                        {reason}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Миссия не выбрана</h3>
                <p className="text-sm">
                  Выберите миссию из очереди для проверки
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
