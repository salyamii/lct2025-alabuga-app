import { UserSkillResponse } from "../../api/types/apiTypes";

export class UserSkill {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly maxLevel: number,
    public readonly userLevel: number,
  ) {}

  static fromResponse(response: UserSkillResponse): UserSkill {
    return new UserSkill(
      response.id,
      response.name,
      response.maxLevel,
      response.userLevel
    );
  }

  // Вспомогательные методы
  get progress(): number {
    if (this.maxLevel === 0) return 0;
    return Math.round((this.userLevel / this.maxLevel) * 100);
  }

  get isMaxLevel(): boolean {
    return this.userLevel >= this.maxLevel;
  }

  get remainingLevels(): number {
    return Math.max(0, this.maxLevel - this.userLevel);
  }
}
