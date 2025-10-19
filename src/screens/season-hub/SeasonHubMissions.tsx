import { Target, CheckCircle, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible";
import { MissionCard } from "./MissionCard";
import { Season } from "../../domain/season";
import { Mission, UserMission } from "../../domain";
import { useRankStore } from "../../stores/useRankStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";
import { useState } from "react";

export interface SeasonHubMissionsProps {
    currentSeason: Season | null;
    missions: Mission[];  // Миссии сезона из useMissionStore
    userRankId: number;
    userMissions: UserMission[];
    onMissionLaunch: (missionId: number) => void;
    onMissionDetails: (missionId: number) => void;
}

export function SeasonHubMissions({ currentSeason, missions, userRankId, userMissions, onMissionLaunch, onMissionDetails }: SeasonHubMissionsProps) {
    const { ranks } = useRankStore();
    const { missionChains } = useMissionChainStore();
    
    // Состояние для управления раскрытием блоков
    const [isPendingReviewOpen, setIsPendingReviewOpen] = useState(false);
    const [isCompletedOpen, setIsCompletedOpen] = useState(false);

    // Создаем мапу миссий пользователя для быстрого поиска
    const userMissionsMap = new Map(
        userMissions.map(userMission => [userMission.id, userMission])
    );

    // Получаем миссии, которые находятся в цепочках
    const missionsInChains = new Set(
        missionChains.flatMap(chain => chain.missions.map(mission => mission.id))
    );

    // Получаем ранги, отсортированные по requiredXp
    const sortedRanks = [...ranks].sort((a, b) => a.requiredXp - b.requiredXp);
    const userRankIndex = sortedRanks.findIndex(r => r.id === userRankId);
    
    // Определяем доступные ранги для отображения в блоке "Доступные миссии"
    const getAvailableRanks = () => {
        if (userRankIndex === 0) {
            // Первый ранг (самый низкий) - видит только свой ранг
            return [userRankId];
        } else if (userRankIndex === 1) {
            // Второй ранг - видит только свой ранг
            return [userRankId];
        } else {
            // Третий ранг и выше - видит ранги от третьего до своего (включительно)
            const availableRanks = [];
            for (let i = 2; i <= userRankIndex; i++) { // От третьего ранга до своего
                availableRanks.push(sortedRanks[i].id);
            }
            return availableRanks;
        }
    };

    const availableRanks = getAvailableRanks();

    // Фильтруем миссии для блока "Доступные миссии"
    const availableMissions = missions.filter(mission => {
        // Исключаем миссии из цепочек
        if (missionsInChains.has(mission.id)) {
            return false;
        }

        // Проверяем доступность по рангу согласно новой логике
        if (!availableRanks.includes(mission.rankRequirement)) {
            return false;
        }

        // Исключаем миссию, если пользователь уже выполнил её
        const userMission = userMissionsMap.get(mission.id);
        if (userMission?.isCompleted) {
            return false;
        }

        return true;
    });

    // Классифицируем миссии по статусу
    const missionsByStatus = {
        // Доступные миссии - только по новой логике рангов
        available: [] as Array<{ mission: Mission; userMission: UserMission | null }>,
        // На проверке и завершенные - все миссии пользователя из активного сезона
        pendingReview: [] as Array<{ mission: Mission; userMission: UserMission }>,
        completed: [] as Array<{ mission: Mission; userMission: UserMission }>
    };

    // Обрабатываем доступные миссии
    availableMissions.forEach(mission => {
        const userMission = userMissionsMap.get(mission.id);
        missionsByStatus.available.push({ mission, userMission: userMission || null });
    });

    // Обрабатываем все миссии пользователя для блоков "На проверке" и "Завершенные"
    userMissions.forEach(userMission => {
        // Находим соответствующую миссию в списке миссий сезона
        const mission = missions.find(m => m.id === userMission.id);
        if (!mission) return; // Пропускаем, если миссия не из текущего сезона

        if (userMission.isCompleted && userMission.isApproved) {
            missionsByStatus.completed.push({ mission, userMission });
        } else if (userMission.isCompleted && !userMission.isApproved) {
            missionsByStatus.pendingReview.push({ mission, userMission });
        }
    });

    return ( currentSeason &&(
        <>
        {/* Available Missions */}
        {(
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg md:text-xl font-semibold text-white">Уникальные миссии</h3>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {missionsByStatus.available.length > 0 ? (
                        missionsByStatus.available.map(({ mission, userMission }) => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                userMission={userMission}
                                seasonName={currentSeason.name}
                                isCompleted={false}
                                onLaunch={onMissionLaunch}
                                onViewDetails={onMissionDetails}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Нет доступных миссий</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Pending Review Missions */}
        {missionsByStatus.pendingReview.length > 0 && (
            <Collapsible open={isPendingReviewOpen} onOpenChange={setIsPendingReviewOpen}>
                <div className="space-y-4">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full p-0 h-auto hover:bg-muted/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-white" />
                                    <h3 className="text-lg md:text-xl font-semibold text-white">Миссии на проверке</h3>
                                    {isPendingReviewOpen ? (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                        <div className="space-y-4">
                            {missionsByStatus.pendingReview.map(({ mission, userMission }) => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                    userMission={userMission}
                                    seasonName={currentSeason.name}
                                    isCompleted={true}
                                    isApproved={false}
                                    onLaunch={onMissionLaunch}
                                    onViewDetails={onMissionDetails}
                                />
                            ))}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        )}

        {/* Completed Missions */}
        {(
            <Collapsible open={isCompletedOpen} onOpenChange={setIsCompletedOpen}>
                <div className="space-y-4">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full p-0 h-auto hover:bg-muted/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                    <h3 className="text-lg md:text-xl font-semibold text-white">Завершенные миссии</h3>
                                    {isCompletedOpen ? (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                        <div className="space-y-4">
                        {missionsByStatus.completed.length > 0 ? (
                            missionsByStatus.completed.map(({ mission, userMission }) => (
                                <MissionCard
                                    key={mission.id}
                                    mission={mission}
                                    userMission={userMission}
                                    seasonName={currentSeason.name}
                                    isCompleted={true}
                                    isApproved={true}
                                    onLaunch={onMissionLaunch}
                                    onViewDetails={onMissionDetails}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50 text-green-500" />
                                <p className="text-sm">Нет завершенных миссий</p>
                            </div>
                        )}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        )}

        </>)
    )
}