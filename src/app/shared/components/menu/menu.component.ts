import {Component, Input, OnInit} from '@angular/core';
import { environment } from '@environments/environment';
import { Menu } from '@apps/models/interfaces/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() enabledMenu: boolean;
  @Input() dataSource: any;
  version = environment.version;
  activeMenu: Menu;
  activeSubMenu: Menu;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  selectMenu(menu: Menu) {
    console.log(menu);
    this.activeMenu = menu;
  }

  async selectSubMenu(submenu: Menu) {
    console.log(submenu);
    this.activeSubMenu = submenu;
    await this.router.navigateByUrl(`/${submenu.navigateTo}`);
  }
}
