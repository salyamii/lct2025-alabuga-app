import { GitBranch } from "lucide-react"
import { MissionChainCard } from "./MissionChainCard"
import { MissionChain, DetailedUser } from "../../domain"
import { useRankStore } from "../../stores/useRankStore"
import { useMemo, useCallback } from "react"

interface SeasonHubMissionChainsProps {
    missionChains: MissionChain[];
    user: DetailedUser | null;
    onMissionChainOpen: (missionChainId: number) => void
}

export function SeasonHubMissionChains({ missionChains, user, onMissionChainOpen }: SeasonHubMissionChainsProps) {
    const { ranks } = useRankStore();

    // Функция для определения требуемого ранга цепочки миссий
    const getChainRequiredRank = useCallback((chain: MissionChain): number | null => {
        if (!chain.missions || chain.missions.length === 0) {
            return null;
        }

        // Получаем все ранги, требуемые для миссий в цепочке
        const requiredRanks = chain.missions.map(mission => mission.rankRequirement);
        const uniqueRanks = Array.from(new Set(requiredRanks));

        // Если все миссии требуют один и тот же ранг, возвращаем его
        if (uniqueRanks.length === 1) {
            return uniqueRanks[0];
        }

        // Если миссии требуют разные ранги, цепочка некорректна
        return null;
    }, []);

    // Функция для определения доступных рангов для пользователя
    const getAvailableRanksForUser = useCallback((userRankId: number): number[] => {
        if (!ranks || ranks.length === 0) {
            return [userRankId];
        }

        // Сортируем ранги по requiredXp (от меньшего к большему)
        const sortedRanks = [...ranks].sort((a, b) => a.requiredXp - b.requiredXp);
        
        // Находим индекс текущего ранга пользователя
        const userRankIndex = sortedRanks.findIndex(rank => rank.id === userRankId);
        
        if (userRankIndex === -1) {
            return [userRankId];
        }

        // Логика доступности рангов:
        // - Ранг 1 (индекс 0): видит только свои цепочки
        // - Ранг 2 (индекс 1): видит только свои цепочки  
        // - Ранг 3 (индекс 2): видит только свои цепочки
        // - Ранг 4+ (индекс 3+): видит все цепочки от 3 ранга до своего ранга включительно
        if (userRankIndex <= 2) {
            // Ранги 1, 2, 3 видят только свои цепочки
            return [userRankId];
        } else {
            // Ранги 4+ видят все цепочки от 3 ранга до своего ранга включительно
            const availableRanks: number[] = [];
            
            // Добавляем все ранги от 3 ранга (индекс 2) до текущего ранга пользователя включительно
            for (let i = 2; i <= userRankIndex; i++) {
                availableRanks.push(sortedRanks[i].id);
            }
            
            return availableRanks;
        }
    }, [ranks]);

    // Фильтруем цепочки по рангу пользователя
    const filteredChains = useMemo(() => {
        if (!user || !ranks || ranks.length === 0) {
            return missionChains.filter(chain => chain.missions && chain.missions.length > 0);
        }

        const availableRanks = getAvailableRanksForUser(user.rankId);
        
        return missionChains.filter(chain => {
            // Проверяем, что в цепочке есть миссии
            if (!chain.missions || chain.missions.length === 0) {
                return false;
            }

            // Получаем требуемый ранг цепочки
            const chainRequiredRank = getChainRequiredRank(chain);
            
            // Если цепочка некорректна (разные ранги), не показываем её
            if (chainRequiredRank === null) {
                return false;
            }

            // Проверяем, доступна ли цепочка для пользователя
            return availableRanks.includes(chainRequiredRank);
        });
    }, [missionChains, user, ranks, getAvailableRanksForUser, getChainRequiredRank]);

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
            {filteredChains.map((chain) => (
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
