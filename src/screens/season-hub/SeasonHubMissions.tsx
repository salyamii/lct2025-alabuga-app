import { Satellite, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { MissionCard } from "./MissionCard";
import { Season } from "../../domain/season";
import { Mission, UserMission } from "../../domain";
import { useRankStore } from "../../stores/useRankStore";
import { useMissionChainStore } from "../../stores/useMissionChainStore";

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

    // Создаем мапу миссий пользователя для быстрого поиска
    const userMissionsMap = new Map(
        userMissions.map(userMission => [userMission.id, userMission])
    );

    // Получаем миссии, которые находятся в цепочках
    const missionsInChains = new Set(
        missionChains.flatMap(chain => chain.missions.map(mission => mission.id))
    );

    // Фильтруем миссии: исключаем те, что в цепочках, и показываем только доступные по рангу
    const availableMissions = missions.filter(mission => {
        // Исключаем миссии из цепочек
        if (missionsInChains.has(mission.id)) {
            return false;
        }

        // Проверяем доступность по рангу
        const userRank = ranks.find(r => r.id === userRankId);
        if (!userRank) return false;

        // Пользователь видит миссии своего ранга и всех предыдущих рангов
        return mission.rankRequirement <= userRankId;
    });

    // Классифицируем доступные миссии по статусу
    const missionsByStatus = availableMissions.reduce((acc, mission) => {
        const userMission = userMissionsMap.get(mission.id);
        
        if (userMission) {
            if (userMission.isCompleted && userMission.isApproved) {
                acc.completed.push({ mission, userMission });
            } else if (userMission.isCompleted && !userMission.isApproved) {
                acc.pendingReview.push({ mission, userMission });
            } else {
                acc.available.push({ mission, userMission });
            }
        } else {
            acc.available.push({ mission, userMission: null });
        }
        
        return acc;
    }, {
        available: [] as Array<{ mission: Mission; userMission: UserMission | null }>,
        pendingReview: [] as Array<{ mission: Mission; userMission: UserMission }>,
        completed: [] as Array<{ mission: Mission; userMission: UserMission }>
    });

    return ( currentSeason &&(
        <>
        {/* Available Missions */}
        {missionsByStatus.available.length > 0 && (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Satellite className="w-5 h-5 text-primary" />
                        <h3 className="text-lg md:text-xl font-semibold">Доступные миссии</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit">
                        {missionsByStatus.available.length} {missionsByStatus.available.length === 1 ? 'миссия' : 'миссий'}
                    </Badge>
                </div>
                
                <div className="space-y-4">
                {missionsByStatus.available.map(({ mission, userMission }) => (
                    <MissionCard
                        key={mission.id}
                        mission={mission}
                        userMission={userMission}
                        seasonName={currentSeason.name}
                        isCompleted={false}
                        onLaunch={onMissionLaunch}
                        onViewDetails={onMissionDetails}
                    />
                ))}
                </div>
            </div>
        )}

        {/* Pending Review Missions */}
        {missionsByStatus.pendingReview.length > 0 && (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg md:text-xl font-semibold text-orange-600">На проверке</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit bg-orange-50 text-orange-600 border-orange-200">
                        {missionsByStatus.pendingReview.length} {missionsByStatus.pendingReview.length === 1 ? 'миссия' : 'миссий'}
                    </Badge>
                </div>
                
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
            </div>
        )}

        {/* Completed Missions */}
        {missionsByStatus.completed.length > 0 && (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h3 className="text-lg md:text-xl font-semibold text-green-600">Завершенные миссии</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit bg-green-50 text-green-600 border-green-200">
                        {missionsByStatus.completed.length} {missionsByStatus.completed.length === 1 ? 'миссия' : 'миссий'}
                    </Badge>
                </div>
                
                <div className="space-y-4">
                {missionsByStatus.completed.map(({ mission, userMission }) => (
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
                ))}
                </div>
            </div>
        )}

        </>)
    )
}