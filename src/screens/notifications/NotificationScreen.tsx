import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  ArrowLeft,
  Bell,
  Check,
  Trophy,
  Rocket,
  Users,
  Star,
  Clock,
  X,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const notifications = [
    {
      id: "notif-1",
      type: "achievement",
      title: "Значок получен!",
      message:
        "Вы заработали значок 'React Навигатор' за выполнение продвинутых миссий по React",
      timestamp: "2 минуты назад",
      read: false,
      icon: Trophy,
      iconColor: "text-rewards-amber",
    },
    {
      id: "notif-2",
      type: "mission",
      title: "Миссия готова",
      message:
        "Ваша эскадрилья готова запустить 'Протокол навигации галактического флота'",
      timestamp: "15 минут назад",
      read: false,
      icon: Rocket,
      iconColor: "text-primary",
    },
    {
      id: "notif-3",
      type: "mentorship",
      title: "Запрос на наставничество",
      message: "Младший навигатор Сара Чен запросила ваше руководство",
      timestamp: "1 час назад",
      read: false,
      icon: Users,
      iconColor: "text-info",
    },
    {
      id: "notif-4",
      type: "system",
      title: "Обновление сезона",
      message:
        "Новый эпизод 'Космические рубежи' теперь доступен в сезоне 2024-Q1",
      timestamp: "3 часа назад",
      read: true,
      icon: Star,
      iconColor: "text-success",
    },
    {
      id: "notif-5",
      type: "reminder",
      title: "Срок миссии",
      message:
        "Ваша активная миссия 'Оптимизация базы данных' истекает через 2 дня",
      timestamp: "6 часов назад",
      read: true,
      icon: Clock,
      iconColor: "text-warning",
    },
    {
      id: "notif-6",
      type: "achievement",
      title: "Повышение уровня!",
      message: "Поздравляем! Вы повысились до уровня Навигатор 12",
      timestamp: "Вчера",
      read: true,
      icon: Trophy,
      iconColor: "text-rewards-amber",
    },
  ];

  const handleMarkAsRead = (notificationId: string) => {
    // Mark notification as read
    console.log(`Marking notification ${notificationId} as read`);
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    console.log("Marking all notifications as read");
  };

  const handleDeleteNotification = (notificationId: string) => {
    // Delete notification
    console.log(`Deleting notification ${notificationId}`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-rewards-amber/10 border-rewards-amber/20";
      case "mission":
        return "bg-primary/10 border-primary/20";
      case "mentorship":
        return "bg-info/10 border-info/20";
      case "system":
        return "bg-success/10 border-success/20";
      case "reminder":
        return "bg-warning/10 border-warning/20";
      default:
        return "bg-muted";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "achievement":
        return "Достижение";
      case "mission":
        return "Миссия";
      case "mentorship":
        return "Наставничество";
      case "system":
        return "Система";
      case "reminder":
        return "Напоминание";
      default:
        return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 min-w-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4 min-w-0">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-wrap">
                Центр управления
              </h1>
              <p className="text-sm text-muted-foreground text-wrap">
                {unreadCount > 0
                  ? `${unreadCount} непрочитанных уведомлений`
                  : "Все актуально!"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="flex gap-3">
            <Button
              size="sm"
              onClick={handleMarkAllAsRead}
              className="bg-primary hover:bg-primary-600 text-white h-12"
            >
              <Check className="w-4 h-4 mr-2" />
              Отметить все прочитанными
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const IconComponent = notification.icon;

          return (
            <Card
              key={notification.id}
              className={`notification-card ${
                !notification.read
                  ? "orbital-border-enhanced"
                  : "orbital-border"
              } ${getTypeColor(notification.type)}`}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      !notification.read ? "bg-card shadow-sm" : "bg-muted/50"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${notification.iconColor}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 min-w-0">
                          <h3
                            className={`font-semibold text-sm md:text-base text-wrap line-clamp-2 ${
                              !notification.read ? "" : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p
                          className={`text-sm leading-relaxed text-wrap ${
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-danger"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card className="orbital-border">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Нет уведомлений</h3>
            <p className="text-sm text-muted-foreground">
              Вы в курсе всех событий! Проверьте позже для обновлений миссий и
              достижений.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="orbital-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-primary">
              {notifications.filter((n) => n.type === "achievement").length}
            </div>
            <p className="text-xs text-muted-foreground">Достижения</p>
          </CardContent>
        </Card>
        <Card className="orbital-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-info">
              {notifications.filter((n) => n.type === "mission").length}
            </div>
            <p className="text-xs text-muted-foreground">Обновления миссий</p>
          </CardContent>
        </Card>
        <Card className="orbital-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-success">
              {notifications.filter((n) => n.type === "mentorship").length}
            </div>
            <p className="text-xs text-muted-foreground">Наставничество</p>
          </CardContent>
        </Card>
        <Card className="orbital-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono font-bold text-warning">
              {notifications.filter((n) => n.type === "reminder").length}
            </div>
            <p className="text-xs text-muted-foreground">Напоминания</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
