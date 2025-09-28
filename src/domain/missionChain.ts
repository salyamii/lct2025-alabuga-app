import { 
  MissionChainResponse, 
  MissionDependencyResponse, 
  MissionChainMissionResponse 
} from "../api/types/apiTypes";
import { Mission } from "./mission";

export class MissionChain {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly rewardXp: number,
    public readonly rewardMana: number,
    public readonly missions: Mission[] = [],
    public readonly dependencies: MissionDependency[] = [],
    public readonly missionOrders: MissionChainMission[] = []
  ) {}

  static fromResponse(response: MissionChainResponse): MissionChain {
    return new MissionChain(
      response.id,
      response.name,
      response.description,
      response.rewardXp,
      response.rewardMana,
      (response.missions || []).map(mission => Mission.fromResponse(mission)),
      (response.dependencies || []).map(dependency => MissionDependency.fromResponse(dependency)),
      (response.missionOrders || []).map(order => MissionChainMission.fromResponse(order))
    );
  }

  // Получить миссии в порядке выполнения
  getMissionsInOrder(): Mission[] {
    if (this.missionOrders.length === 0) {
      return this.missions;
    }

    // Сортируем миссии по порядку
    const orderedMissions = [...this.missions].sort((a, b) => {
      const orderA = this.missionOrders.find(order => order.missionId === a.id)?.order || 0;
      const orderB = this.missionOrders.find(order => order.missionId === b.id)?.order || 0;
      return orderA - orderB;
    });

    return orderedMissions;
  }

  // Получить зависимости для конкретной миссии
  getDependenciesForMission(missionId: number): MissionDependency[] {
    return this.dependencies.filter(dep => dep.missionId === missionId);
  }

  // Получить предварительные миссии для конкретной миссии
  getPrerequisiteMissions(missionId: number): Mission[] {
    const dependencies = this.getDependenciesForMission(missionId);
    return dependencies
      .map(dep => this.missions.find(mission => mission.id === dep.prerequisiteMissionId))
      .filter((mission): mission is Mission => mission !== undefined);
  }

  // Проверить, можно ли выполнить миссию (все предварительные миссии выполнены)
  canExecuteMission(missionId: number, completedMissionIds: number[]): boolean {
    const prerequisites = this.getPrerequisiteMissions(missionId);
    return prerequisites.every(prereq => completedMissionIds.includes(prereq.id));
  }
}

export class MissionDependency {
  constructor(
    public readonly missionId: number,
    public readonly prerequisiteMissionId: number
  ) {}

  static fromResponse(response: MissionDependencyResponse): MissionDependency {
    return new MissionDependency(
      response.missionId,
      response.prerequisiteMissionId
    );
  }
}

export class MissionChainMission {
  constructor(
    public readonly missionId: number,
    public readonly order: number
  ) {}

  static fromResponse(response: MissionChainMissionResponse): MissionChainMission {
    return new MissionChainMission(
      response.missionId,
      response.order
    );
  }
}
