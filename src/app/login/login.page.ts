import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IUserBasicInfo } from '../interfaces/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  isAlertOpen = false;
  alertHeader = '';
  alertMessage = '';
  alertButtons: any[] = ['OK'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.mostrarAlerta('⚠️ Campos vacíos', 'Por favor, completa correo y contraseña.');
      return;
    }

    try {
      const user: IUserBasicInfo = await this.authService.login(this.email, this.password);
      console.log('Usuario logueado:', user);

      const nombre = user.displayName || user.email;
      this.mostrarAlerta('👋 Bienvenido', `Hola ${nombre}, ¡Has iniciado sesión con éxito!`, true);
    } catch (error) {
      console.error('Error en login:', error);
      this.mostrarAlerta('❌ Error', 'Credenciales inválidas o usuario no encontrado.');
    }
  }

  async loginGoogle() {
    try {
      const user: IUserBasicInfo = await this.authService.loginWithGoogle();
      console.log('Usuario con Google:', user);

      const nombre = user.displayName || user.email;
      this.mostrarAlerta('👋 Bienvenido', `Bienvenido, estimado ${nombre}, ¡Su inicio de sesión con Google ha sido correcto!`, true);
    } catch (error) {
      console.error('Error en login con Google:', error);
      this.mostrarAlerta('❌ Error', 'No se pudo iniciar sesión con Google.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private mostrarAlerta(header: string, message: string, redirigirHome: boolean = false) {
    this.alertHeader = header;
    this.alertMessage = message;

    if (redirigirHome) {
      this.alertButtons = [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }
      }];
    } else {
      this.alertButtons = ['OK'];
    }

    this.isAlertOpen = true;
  }
}
