// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Capacitor } from '@capacitor/core';
import { SupabaseService } from '../services/supabase.service';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { Iimage } from '../interfaces/image.model';
import { LoadingService } from '../services/loading.service';
import { ActionSheetController } from '@ionic/angular';
import { WallpaperService } from '../services/wallpaper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  userName: string = 'Juan';
  userPhotoURL: string | null = null;
  images: Iimage[] = [];

  constructor(
    private supabase: SupabaseService,
    private firebase: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private actionSheetCtrl: ActionSheetController,
    private wallpaperService: WallpaperService
  ) {}

  async ngOnInit() {
    await this.loadingService.show();
    try {
      this.images = await this.firebase.getImages();
    } finally {
      await this.loadingService.hide();
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.userName = '';
      this.userPhotoURL = null;
      this.images = [];
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err) {
      console.error('Error cerrando sesión', err);
    }
  }

  async uploadImage() {
    try {
      const result = await FilePicker.pickFiles({ types: ['image/*'] });
      if (!result.files || result.files.length === 0) return;

      const filePicked = result.files[0];
      let blob: Blob;

      if (filePicked.blob) {
        blob = filePicked.blob;
      } else if (filePicked.path) {
        const url = Capacitor.convertFileSrc(filePicked.path);
        const response = await fetch(url);
        blob = await response.blob();
      } else {
        console.warn('No se pudo leer el archivo');
        return;
      }

      const file = new File([blob], filePicked.name, { type: filePicked.mimeType });
      const filePath = `uploads/${Date.now()}_${filePicked.name}`;

      await this.supabase.uploadImage('WallpapperIMG', filePath, file);
      const publicUrl = await this.supabase.getPublicUrl('WallpapperIMG', filePath);

      const metadata: Iimage = {
        url: publicUrl,
        titulo: filePicked.name,
        fecha: new Date().toISOString().split('T')[0],
        usuario: this.userName,
      };
      await this.firebase.saveImageMetadata(metadata);

      this.images.unshift(metadata);
    } catch (err) {
      console.error('Error al subir imagen', err);
    }
  }

  async abrirOpcionesWallpaper(img: Iimage) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Colocar imagen como',
      buttons: [
        {
          text: 'Fondo de pantalla',
          handler: async () => {
            await this.wallpaperService.setHomeWallpaper(img.url);
          },
        },
        {
          text: 'Fondo de bloqueo',
          handler: async () => {
            await this.wallpaperService.setLockWallpaper(img.url);
          },
        },
        {
          text: 'Ambos',
          handler: async () => {
            await this.wallpaperService.setHomeWallpaper(img.url);
            await this.wallpaperService.setLockWallpaper(img.url);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
