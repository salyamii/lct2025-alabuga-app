import { useState } from "react";
import { TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Plus, Users as UsersIcon, Shield, Code } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { AdminModeration } from "./AdminModeration";
import { AdminRules } from "./AdminRules";

interface AdminUsersProps {
  onUserDetailOpen: (userId: string) => void;
}

export function AdminUsers({ onUserDetailOpen }: AdminUsersProps) {
  const [usersTab, setUsersTab] = useState("users");
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
    <TabsContent value="users" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Управление пользователями</h2>
          <p className="text-sm text-muted-foreground">
            Управление учетными записями, модерация и правила системы
          </p>
        </div>
      </div>

      {/* Users Tabs */}
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {[
              { key: "users", label: "Пользователи", icon: UsersIcon },
              { key: "moderation", label: "Модерация", icon: Shield },
              { key: "rules", label: "Правила", icon: Code },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setUsersTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  usersTab === key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {usersTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Все пользователи</h3>
                  <p className="text-sm text-muted-foreground">
                    Управление учетными записями и правами пользователей
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>

              <Card className="card-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Все пользователи</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск пользователей..."
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтр
                </Button>
              </div>
            </div>
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
                      <p className="text-xs text-muted-foreground">
                        Присоединился {user.joinDate}
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUserDetailOpen(user.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
            </div>
          )}

          {usersTab === "moderation" && (
            <AdminModeration />
          )}

          {usersTab === "rules" && (
            <AdminRules />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
