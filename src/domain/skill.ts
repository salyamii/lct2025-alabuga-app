import { SkillResponse, SkillRewardResponse } from "../api/types/apiTypes";

export class Skill {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly maxLevel: number
  ) {}

  static fromResponse(response: SkillResponse): Skill {
    return new Skill(
      response.id,
      response.name,
      response.maxLevel
    );
  }
}

export class SkillReward {
  constructor(
    public readonly skill: Skill,
    public readonly levelIncrease: number
  ) {}

  static fromResponse(response: SkillRewardResponse): SkillReward {
    return new SkillReward(
      Skill.fromResponse(response.skill),
      response.levelIncrease
    );
  }
}
