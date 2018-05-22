import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class UsersFireService {

  constructor(public afDB: AngularFireDatabase) {

  }

  getUserRef(user_id: string) {
    return this.afDB.object(`users/${user_id}`);
  }

  getUser$(user_id: string) {
    return this.getUserRef(user_id).valueChanges();
  }

  saveUser(user: any) {
    // clean up empty values
    Object.keys(user).forEach(key => {
     if(!user[key] && user[key] !== false){
        delete user[key];
      }
    });

    return this.getUserRef(user.uid).update(user);
  }

}
