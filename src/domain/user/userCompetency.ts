import { UserCompetencyResponse } from "../../api/types/apiTypes";
import { UserSkill } from "./userSkill";

export class UserCompetency {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly maxLevel: number,
    public readonly userLevel: number,
    public readonly skills: UserSkill[],
  ) {}

  static fromResponse(response: UserCompetencyResponse): UserCompetency {
    return new UserCompetency(
      response.id,
      response.name,
      response.maxLevel,
      response.userLevel,
      response.skills?.map(skill => UserSkill.fromResponse(skill)) || []
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

  get averageSkillProgress(): number {
    if (this.skills.length === 0) return 0;
    const totalProgress = this.skills.reduce((sum, skill) => sum + skill.progress, 0);
    return Math.round(totalProgress / this.skills.length);
  }

  get masterSkillsCount(): number {
    return this.skills.filter(skill => skill.isMaxLevel).length;
  }
}
