import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersFireService {
    constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {

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

    getCurrentUser$() {
        const observable = Observable.create((obs) => {
            this.afAuth.authState.subscribe((user: any) => {
                const email = user.email;

                this.afDB.list('estabelecimentos_users').valueChanges().subscribe((e_users: any) => {
                    const e_user = e_users.filter((user) => user.email === email)[0];

                    this.afDB.list('estabelecimentos').valueChanges().subscribe((restaurants: Array<any>) => {
                        var result = restaurants.filter((restaurant: any) => restaurant.id === e_user.restaurant_id)[0];
                        obs.next(result)
                        obs.complete();
                    });
                });
            });
        });

        return observable;
    }
}
