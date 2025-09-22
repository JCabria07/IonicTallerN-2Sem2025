import { registerPlugin } from '@capacitor/core';

export interface HomeScreenWallpaperPlugin {
  setHomeScreenWallpaper(options: { path: string }): Promise<void>;
}

export const HomeScreenWallpaperPlugin = registerPlugin<HomeScreenWallpaperPlugin>('HomeScreenWallpaperPlugin');
