import { TaskResponse } from "../api/types/apiTypes";

export class Task {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string
  ) {}

  static fromResponse(response: TaskResponse): Task {
    return new Task(
      response.id,
      response.title,
      response.description
    );
  }
}
