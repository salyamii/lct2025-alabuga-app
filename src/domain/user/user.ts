import { UserResponse, UserDetailedResponse } from "../../api/types/apiTypes";
import { UserMission } from "./userMission";
import { Artifact } from "../artifact";
import { UserCompetency } from "./userCompetency";

// Базовая модель пользователя (только основная информация)
export class User {
    constructor(
      public readonly login: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly role: string,
    ) {}
    
    static fromResponse(response: UserResponse): User {
      return new User(  
        response.login,
        response.firstName,
        response.lastName,
        response.role
      );
    }
    
    // Вспомогательные методы
    get fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
    
    get isAdmin(): boolean {
      return this.role === 'Admin' || this.role === 'HR';
    }
  }

// Расширенная модель пользователя (с детальной информацией)
export class DetailedUser {
    constructor(
      public readonly login: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly role: string,
      public readonly rankId: number,
      public readonly xp: number,
      public readonly mana: number,
      public readonly missions: UserMission[] = [],
      public readonly artifacts: Artifact[] = [],
      public readonly competencies: UserCompetency[] = [],
    ) {}
    
    static fromDetailedResponse(response: UserDetailedResponse): DetailedUser {
      return new DetailedUser(
        response.login,
        response.firstName,
        response.lastName,
        response.role,
        response.rankId,
        response.exp,
        response.mana,
        [], // missions будут загружены отдельно
        response.artifacts || [],
        response.competencies?.map(comp => UserCompetency.fromResponse(comp)) || []
      );
    }
    
    // Вспомогательные методы
    get fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
    
    get isAdmin(): boolean {
      return this.role === 'admin' || this.role === 'hr';
    }
    
    // Артефакты пользователя
    get artifactIds(): number[] {
      return this.artifacts.map(a => a.id);
    }

    // Статистика миссий
    get completedMissionsCount(): number {
      return this.missions.filter(m => m.isCompleted).length;
    }

    get totalMissionsCount(): number {
      return this.missions.length;
    }

    get missionProgress(): number {
      if (this.totalMissionsCount === 0) return 0;
      return Math.round((this.completedMissionsCount / this.totalMissionsCount) * 100);
    }

    // Статистика компетенций
    get averageCompetencyLevel(): number {
      if (this.competencies.length === 0) return 0;
      const totalLevel = this.competencies.reduce((sum, c) => sum + c.userLevel, 0);
      return Math.round(totalLevel / this.competencies.length);
    }

    get masterCompetenciesCount(): number {
      return this.competencies.filter(c => c.isMaxLevel).length;
    }

    // Поиск миссии по ID
    getMissionById(id: number): UserMission | undefined {
      return this.missions.find(m => m.id === id);
    }

    // Поиск компетенции по ID
    getCompetencyById(id: number): UserCompetency | undefined {
      return this.competencies.find(c => c.id === id);
    }

    // Поиск артефакта по ID
    getArtifactById(id: number): Artifact | undefined {
      return this.artifacts.find(a => a.id === id);
    }
  }