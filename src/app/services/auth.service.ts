import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, UserCredential, signOut } from '@angular/fire/auth';
import { IUserBasicInfo } from '../interfaces/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<IUserBasicInfo> {
    const cred: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);

    return {
      email: cred.user.email ?? '',                 
      displayName: cred.user.displayName ?? undefined 
    };
  }

  async loginWithGoogle(): Promise<IUserBasicInfo> {
    const provider = new GoogleAuthProvider();
    const cred: UserCredential = await signInWithPopup(this.auth, provider);

    return {
      email: cred.user.email ?? '',
      displayName: cred.user.displayName ?? undefined
    };
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
