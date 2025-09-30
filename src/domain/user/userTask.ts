import { UserTaskResponse } from "../../api/types/apiTypes";

export class UserTask {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly isCompleted: boolean,
  ) {}

  static fromResponse(response: UserTaskResponse): UserTask {
    return new UserTask(
      response.id,
      response.title,
      response.description,
      response.isCompleted
    );
  }

  // Вспомогательные методы
  get status(): 'completed' | 'pending' {
    return this.isCompleted ? 'completed' : 'pending';
  }
}
