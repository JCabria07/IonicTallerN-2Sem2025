import { registerPlugin } from '@capacitor/core';

export interface LockScreenWallpaperPlugin {
  setLockScreenWallpaper(options: { path: string }): Promise<void>;
}

export const LockScreenWallpaperPlugin = registerPlugin<LockScreenWallpaperPlugin>('LockScreenWallpaperPlugin');
