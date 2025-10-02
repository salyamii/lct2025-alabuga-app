import { GitBranch, HelpCircle } from "lucide-react"
import { MissionChainCard } from "./MissionChainCard"
import { MissionChain } from "../../domain"
import { useRankStore } from "../../stores/useRankStore"
import { useMemo, useCallback } from "react"

interface SeasonHubMissionChainsProps {
    missionChains: MissionChain[];
    userRankId: number;
    userMissions: any[] | null;
    onMissionChainOpen: (missionChainId: number) => void
}

export function SeasonHubMissionChains({ missionChains, userRankId, userMissions, onMissionChainOpen }: SeasonHubMissionChainsProps) {
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

    // Функция для определения доступных рангов для пользователя (та же логика, что и для миссий)
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

        // Логика доступности рангов (как в SeasonHubMissions):
        // - Ранг 1 (индекс 0): видит только свои цепочки
        // - Ранг 2 (индекс 1): видит только свои цепочки  
        // - Ранг 3+ (индекс 2+): видит цепочки от 3 ранга до своего ранга включительно
        if (userRankIndex <= 1) {
            // Ранги 1, 2 видят только свои цепочки
            return [userRankId];
        } else {
            // Ранги 3+ видят цепочки от 3 ранга до своего ранга включительно
            const availableRanks: number[] = [];
            
            // Добавляем все ранги от 3 ранга (индекс 2) до текущего ранга пользователя включительно
            for (let i = 2; i <= userRankIndex; i++) {
                availableRanks.push(sortedRanks[i].id);
            }
            
            return availableRanks;
        }
    }, [ranks]);

    // Проверяем, завершена ли цепочка
    const isChainCompleted = useCallback((chain: MissionChain): boolean => {
        if (!userMissions || !chain.missions || chain.missions.length === 0) {
            return false;
        }

        // Цепочка завершена, если все миссии завершены и одобрены
        return chain.missions.every(mission => {
            const userMission = userMissions.find(um => um.id === mission.id);
            return userMission?.isCompleted && userMission?.isApproved;
        });
    }, [userMissions]);

    // Фильтруем цепочки по рангу пользователя и исключаем завершенные
    const filteredChains = useMemo(() => {
        if (!ranks || ranks.length === 0) {
            return missionChains.filter(chain => chain.missions && chain.missions.length > 0);
        }

        // Используем переданный ранг пользователя
        const availableRanks = getAvailableRanksForUser(userRankId);
        
        return missionChains.filter(chain => {
            // Проверяем, что в цепочке есть миссии
            if (!chain.missions || chain.missions.length === 0) {
                return false;
            }

            // Исключаем завершенные цепочки
            if (isChainCompleted(chain)) {
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
    }, [missionChains, userRankId, userMissions, ranks, getAvailableRanksForUser, getChainRequiredRank, isChainCompleted]);

    return (
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-2 min-w-0">
            <GitBranch className="w-5 h-5 text-info" />
            <h3 className="text-lg font-semibold text-wrap">Цепочки заданий этого сезона</h3>
          </div>
          <p className="text-sm text-muted-foreground text-wrap">
            Связанные цепочки заданий. Завершите все или только необходимые.
          </p>
          
          {filteredChains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChains.map((chain) => (
                <MissionChainCard
                  key={chain.id}
                  missionChain={chain}
                  userMissions={userMissions}
                  onOpenChain={onMissionChainOpen}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-enhanced rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]">
                <HelpCircle className="w-12 h-12 text-muted-foreground/50" />
                <div className="space-y-1">
                  <h4 className="font-medium text-muted-foreground">Нет доступных цепочек</h4>
                  <p className="text-sm text-muted-foreground/70 text-wrap">
                    Здесь будут цепочки, доступные вашему рангу
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
    )
}
