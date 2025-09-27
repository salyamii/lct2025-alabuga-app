export class NotificationSettings {
    constructor(
      public readonly missionNotifications: boolean,
      public readonly newBadgesNotifications: boolean,
      public readonly squadronNotifications: boolean,
      public readonly mentorshipRequestNotifications: boolean,
      public readonly emailNotifications: boolean
    ) {}
  
    static defaults() {
      return new NotificationSettings(true, true, false, true, false);
    }
  
    with(patch: Partial<NotificationSettings>) {
      return new NotificationSettings(
        patch.missionNotifications ?? this.missionNotifications,
        patch.newBadgesNotifications ?? this.newBadgesNotifications,
        patch.squadronNotifications ?? this.squadronNotifications,
        patch.mentorshipRequestNotifications ?? this.mentorshipRequestNotifications,
        patch.emailNotifications ?? this.emailNotifications
      );
    }
  }