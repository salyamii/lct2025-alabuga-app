import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Users, Target, BarChart3, Settings } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { TabsContent } from "../../components/ui/tabs";

export function AdminDashboard() {
  const dashboardStats = {
    totalUsers: 1247,
    activeMissions: 23,
    completionRate: 87.3,
    totalMana: 125420,
  };

  const recentUsers = [
    {
      id: "user-1",
      name: "Alex Morgan",
      email: "alex.morgan@company.com",
      rank: "Navigator",
      joinDate: "2024-03-10",
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: "user-2",
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      rank: "Commander",
      joinDate: "2024-02-15",
      lastActive: "1 day ago",
      status: "active",
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      rank: "Cadet",
      joinDate: "2024-03-12",
      lastActive: "3 days ago",
      status: "inactive",
    },
  ];

  return (
    <>
      <TabsContent value="dashboard" className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Всего пользователей
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-info/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-info" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.activeMissions}
              </div>
              <div className="text-sm text-muted-foreground">
                Активные миссии
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Процент завершения
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-rewards-amber/10 rounded-lg mx-auto flex items-center justify-center mb-3">
                <Settings className="w-6 h-6 text-rewards-amber" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {dashboardStats.totalMana.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Всего маны</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Последняя активность пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {user.rank}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </span>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
