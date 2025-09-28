import { Satellite } from "lucide-react";
import { Badge } from "../../components/ui/badge";

import { MissionCard } from "./MissionCard";
import { Season } from "../../domain/season";
import { Mission } from "../../domain/mission";

interface SeasonHubMissionsProps {
    currentSeason: Season | null;
    missions: Mission[];
    onMissionLaunch: (missionId: number) => void;
    onMissionDetails: (missionId: number) => void;
}

export function SeasonHubMissions({ currentSeason, missions, onMissionLaunch, onMissionDetails }: SeasonHubMissionsProps) {
    return ( currentSeason &&(
        <>
        {/* Episode Missions */}
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-primary" />
                    <h3 className="text-lg md:text-xl font-semibold">{currentSeason?.name}</h3>
                </div>
            </div>
            
            <div className="space-y-4">
            {missions.map((mission) => (
                mission.tasks.length > 0 && (
                <MissionCard
                key={mission.id}
                mission={mission}
                onLaunch={onMissionLaunch}
                onViewDetails={onMissionDetails}
                />
                )
            ))}
            </div>
        </div>
        </>)
    )
}