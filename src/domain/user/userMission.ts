import { UserMissionResponse, ArtifactResponse, CompetencyRewardResponse, SkillRewardResponse } from "../../api/types/apiTypes";
import { UserTask } from "./userTask";

export class UserMission {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly rewardXp: number,
    public readonly rewardMana: number,
    public readonly rankRequirement: number,
    public readonly seasonId: number,
    public readonly category: string,
    public readonly isCompleted: boolean,
    public readonly tasks: UserTask[],
    public readonly rewardArtifacts: ArtifactResponse[],
    public readonly rewardCompetencies: CompetencyRewardResponse[],
    public readonly rewardSkills: SkillRewardResponse[],
  ) {}

  static fromResponse(response: UserMissionResponse): UserMission {
    return new UserMission(
      response.id,
      response.title,
      response.description,
      response.rewardXp,
      response.rewardMana,
      response.rankRequirement,
      response.seasonId,
      response.category,
      response.isCompleted || false,
      response.tasks?.map(task => UserTask.fromResponse(task)) || [],
      response.rewardArtifacts || [],
      response.rewardCompetencies || [],
      response.rewardSkills || []
    );
  }

  // Вспомогательные методы
  get completedTasksCount(): number {
    return this.tasks.filter(task => task.isCompleted).length;
  }

  get totalTasksCount(): number {
    return this.tasks.length;
  }

  get progress(): number {
    if (this.totalTasksCount === 0) return 0;
    return Math.round((this.completedTasksCount / this.totalTasksCount) * 100);
  }

  get status(): 'completed' | 'in_progress' | 'not_started' {
    if (this.isCompleted) return 'completed';
    if (this.completedTasksCount > 0) return 'in_progress';
    return 'not_started';
  }

  get hasRewards(): boolean {
    return this.rewardArtifacts.length > 0 || 
           this.rewardCompetencies.length > 0 || 
           this.rewardSkills.length > 0;
  }
}
