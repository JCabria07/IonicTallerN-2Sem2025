// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, CollectionReference } from '@angular/fire/firestore';
import { Iimage } from '../interfaces/image.model';

@Injectable({ providedIn: 'root' })
export class FirebaseService {

  private imagesCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.imagesCollection = collection(this.firestore, 'images');
  }

  async saveImageMetadata(image: Iimage): Promise<void> {
    await addDoc(this.imagesCollection, image);
  }

  async getImages(): Promise<Iimage[]> {
    const snapshot = await getDocs(this.imagesCollection);
    return snapshot.docs.map(doc => doc.data() as Iimage);
  }
}
