import React from 'react';
import { useAuthContext } from '../api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const MainContent: React.FC = () => {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Успешная авторизация!</CardTitle>
          <CardDescription>
            Вы успешно вошли в систему Alabuga Talents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Данные пользователя:</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Логин:</span> {user?.login}</p>
              <p><span className="font-medium">Имя:</span> {user?.firstName} {user?.lastName}</p>
              <p><span className="font-medium">Роль:</span> 
                <Badge variant="secondary" className="ml-2">
                  {user?.role?.toUpperCase()}
                </Badge>
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="w-full"
          >
            Выйти из системы
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainContent;
