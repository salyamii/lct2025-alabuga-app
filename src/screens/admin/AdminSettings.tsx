import { TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Store, Zap, Award, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface AdminSettingsProps {
    handleCreateReward: () => void;
    handleCreateBadge: () => void;
    handleManageStore: () => void;
}

export function AdminSettings({ handleCreateReward, handleCreateBadge, handleManageStore }: AdminSettingsProps) {
    return (
        <div>
            <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Настройки платформы</h2>
              <p className="text-sm text-muted-foreground">
                Настройка системных предпочтений и политик
              </p>
            </div>

            {/* Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                onClick={handleCreateReward}
                className="h-20 bg-rewards-amber hover:bg-rewards-amber/90 text-white flex-col"
              >
                <Store className="w-6 h-6 mb-2" />
                Создать награду
              </Button>
              <Button
                onClick={handleCreateBadge}
                className="h-20 bg-info hover:bg-info/90 text-white flex-col"
              >
                <Award className="w-6 h-6 mb-2" />
                Создать значок
              </Button>
              <Button
                onClick={handleManageStore}
                className="h-20 bg-primary hover:bg-primary-600 text-white flex-col"
              >
                <Zap className="w-6 h-6 mb-2" />
                Управление магазином
              </Button>
              <Button className="h-20 bg-success hover:bg-success/90 text-white flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Аналитика
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Общие настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Регистрация пользователей</h4>
                      <p className="text-sm text-muted-foreground">
                        Разрешить регистрацию новых пользователей
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Включено
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Авто-одобрение миссий</h4>
                      <p className="text-sm text-muted-foreground">
                        Автоматически одобрять отправленные миссии
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Отключено
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Система уведомлений</h4>
                      <p className="text-sm text-muted-foreground">
                        Отправлять уведомления пользователям
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Включено
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Метрики платформы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Ежедневные активные пользователи
                    </span>
                    <span className="font-mono text-sm">847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Миссии завершены сегодня</span>
                    <span className="font-mono text-sm">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Среднее время сессии</span>
                    <span className="font-mono text-sm">24м</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Состояние системы</span>
                    <Badge
                      variant="default"
                      className="text-xs bg-success text-white"
                    >
                      Здоровая
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
    );
}