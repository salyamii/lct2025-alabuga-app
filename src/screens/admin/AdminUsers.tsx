import { useState, useEffect, useMemo } from "react";
import { TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Users as UsersIcon, Shield, Code } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Edit, Filter, Eye } from "lucide-react";
import { AdminModeration } from "./AdminModeration";
import { AdminRules } from "./AdminRules";
import { useUserStore } from "../../stores/useUserStore";

interface AdminUsersProps {
  onUserEditOpen: (userLogin: string) => void;
  onUserPreviewOpen: (userLogin: string) => void;
}

export function AdminUsers({ onUserEditOpen, onUserPreviewOpen }: AdminUsersProps) {
  const [usersTab, setUsersTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const { allUsers, fetchAllUsers } = useUserStore();

  useEffect(() => {
    // Загружаем пользователей при открытии компонента
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Фильтруем пользователей по роли (только candidate) и поисковому запросу
  const filteredUsers = useMemo(() => {
    // Сначала фильтруем только кандидатов
    const candidateUsers = allUsers.filter(user => 
      user.role.toLowerCase() === 'candidate'
    );
    
    // Затем применяем поисковый фильтр
    if (!searchQuery.trim()) {
      return candidateUsers;
    }
    
    const query = searchQuery.toLowerCase();
    return candidateUsers.filter(user => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.login.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  // Функция для получения перевода роли
  const getRoleText = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'hr':
        return 'HR';
      case 'candidate':
        return 'Кандидат';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
  };
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
              </div>

              <Card className="card-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Все пользователи ({filteredUsers.length})</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск пользователей..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.login}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{user.fullName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.login}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {getRoleText(user.role)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onUserPreviewOpen(user.login)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onUserEditOpen(user.login)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
