import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1), // subscribirse a la primera emisión
      map(user => {
        if (user) {
          return true; // hay sesión → permite acceso
        } else {
          this.router.navigate(['/login']); // No sesión → redirige
          return false;
        }
      })
    );
  }
}
