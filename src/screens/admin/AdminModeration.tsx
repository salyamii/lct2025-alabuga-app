import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
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
  Navigation
} from "lucide-react";

export function AdminModeration() {
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [missionFilter, setMissionFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const submissions = [
    {
      id: "1",
      user: "Elena Volkov",
      mission: "Smart Factory IoT Setup",
      step: "Equipment Photo",
      type: "photo",
      status: "pending",
      submittedAt: "2024-12-15 14:30",
      riskScore: "low",
      content: {
        photos: ["/submission-1.jpg", "/submission-2.jpg"],
        description: "Completed IoT sensor installation on production line A. All sensors are now connected and sending data to the monitoring dashboard.",
        location: { lat: 55.7558, lng: 49.1221, name: "Factory Floor - Zone A" },
        exif: { camera: "iPhone 14", timestamp: "2024-12-15T14:28:33Z", gps: true },
        deviceIntegrity: "verified"
      },
      flagged: false
    },
    {
      id: "2", 
      user: "Mikhail Petrov",
      mission: "Safety Protocol Training",
      step: "Emergency QR Scan",
      type: "qr",
      status: "pending",
      submittedAt: "2024-12-15 13:45",
      riskScore: "medium",
      content: {
        qrCode: "SF-SAFETY-2024-001",
        qrPayload: { type: "emergency_drill", location: "assembly_point_b", timestamp: "2024-12-15T13:45:12Z" },
        description: "Scanned safety checkpoint QR codes during emergency drill",
        location: { lat: 55.7520, lng: 49.1180, name: "Emergency Assembly Point B" },
        deviceIntegrity: "flagged"
      },
      flagged: true
    },
    {
      id: "3",
      user: "Anna Kozlova", 
      mission: "Lean Manufacturing Assessment",
      step: "Configuration Entry",
      type: "config",
      status: "pending", 
      submittedAt: "2024-12-15 12:15",
      riskScore: "low",
      content: {
        configCode: "LEAN_PARAMS: efficiency=0.85, waste_reduction=12%, cycle_time=45s",
        description: "Optimized production line parameters following lean principles assessment",
        notes: "Achieved 12% waste reduction by implementing 5S methodology",
        location: { lat: 55.7495, lng: 49.1305, name: "Production Line 3" },
        deviceIntegrity: "verified"
      },
      flagged: false
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo": return Camera;
      case "qr": return QrCode; 
      case "config": return Code;
      case "location": return MapPin;
      default: return Camera;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-emerald-100 text-emerald-700";
      case "medium": return "bg-amber-100 text-amber-700"; 
      case "high": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleAccept = (submissionId: string) => {
    toast.success("Отправка принята");
    const currentIndex = submissions.findIndex(s => s.id === submissionId);
    if (currentIndex < submissions.length - 1) {
      setSelectedSubmission(submissions[currentIndex + 1]);
    }
  };

  const handleReturn = (submissionId: string, reason: string) => {
    toast.success("Отправка возвращена на доработку");
    const currentIndex = submissions.findIndex(s => s.id === submissionId);
    if (currentIndex < submissions.length - 1) {
      setSelectedSubmission(submissions[currentIndex + 1]);
    }
  };

  const handleReject = (submissionId: string) => {
    toast.success("Отправка отклонена, пользователь отмечен");
    const currentIndex = submissions.findIndex(s => s.id === submissionId);
    if (currentIndex < submissions.length - 1) {
      setSelectedSubmission(submissions[currentIndex + 1]);
    }
  };

  const handleBulkAccept = () => {
    toast.success(`${selectedSubmissions.length} отправок принято`);
    setSelectedSubmissions([]);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    const matchesType = typeFilter === "all" || submission.type === typeFilter;
    const matchesMission = missionFilter === "all" || submission.mission.toLowerCase().includes(missionFilter.toLowerCase());
    const matchesRisk = riskFilter === "all" || submission.riskScore === riskFilter;
    return matchesStatus && matchesType && matchesMission && matchesRisk;
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Очередь модерации</h2>
          <p className="text-sm text-muted-foreground">Проверка доказательств выполнения миссий</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            {submissions.filter(s => s.status === "pending").length} На проверке
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {submissions.filter(s => s.riskScore === "high").length} Высокий риск
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-10" />
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
          <div className="space-y-2 overflow-auto max-h-[600px]">
            {filteredSubmissions.map((submission) => {
              const TypeIcon = getTypeIcon(submission.type);
              const isSelected = selectedSubmission?.id === submission.id;
              
              return (
                <Card 
                  key={submission.id} 
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {submission.user.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm truncate">{submission.user}</span>
                        {submission.flagged && (
                          <Flag className="w-3 h-3 text-orange-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {submission.mission}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {submission.step}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {submission.submittedAt.split(' ')[1]}
                        </span>
                        <Badge variant="outline" className={getRiskColor(submission.riskScore)}>
                          {submission.riskScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredSubmissions.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Очередь пуста</p>
                <p className="text-sm">Все отправки проверены</p>
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
                  <h2 className="text-lg font-semibold">{selectedSubmission.mission}</h2>
                  <p className="text-muted-foreground">{selectedSubmission.step}</p>
                </div>
                <Badge className={getRiskColor(selectedSubmission.riskScore)}>
                  {selectedSubmission.riskScore === 'low' ? 'низкий' : selectedSubmission.riskScore === 'medium' ? 'средний' : 'высокий'} риск
                </Badge>
              </div>

              {/* Media Viewer */}
              {selectedSubmission.content.photos && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Медиа доказательства</h3>
                  <div className="space-y-4">
                    {selectedSubmission.content.photos.map((photo: string, index: number) => (
                      <div key={index} className="relative">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <Camera className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="absolute top-2 right-2 gap-1"
                        >
                          <ZoomIn className="w-3 h-3" />
                          Увеличить
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* QR Code Details */}
              {selectedSubmission.content.qrCode && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">QR код</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Код:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {selectedSubmission.content.qrCode}
                      </code>
                    </div>
                    {selectedSubmission.content.qrPayload && (
                      <div>
                        <span className="text-sm text-muted-foreground">Данные:</span>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(selectedSubmission.content.qrPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* EXIF/Metadata */}
              {selectedSubmission.content.exif && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">EXIF данные</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Устройство:</span>
                      <p className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        {selectedSubmission.content.exif.camera}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Временная метка:</span>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedSubmission.content.exif.timestamp}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPS:</span>
                      <p className="flex items-center gap-1">
                        {selectedSubmission.content.exif.gps ? (
                          <><Navigation className="w-3 h-3 text-emerald-500" /> Включен</>
                        ) : (
                          <><Navigation className="w-3 h-3 text-muted-foreground" /> Выключен</>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Целостность:</span>
                      <p className="flex items-center gap-1">
                        {selectedSubmission.content.deviceIntegrity === "verified" ? (
                          <><Wifi className="w-3 h-3 text-emerald-500" /> Проверено</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3 text-amber-500" /> Отмечено</>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Location */}
              {selectedSubmission.content.location && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Местоположение</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedSubmission.content.location.name}</span>
                    </div>
                    <div className="h-32 bg-muted/30 rounded flex items-center justify-center">
                      <div className="text-center text-muted-foreground text-sm">
                        <MapPin className="w-6 h-6 mx-auto mb-1" />
                        <p>Карта: {selectedSubmission.content.location.lat}, {selectedSubmission.content.location.lng}</p>
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
                    <span className="text-muted-foreground">Миссия:</span>
                    <p>{selectedSubmission.mission}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Шаг:</span>
                    <p>{selectedSubmission.step}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Пользователь:</span>
                    <p className="flex items-center gap-2">
                      {selectedSubmission.user}
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Профиль 360
                      </Button>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Описание:</span>
                    <p>{selectedSubmission.content.description}</p>
                  </div>
                </div>
              </Card>

              {/* Decision Panel */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Решение</h3>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleAccept(selectedSubmission.id)}
                    className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="w-4 h-4" />
                    Принять
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleReturn(selectedSubmission.id, "Требуется доработка")}
                    className="flex-1 gap-2"
                  >
                    <X className="w-4 h-4" />
                    Вернуть
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="flex-1 gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Отклонить
                  </Button>
                </div>

                {/* Return Reasons */}
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-muted-foreground">Быстрые причины возврата:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Плохое качество изображения", "Отсутствуют данные геолокации", "Неверная временная метка", "Недостаточно доказательств"].map((reason) => (
                      <Button 
                        key={reason}
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReturn(selectedSubmission.id, reason)}
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
                <h3 className="font-medium mb-2">Отправка не выбрана</h3>
                <p className="text-sm">Выберите отправку из очереди для проверки</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

