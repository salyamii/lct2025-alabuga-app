import { Satellite, Lock } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { MissionCard } from "./MissionCard";
import { Season } from "../../domain/season";
import { UserMission, User } from "../../domain";

export interface SeasonHubMissionsProps {
    currentSeason: Season | null;
    missions: UserMission[];  // ✅ Теперь UserMission[]
    user: User | null;
    onMissionLaunch: (missionId: number) => void;
    onMissionDetails: (missionId: number) => void;
}

export function SeasonHubMissions({ currentSeason, missions, user, onMissionLaunch, onMissionDetails }: SeasonHubMissionsProps) {
    const userRankId = user?.rankId || 1;

    // Фильтруем только незавершенные миссии с задачами
    const incompleteMissions = missions.filter((mission) => {
        return !mission.isCompleted && mission.tasks.length > 0;
    });

    // Разделяем на доступные и недоступные по рангу
    const availableMissions = incompleteMissions.filter(
        mission => mission.rankRequirement <= userRankId
    );

    const lockedMissions = incompleteMissions.filter(
        mission => mission.rankRequirement > userRankId
    );

    return ( currentSeason &&(
        <>
        {/* Available Missions */}
        {availableMissions.length > 0 && (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Satellite className="w-5 h-5 text-primary" />
                        <h3 className="text-lg md:text-xl font-semibold">Доступные миссии</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit">
                        {availableMissions.length} {availableMissions.length === 1 ? 'миссия' : 'миссий'}
                    </Badge>
                </div>
                
                <div className="space-y-4">
                {availableMissions.map((mission) => (
                    <MissionCard
                        key={mission.id}
                        mission={mission}
                        seasonName={currentSeason.name}
                        isCompleted={false}
                        isLocked={false}
                        onLaunch={onMissionLaunch}
                        onViewDetails={onMissionDetails}
                    />
                ))}
                </div>
            </div>
        )}

        {/* Locked Missions */}
        {lockedMissions.length > 0 && (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg md:text-xl font-semibold text-muted-foreground">Недоступные миссии</h3>
                    </div>
                    <Badge variant="outline" className="text-sm w-fit bg-muted">
                        {lockedMissions.length} {lockedMissions.length === 1 ? 'миссия' : 'миссий'}
                    </Badge>
                </div>
                
                <div className="space-y-4">
                {lockedMissions.map((mission) => (
                    <MissionCard
                        key={mission.id}
                        mission={mission}
                        seasonName={currentSeason.name}
                        isCompleted={false}
                        isLocked={true}
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