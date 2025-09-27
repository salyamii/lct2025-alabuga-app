import { ArtifactResponse } from "../api/types/apiTypes";

export class Artifact {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly rarity: string
  ) {}

  static fromResponse(response: ArtifactResponse): Artifact {
    return new Artifact(
      response.id,
      response.title,
      response.description,
      response.rarity,
    );
  }
}
