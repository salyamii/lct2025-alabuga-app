import { MissionResponse, MissionTaskResponse } from "../api/types/apiTypes";
import { Artifact } from "./artifact";
import { CompetencyReward } from "./competency";
import { SkillReward } from "./skill";

export class Mission {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly rewardXp: number,
    public readonly rewardMana: number,
    public readonly rankRequirement: number,
    public readonly branchId: number,
    public readonly category: string,
    public readonly tasks: MissionTask[] = [],
    public readonly rewardArtifacts: Artifact[] = [],
    public readonly rewardCompetencies: CompetencyReward[] = [],
    public readonly rewardSkills: SkillReward[] = []
  ) {}

  static fromResponse(response: MissionResponse): Mission {
    return new Mission(
      response.id,
      response.title,
      response.description,
      response.rewardXp,
      response.rewardMana,
      response.rankRequirement,
      1, // default branch id
      response.category,
      response.tasks?.map(task => MissionTask.fromResponse(task)) || [],
      (response.rewardArtifacts || []).map(artifact => new Artifact(
        artifact.id,
        artifact.title,
        artifact.description,
        artifact.rarity,
        artifact.imageUrl
      )),
      (response.rewardCompetencies || []).map(rc => CompetencyReward.fromResponse(rc)),
      (response.rewardSkills || []).map(rs => SkillReward.fromResponse(rs))
    );
  }
}

export class MissionTask {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string
  ) {}

  static fromResponse(response: MissionTaskResponse): MissionTask {
    return new MissionTask(
      response.id,
      response.title,
      response.description
    );
  }
}
