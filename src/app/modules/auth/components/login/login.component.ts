import { AfterContentInit, Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterContentInit {

  loginForm: FormGroup;
  formControls: {
    email: AbstractControl;
    pwd: AbstractControl;
  };
  errorMessage: string;
  loggedIn: boolean;

  /* eslint-disable max-len */
  constructor(
    private _router: Router,
    private authFirebaseService: AuthFirebaseService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]],
      pwd: ['', [Validators.required]]
    });
    this.formControls = {
      email: this.loginForm.get('email'),
      pwd: this.loginForm.get('pwd')
    };
    this.loggedIn = true;
    this.errorMessage = '';

  }

  async ngAfterContentInit(): Promise<void> {
    let user;
    const userObs = this.authFirebaseService.user;
    if (userObs) {
      user = await this.authFirebaseService.user.toPromise();
    }
    if (user) {
      this._router.navigate(['/home']);
    } else {
      this.loggedIn = false;
    }
  }

  public getErrorMessage(): string {
    return this.formControls.email.hasError('required') ? 'El campo no debe estar vacío' :
      this.formControls.email.status === 'INVALID' ? 'Email inválido' : '';
  }

  public login() {
    this.errorMessage = '';
    if (!this.loginForm.get('email').value) {
      return;
    }

    const credentials = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('pwd').value
    };

    this.authFirebaseService.signInWithEmail(credentials)
      .then(
        async () => {
          await this._router.navigateByUrl('/home');
        },
        (error) => {
          this.errorMessage = error.code === 'auth/user-not-found' ? 'El usuario no existe.' : 'Clave incorrecta.';
        }
      );
  }
}
