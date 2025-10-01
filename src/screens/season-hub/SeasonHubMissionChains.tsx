import { GitBranch } from "lucide-react"
import { MissionChainCard } from "./MissionChainCard"
import { MissionChain, User } from "../../domain"

interface SeasonHubMissionChainsProps {
    missionChains: MissionChain[];
    user: User | null;
    onMissionChainOpen: (missionChainId: number) => void
}

export function SeasonHubMissionChains({ missionChains, user, onMissionChainOpen: onMissionChainOpen }: SeasonHubMissionChainsProps) {
    // Не отображать, если нет цепочек или если во всех цепочках нет ни одной миссии
    const chainsWithMissions = missionChains.filter(chain => chain.missions && chain.missions.length > 0);

    if (chainsWithMissions.length === 0) {
      return null;
    }

    return (
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-info" />
            <h3 className="text-lg font-semibold">Цепочки заданий этого сезона</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Связанные цепочки заданий. Завершите все или только необходимые.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chainsWithMissions.map((chain) => (
              <MissionChainCard
                key={chain.id}
                missionChain={chain}
                user={user}
                onOpenChain={onMissionChainOpen}
              />
            ))}
          </div>
        </div>
    )
}
