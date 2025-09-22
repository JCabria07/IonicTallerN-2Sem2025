import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReverseAuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (user) {
          this.router.navigate(['/home']); // si ya está logueado →  home
          return false;
        } else {
          return true; // Si no está logueado → login
        }
      })
    );
  }
}
