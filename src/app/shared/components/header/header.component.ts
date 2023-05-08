import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { Router } from '@angular/router';
import { FirebaseService } from '@apps/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  version = environment.version;

  constructor(
    public _auth: AuthFirebaseService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async logout() {
    await this._auth.signOut();
    await this.router.navigateByUrl('/login');
  }

  async navigateTo(page: string, param = null) {
    page = param ? page + `/${param}` : page;
    await this.router.navigateByUrl(`/${page}`);
  }

  adminLabel() {
    const route = this.router.url.split('/')[1];
    if (route === 'login' ||
      route === 'home' ||
      route === 'benefit-creation-step-one' ||
      route === 'benefit-creation-step-two') {
      return 'Beneficios';
    } else if (route === 'load-product-manually' ||
      route === 'new-product') {
      return 'Productos';
    }
    return 'Beneficios';
  }

  isNotinProdButPointingProd() {
    const urlProd = 'https://banco-ripley-app.firebaseapp.com/';
    const isPointingToProd = this.firebaseService.isPointingToProd();
    const isUrlProd = window.location.href.includes(urlProd);
    return isPointingToProd && !isUrlProd;
  }

}
