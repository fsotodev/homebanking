export interface User {
  displayName: string;
  email: string;
  uid: string;
  type: string;
  access: Array<string>;
  onOff: Array<string>;
}
