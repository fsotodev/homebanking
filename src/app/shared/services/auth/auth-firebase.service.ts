import { first, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { of } from 'rxjs/internal/observable/of';
import { User } from '@apps/shared/models/user.interface';
import { Observable } from 'rxjs/';

@Injectable()
export class AuthFirebaseService {
  user: Observable<User>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private _afs: AngularFirestore
  ) {
  }

  async signInWithEmail(credentials) {
    return this.angularFireAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  async getUser(): Promise<void> {
    const user = await this.angularFireAuth.authState.pipe(first()).toPromise();
    if (user) {
      this.user = this._afs.doc<User>(`adminUsers/${user.uid}`).valueChanges();
    } else {
      this.user = of(null);
    }
  }

  async getIdToken() {
    const user = await this.angularFireAuth.authState.pipe(first()).toPromise();
    return user.getIdToken();
  }

  async getUserObs() {
    return await this.user
      .pipe(
        take(1),
        map(u => u)
      )
      .toPromise();
  }

  async userInfo() {
    await this.getUser();
    return await this.getUserObs();
  }

  async hasAccessTo(page: string) {
    const userInfo = await this.getUserObs();
    return userInfo.type === 'admin' || userInfo.access.includes(page);
  }

  async signOut(): Promise<void> {
    return this.angularFireAuth.signOut()
      .then(() => {
        this.user = of(null);
        Promise.resolve(true);
      });
  }


  updateUser(cred: any, login = false) {
    const data = {
      full: {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName
      },
      short: {
        uid: cred.user.uid,
        email: cred.user.email,
      }
    }[login ? 'short' : 'full'];
    const userRef: AngularFirestoreDocument<any> = this._afs.doc(`adminUsers/${data.uid}`);
    return userRef.update(data);
  }

  async createUser(user: any) {
    return new Promise<any>(
      async (resolve, reject) => (await this.angularFireAuth).createUserWithEmailAndPassword(user.email, user.password)
        .then((userCreds) => {
          const userData: User = {
            displayName: user.displayName,
            email: userCreds.user.email,
            uid: userCreds.user.uid,
            type: user.type,
            access: user.access,
            onOff: user.onOff,
          };
          const userRef: AngularFirestoreDocument<User> = this._afs.doc(`adminUsers/${userCreds.user.uid}`);
          return userRef.set(userData);
        },
        err => reject(err))
        .then((_) => {
          resolve(true);
        })
        .catch((err) => reject(err)));
  }
}
