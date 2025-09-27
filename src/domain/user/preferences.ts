import { PrivacySettings } from "./privacy";
import { SystemSettings } from "./system";
import { NotificationSettings } from "./notifications";
import { SyncSettings } from "./sync";

export class UserPreferences {
    constructor(
      public readonly system: SystemSettings,
      public readonly notifications: NotificationSettings,
      public readonly sync: SyncSettings,
      public readonly privacy: PrivacySettings
    ) {}
  
    static defaults() {
      return new UserPreferences(
        SystemSettings.defaults(),
        NotificationSettings.defaults(),
        SyncSettings.defaults(),
        PrivacySettings.defaults()
      );
    }
  
    with(patch: Partial<{
      system: Partial<SystemSettings>,
      notifications: Partial<NotificationSettings>,
      sync: Partial<SyncSettings>,
      privacy: Partial<PrivacySettings>
    }>) {
      return new UserPreferences(
        this.system.with(patch.system ?? {}),
        this.notifications.with(patch.notifications ?? {}),
        this.sync.with(patch.sync ?? {}),
        this.privacy.with(patch.privacy ?? {})
      );
    }
  }