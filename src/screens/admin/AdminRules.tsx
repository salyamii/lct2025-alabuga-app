import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { toast } from "sonner";
import {
  Play,
  Save,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  Code
} from "lucide-react";

export function AdminRules() {
  const [simulationInput, setSimulationInput] = useState(`{
  "event": "step_completed",
  "step": {
    "id": "step-1",
    "required": true,
    "accepted": true,
    "proof_type": "photo"
  },
  "mission": {
    "id": "iot-setup",
    "completed_steps": 2,
    "total_steps": 5
  },
  "user": {
    "id": "user-123",
    "level": 4
  }
}`);

  const [simulationOutput, setSimulationOutput] = useState("");
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const rules = [
    {
      id: "rule-1",
      condition: "IF step.required = true AND step.accepted = true",
      effect: "add +50 pts",
      notes: "Стандартные очки за обязательные шаги",
      status: "active"
    },
    {
      id: "rule-2", 
      condition: "IF completed >= 3 of 5",
      effect: "mission.complete = true",
      notes: "Порог частичного завершения",
      status: "active"
    },
    {
      id: "rule-3",
      condition: "IF proof.type = QR AND ttlValid = false",
      effect: 'reject("Expired QR")',
      notes: "Валидация QR кода",
      status: "active"
    },
    {
      id: "rule-4",
      condition: "IF pair.rating < 4",
      effect: "mission.complete = false",
      notes: "Контроль качества менторства",
      status: "draft"
    },
    {
      id: "rule-5",
      condition: "IF mission.complete = true AND badge.eligible = true",
      effect: "issue_badge(mission.badge_id)",
      notes: "Автоматическая выдача бейджа",
      status: "active"
    },
    {
      id: "rule-6",
      condition: "IF user.level >= 5 AND mission.category = 'advanced'",
      effect: "add +bonus_multiplier(1.5)",
      notes: "Бонус для продвинутых пользователей",
      status: "draft"
    }
  ];

  const handleRunSimulation = () => {
    try {
      const input = JSON.parse(simulationInput);
      
      // Simulate rule evaluation
      const output = {
        timestamp: new Date().toISOString(),
        input: input,
        evaluated_rules: [
          {
            rule_id: "rule-1",
            condition: "step.required = true AND step.accepted = true",
            matched: true,
            action: "add +50 pts",
            result: "✓ success",
            execution_time: "2ms"
          },
          {
            rule_id: "rule-2",
            condition: "completed >= 3 of 5", 
            matched: false,
            reason: "✗ только 2 из 5 завершено",
            execution_time: "1ms"
          },
          {
            rule_id: "rule-5",
            condition: "mission.complete = true AND badge.eligible = true",
            matched: false,
            reason: "✗ миссия не завершена",
            execution_time: "1ms"
          }
        ],
        final_state: {
          points_awarded: 50,
          mission_completed: false,
          badges_issued: [],
          next_actions: ["Завершите еще 1 шаг для финиша миссии"]
        },
        performance: {
          total_execution_time: "4ms",
          rules_evaluated: 6,
          rules_matched: 1
        }
      };

      setSimulationOutput(JSON.stringify(output, null, 2));
      toast.success("Симуляция выполнена успешно");
    } catch (error) {
      toast.error("Неверный формат JSON");
      setSimulationOutput(`Ошибка: ${error}`);
    }
  };

  const handleValidate = () => {
    // Simulate validation
    const errors = Math.random() > 0.7; // 30% chance of errors for demo
    setHasValidationErrors(errors);
    
    if (errors) {
      toast.error("Валидация не прошла - проверьте синтаксис правил");
    } else {
      toast.success("Все правила проверены успешно");
    }
  };

  const handlePublish = () => {
    if (hasValidationErrors) {
      toast.error("Исправьте ошибки валидации перед публикацией");
      return;
    }
    
    setIsPublished(true);
    toast.success("Правила успешно опубликованы");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "disabled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Движок правил</h2>
          <p className="text-sm text-muted-foreground">Определение и симуляция логики завершения миссий</p>
        </div>
      </div>

      {/* Top toolbar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleValidate} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Валидировать
            </Button>
            <Button onClick={handleRunSimulation} className="gap-2">
              <Play className="w-4 h-4" />
              Запустить симуляцию
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={hasValidationErrors}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Опубликовать
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Опубликовано" : "Черновик"}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-sm">
                    <p className="font-medium mb-2">Как работают правила?</p>
                    <p className="text-sm">Правила применяются на сервере при возникновении событий. Этот интерфейс - редактор и симулятор для тестирования логики перед развертыванием.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>

      <div className="flex gap-6 min-h-0">
        {/* Left - Rules table */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Таблица правил</h3>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить правило
            </Button>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Условие</TableHead>
                  <TableHead className="w-[35%]">Награда / Эффект</TableHead>
                  <TableHead className="w-[20%]">Заметки</TableHead>
                  <TableHead className="w-[10%]">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="group">
                    <TableCell className="font-mono text-sm p-3">
                      <div className="bg-muted/50 p-2 rounded text-xs leading-relaxed">
                        {rule.condition}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm p-3">
                      <div className="bg-muted/50 p-2 rounded text-xs leading-relaxed">
                        {rule.effect}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground p-3">
                      {rule.notes}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(rule.status)} variant="outline">
                          {rule.status === 'active' ? 'активно' : 'черновик'}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty state */}
            {rules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Code className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Правила не определены</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Создайте первое правило для определения логики завершения миссий и выдачи наград.
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить первое правило
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right - Simulator */}
        <div className="w-96 flex flex-col space-y-4">
          <h3 className="text-base font-semibold">Симулятор</h3>
          
          <Card className="flex-1 flex flex-col p-4">
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm font-medium mb-2 block">JSON события</label>
                <Textarea
                  value={simulationInput}
                  onChange={(e) => setSimulationInput(e.target.value)}
                  className="h-32 font-mono text-xs resize-none"
                  placeholder="Введите JSON события..."
                />
              </div>

              <Button 
                onClick={handleRunSimulation}
                className="w-full gap-2"
              >
                <Play className="w-4 h-4" />
                Запустить симуляцию
              </Button>

              {simulationOutput && (
                <div className="flex-1 min-h-0">
                  <label className="text-sm font-medium mb-2 block">Результат</label>
                  <div className="h-full min-h-48 overflow-auto border rounded p-3 bg-muted/30">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {simulationOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Validation Status */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {hasValidationErrors ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              )}
              <span className="font-medium">
                {hasValidationErrors ? "Ошибки валидации" : "Все правила валидны"}
              </span>
            </div>
            
            {hasValidationErrors ? (
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Правило 4: Неверный синтаксис условия</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Правило 6: Неопределенная переменная 'bonus_multiplier'</span>
                </li>
              </ul>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Готово к публикации
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Всего правил:</span>
                    <span>{rules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Активных:</span>
                    <span>{rules.filter(r => r.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Черновиков:</span>
                    <span>{rules.filter(r => r.status === 'draft').length}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

