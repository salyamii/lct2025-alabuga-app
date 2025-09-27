import { CompetencyResponse, CompetencyRewardResponse } from "../api/types/apiTypes";
import { Skill } from "./skill";

export class Competency {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly maxLevel: number,
    public readonly skills: Skill[] = []
  ) {}

  static fromResponse(response: CompetencyResponse): Competency {
    return new Competency(
      response.id,
      response.name,
      response.maxLevel,
      response.skills?.map(skill => Skill.fromResponse(skill)) || []
    );
  }
}

export class CompetencyReward {
  constructor(
    public readonly competency: Competency,
    public readonly levelIncrease: number
  ) {}

  static fromResponse(response: CompetencyRewardResponse): CompetencyReward {
    return new CompetencyReward(
      Competency.fromResponse(response.competency),
      response.levelIncrease
    );
  }
}
