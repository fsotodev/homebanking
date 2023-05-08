import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthFirebaseService,
    private router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const user = await this.auth.userInfo();
    const isLoggedIn = !!user;
    const path = next.data.controlName;
    if (!isLoggedIn) {
      await this.router.navigateByUrl('/login');
      return false;
    } else if (user.type !== 'admin' && !!path && path !== 'home' && !user.access.includes(path)) {
      console.error('insufficient permissions');
      return false;
    }

    return isLoggedIn;
  }
}
