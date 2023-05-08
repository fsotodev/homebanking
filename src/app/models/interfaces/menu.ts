export interface Menu {
  id: string;
  name: string;
  icon?: string;
  navigateTo?: string;
  submenus?: Menu[];
}
