import { RankResponse, RankCompetencyRequirementResponse } from "../api/types/apiTypes";
import { Mission } from "./mission";
import { Competency } from "./competency";

export class Rank {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly requiredXp: number,
    public readonly imageUrl: string,
    public readonly requiredMissions: Mission[] = [],
    public readonly requiredCompetencies: RankCompetencyRequirement[] = []
  ) {}

  get isLowRank(): boolean {
    return this.requiredXp <= 500;
  }

  get isMidRank(): boolean {
    return this.requiredXp > 500 && this.requiredXp <= 1500;
  }

  get isHighRank(): boolean {
    return this.requiredXp > 1500;
  }

  get difficulty(): 'easy' | 'medium' | 'hard' | 'expert' {
    if (this.requiredXp <= 500) return 'easy';
    if (this.requiredXp <= 1000) return 'medium';
    if (this.requiredXp <= 2000) return 'hard';
    return 'expert';
  }

  get difficultyColor(): string {
    switch (this.difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-orange-500';
      case 'expert':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  get hasMissionRequirements(): boolean {
    return this.requiredMissions.length > 0;
  }

  get hasCompetencyRequirements(): boolean {
    return this.requiredCompetencies.length > 0;
  }

  get totalRequirements(): number {
    return this.requiredMissions.length + this.requiredCompetencies.length;
  }

  static fromResponse(response: RankResponse): Rank {
    return new Rank(
      response.id,
      response.name,
      response.requiredXp,
      response.imageUrl,
      response.requiredMissions?.map(mission => Mission.fromResponse(mission)) || [],
      response.requiredCompetencies?.map(comp => RankCompetencyRequirement.fromResponse(comp)) || []
    );
  }
}

export class RankCompetencyRequirement {
  constructor(
    public readonly competency: Competency,
    public readonly minLevel: number
  ) {}

  static fromResponse(response: RankCompetencyRequirementResponse): RankCompetencyRequirement {
    return new RankCompetencyRequirement(
      Competency.fromResponse(response.competency),
      response.minLevel
    );
  }
}
