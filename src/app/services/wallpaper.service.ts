// src/app/services/wallpaper.service.ts
import { Injectable } from '@angular/core';
import { HomeScreenWallpaperPlugin } from '../plugins/home-screen-wallpaper';
import { LockScreenWallpaperPlugin } from '../plugins/lock-screen-wallpaper';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class WallpaperService {

  // Descarga la imagen remota a cache local
  private async downloadImage(url: string, fileName: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await this.blobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: `wallpapers/${fileName}`,
      data: base64,
      directory: Directory.Cache
    });

    return Capacitor.convertFileSrc(savedFile.uri);
  }

  private async blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject('Error convirtiendo blob a base64: result es null');
      }
    };
    reader.readAsDataURL(blob);
  });
}

  async setHomeWallpaper(url: string): Promise<void> {
    const localPath = await this.downloadImage(url, `home_${Date.now()}.jpg`);
    return await HomeScreenWallpaperPlugin.setHomeScreenWallpaper({ path: localPath });
  }

  async setLockWallpaper(url: string): Promise<void> {
    const localPath = await this.downloadImage(url, `lock_${Date.now()}.jpg`);
    return await LockScreenWallpaperPlugin.setLockScreenWallpaper({ path: localPath });
  }
}
