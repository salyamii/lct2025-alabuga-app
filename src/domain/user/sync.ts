export class SyncSettings {
    constructor(
      public readonly autoSyncProgress: boolean,
      public readonly offlineMode: boolean,
      public readonly backgroundSync: boolean
    ) {}
  
    static defaults() {
      return new SyncSettings(true, false, true);
    }
  
    with(patch: Partial<SyncSettings>) {
      return new SyncSettings(
        patch.autoSyncProgress ?? this.autoSyncProgress,
        patch.offlineMode ?? this.offlineMode,
        patch.backgroundSync ?? this.backgroundSync
      );
    }
  }