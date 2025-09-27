export type ThemeMode = 'system' | 'light' | 'dark';

export class SystemSettings {
    constructor(
      public readonly themeMode: ThemeMode,
      public readonly isReducedMotion: boolean,
      public readonly isCompactMode: boolean,
      public readonly timezone: string
    ) {}
  
    static defaults() {
      return new SystemSettings('system', false, false, 'UTC+3');
    }
  
    with(patch: Partial<SystemSettings>) {
      return new SystemSettings(
        patch.themeMode ?? this.themeMode,
        patch.isReducedMotion ?? this.isReducedMotion,
        patch.isCompactMode ?? this.isCompactMode,
        patch.timezone ?? this.timezone
      );
    }
  }