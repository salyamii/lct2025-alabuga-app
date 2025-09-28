import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";   
import { Separator } from "../../components/ui/separator";
import { toast } from "../../components/ui/sonner";
import { User, Palette, Download, Trash2, ArrowLeft, Bell, Zap, Shield, Sun, Moon, Monitor, LogOut } from "lucide-react";
import { useAuthContext } from "../../api";


interface SettingsScreenProps {
    onBack: () => void;
  }
  
  export function SettingsScreen({ onBack }: SettingsScreenProps) {
    const { logout } = useAuthContext();
    
    const handleSaveSettings = () => {
      toast.success("Настройки успешно сохранены! ⚙️");
    };

    const handleLogout = async () => {
      try {
        await logout();
        toast.success("Вы успешно вышли из системы");
      } catch (error) {
        toast.error("Ошибка при выходе из системы");
        console.error("Logout error:", error);
      }
    };
  
    const handleExportData = () => {
      toast.success("Экспорт данных запущен! 📊");
    };
  
    const handleDeleteAccount = () => {
      toast.error("Удаление аккаунта отменено в целях безопасности.");
    };
  
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Настройки полета</h1>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Настройте свой опыт и предпочтения
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Settings */}
          <Card className="orbital-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Настройки профиля
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Отображаемое имя</Label>
                  <Input id="display-name" defaultValue="Капитан Алекс Морган" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call-sign">Позывной</Label>
                  <Input id="call-sign" defaultValue="НАВИГАТОР-47" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squadron">Эскадрилья</Label>
                  <Select defaultValue="alpha">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alpha">Эскадрилья Альфа</SelectItem>
                      <SelectItem value="beta">Эскадрилья Бета</SelectItem>
                      <SelectItem value="gamma">Эскадрилья Гамма</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс</Label>
                  <Select defaultValue="utc+3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc+3">UTC+3 (Москва)</SelectItem>
                      <SelectItem value="utc+0">UTC+0 (Лондон)</SelectItem>
                      <SelectItem value="utc-5">UTC-5 (Нью-Йорк)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Appearance Settings */}
          <Card className="orbital-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5 text-primary" />
                Внешний вид
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Режим темы</Label>
                  <p className="text-sm text-muted-foreground">Выберите предпочитаемую тему</p>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Светлая
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Темная
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Системная
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Уменьшенная анимация</Label>
                  <p className="text-sm text-muted-foreground">Минимизировать анимации для лучшей доступности</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Компактный режим</Label>
                  <p className="text-sm text-muted-foreground">Плотная компоновка для большего контента</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
  
          {/* Notification Settings */}
          <Card className="orbital-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-primary" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Обновления миссий</Label>
                  <p className="text-sm text-muted-foreground">Получать уведомления о прогрессе и завершении миссий</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Заработанные значки</Label>
                  <p className="text-sm text-muted-foreground">Уведомления при получении новых значков</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Активность эскадрильи</Label>
                  <p className="text-sm text-muted-foreground">Обновления от членов вашей эскадрильи</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Запросы на наставничество</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о возможностях наставничества</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email уведомления</Label>
                  <p className="text-sm text-muted-foreground">Получать важные обновления по электронной почте</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
  
          {/* Performance Settings */}
          <Card className="orbital-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-primary" />
                Производительность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Автосинхронизация прогресса</Label>
                  <p className="text-sm text-muted-foreground">Автоматически синхронизировать прогресс между устройствами</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Офлайн режим</Label>
                  <p className="text-sm text-muted-foreground">Кэшировать контент для доступа без интернета</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Фоновая синхронизация</Label>
                  <p className="text-sm text-muted-foreground">Обновлять данные в фоновом режиме</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
  
          {/* Privacy & Security */}
          <Card className="orbital-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" />
                Приватность и безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Публичный профиль</Label>
                  <p className="text-sm text-muted-foreground">Разрешить другим просматривать ваши достижения</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Видимость активности</Label>
                  <p className="text-sm text-muted-foreground">Показывать вашу активность членам эскадрильи</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Аналитика данных</Label>
                  <p className="text-sm text-muted-foreground">Помочь улучшить платформу данными об использовании</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label>Управление данными</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    className="flex-1 sm:flex-none"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт моих данных
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="flex-1 sm:flex-none"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить аккаунт
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Действия с аккаунтом</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти из системы
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Save Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-primary-600 text-white flex-1 sm:flex-none"
            >
                Сохранить настройки
            </Button>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 sm:flex-none"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    );
  }