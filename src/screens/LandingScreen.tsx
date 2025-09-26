import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Rocket, Star, Users, Trophy, ArrowRight, User, Building2, Loader2 } from "lucide-react";
import { useAuthContext } from '../api/context/AuthContext';
import { toast } from '../components/ui/sonner';

export function LandingScreen() {
  const { login: loginUser, registerHR, registerCandidate, loading, error } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRole, setUserRole] = useState<"hr" | "candidate">("candidate");

  // Отображаем ошибки через toast уведомления
  useEffect(() => {
    if (error) {
      let errorMessage = error.message;
      let errorDescription = '';

      // Детализируем ошибки для лучшего понимания
      if (error.status === 0) {
        if (error.code === 'CORS_ERROR') {
          errorMessage = 'CORS ошибка';
          errorDescription = 'Браузер блокирует запросы. Перезапустите dev сервер с прокси.';
        } else if (error.code === 'CONNECTION_REFUSED') {
          errorMessage = 'Соединение отклонено';
          errorDescription = 'Сервер не принимает подключения. Проверьте, что API запущен.';
        } else if (error.code === 'DNS_ERROR') {
          errorMessage = 'Сервер не найден';
          errorDescription = 'Проверьте правильность URL сервера.';
        } else if (error.code === 'TIMEOUT_ERROR') {
          errorMessage = 'Таймаут подключения';
          errorDescription = 'Сервер не отвечает в течение 10 секунд.';
        } else {
          errorMessage = 'Сервер недоступен';
          errorDescription = 'Проверьте подключение к интернету или попробуйте позже';
        }
      } else if (error.status === 401) {
        errorMessage = 'Неверные учетные данные';
        errorDescription = 'Проверьте логин и пароль';
      } else if (error.status === 403) {
        errorMessage = 'Доступ запрещен';
        errorDescription = 'У вас нет прав для выполнения этого действия';
      } else if (error.status === 404) {
        errorMessage = 'Сервис не найден';
        errorDescription = 'API endpoint недоступен';
      } else if (error.status >= 500) {
        errorMessage = 'Ошибка сервера';
        errorDescription = 'Попробуйте позже или обратитесь в поддержку';
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 6000
      });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLogin) {
        // Регистрация с учетом выбранной роли
        if (userRole === "hr") {
          await registerHR({
            login,
            password,
            firstName,
            lastName,
            role: "HR"
          });
          toast.success('Регистрация HR успешна!', {
            description: 'Теперь вы можете войти в систему',
            duration: 4000
          });
        } else {
          await registerCandidate({
            login,
            password,
            firstName,
            lastName
          });
          toast.success('Регистрация кандидата успешна!', {
            description: 'Теперь вы можете войти в систему',
            duration: 4000
          });
        }
      } 
      await loginUser({ login, password });
      toast.success('Успешный вход!', {
        description: 'Добро пожаловать в систему',
        duration: 3000
      });
    } catch (error) {
      // Ошибка уже обрабатывается в контексте и useEffect
      console.error('Ошибка авторизации:', error);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Сбрасываем форму при переключении
    setLogin("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setUserRole("candidate");
  };



  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 cosmic-gradient opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl">Alabuga Talents</h1>
                <p className="text-sm text-muted-foreground">Центр управления космической миссией</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl lg:text-5xl leading-tight">
                Запустите свое
                <span className="block text-primary">Карьерное путешествие</span>
                к звездам
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Присоединяйтесь к игровой платформе обучения, где вы выполняете миссии, 
                зарабатываете артефакты и продвигаетесь по званиям в космическом приключении профессионального роста.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Миссии навыков</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Выполняйте вызовы и повышайте уровень</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-info" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Эскадрильи</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Объединяйтесь с другими пилотами</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-rewards-amber/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-rewards-amber" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Артефакты</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Зарабатывайте значки и награды</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-success" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">Карьерный рост</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Продвигайтесь по званиям</p>
              </div>
            </div>
          </div>

          {/* Right Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md orbital-border">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-lg md:text-xl mb-2">Доступ к центру управления</h3>
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Добро пожаловать обратно, космический путешественник" : "Присоединяйтесь к космическому путешествию"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login">Логин</Label>
                    <Input
                      id="login"
                      type="text"
                      placeholder="cosmic_pilot"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Имя</Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Орион"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Фамилия</Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Стратосферов"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={!isLogin}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Роль</Label>
                        <RadioGroup
                          value={userRole}
                          onValueChange={(value: "hr" | "candidate") => setUserRole(value)}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="candidate" id="candidate" />
                            <Label htmlFor="candidate" className="flex items-center gap-2 cursor-pointer">
                              <User className="w-4 h-4" />
                              Кандидат
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hr" id="hr" />
                            <Label htmlFor="hr" className="flex items-center gap-2 cursor-pointer">
                              <Building2 className="w-4 h-4" />
                              HR-Менеджер
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}


                <Button
                  type="submit"
                  className={`w-full inline-flex items-center justify-center gap-2 ${loading
                    ? 'bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-600 text-white'}`}
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Авторизоваться" : `Начать путешествие как ${userRole === "hr" ? "HR-менеджер" : "Кандидат"}`}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className="text-sm text-primary hover:underline"
                  >
                    {isLogin ? "Новобранец? Зарегистрируйся здесь" : "Уже есть аккаунт? Войти"}
                  </button>
                </div>

                {/* Demo Access */}
                <div className="pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => loginUser({ login: "demo_c", password: "demo_c" })}
                  >
                    Демо-доступ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
