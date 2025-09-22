import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  // Mostrar spinner
  async show(message: string = 'LOADING IMAGES...', spinner: string = 'bubbles') {
    if (this.loading) return; // Ya hay un loading abierto

    this.loading = await this.loadingController.create({
      message,
      spinner: spinner as any,
      backdropDismiss: false,
    });

    await this.loading.present();
  }

  // Ocultar spinner
  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
