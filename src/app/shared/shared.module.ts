import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { PERSISTENCE } from '@angular/fire/auth';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    HeaderComponent,
    MenuComponent
  ],
  providers: [
    AuthFirebaseService,
    {provide: PERSISTENCE, useValue: 'local'}
  ]
})
export class SharedModule { }
