import { UserResponse } from "../../api/types/apiTypes";
import { UserPreferences } from "./preferences";

export class User {
    constructor(
      public readonly userId: string,
      public readonly login: string,
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly role: string,
      public readonly xp: number,
      public readonly mana: number,
      public readonly artifactIds: number[],
      public readonly badgesIds: number[],
      public readonly competencyIds: number[],
      public readonly guildId: number,
      public readonly preferences: UserPreferences,
    ) {}
    
    static fromResponse(response: UserResponse): User {
      return new User(  
        "NAVIGATOR-001", // default id
        response.login,
        response.firstName,
        response.lastName,
        response.role,
        2150, // default xp
        1500, // default mana 
        [],
        [],
        [],
        1,
        UserPreferences.defaults()
      );
    }
  }