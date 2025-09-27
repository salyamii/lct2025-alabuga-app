export class PrivacySettings {
    constructor(
      public readonly isPublicProfile: boolean,
      public readonly isActivityVisible: boolean,
      public readonly isSendingDataAnalytics: boolean
    ) {}
  
    static defaults() {
      return new PrivacySettings(true, true, false);
    }
  
    with(patch: Partial<PrivacySettings>) {
      return new PrivacySettings(
        patch.isPublicProfile ?? this.isPublicProfile,
        patch.isActivityVisible ?? this.isActivityVisible,
        patch.isSendingDataAnalytics ?? this.isSendingDataAnalytics
      );
    }
  }