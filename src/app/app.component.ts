import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { FCM } from '@ionic-native/fcm';

import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantFireService } from '../providers/restaurant-fire-service'

import { AngularFireAuth } from 'angularfire2/auth';
declare var FCMPlugin: any;

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class foodIonicApp {
    @ViewChild(Nav) nav: Nav;

  	tabsPlacement: string = 'bottom';
  	tabsLayout: string = 'icon-top';

    rootPage: any;
    showMenu: boolean = true;

    homeItem: any;

    initialItem: any;

    messagesItem: any;

    settingsItem: any;

    appMenuItems: Array<MenuItem>;

    yourRestaurantMenuItems: Array<MenuItem>;

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;

    constructor(
      public platform: Platform,
      public firebase: Firebase,
      public afDB: AngularFireDatabase,
      public afAuth: AngularFireAuth,
      public alertCtrl: AlertController,
      private restaurantService: RestaurantFireService,
      private fcm: FCM
    ) {
      this.initializeApp();

      this.homeItem = { component: 'page-home' };
      this.messagesItem = { component: 'page-message-list'};

      this.appMenuItems = [
        {title: 'Restaurants', component: 'page-restaurant-list', icon: 'home'},
        {title: 'Dish List', component: 'page-dish-list', icon: 'pizza'},
        {title: 'Nearby', component: 'page-nearby', icon: 'compass'},
        {title: 'By Category', component: 'page-category', icon: 'albums'},
        {title: 'Latest Orders', component: 'page-orders', icon: 'list-box'},
        {title: 'Cart', component: 'page-cart', icon: 'cart'},
        {title: 'Favorite Restaurants', component: 'page-favorite-list', icon: 'heart'},
        {title: 'Orders Lobby', component: 'page-orders-lobby', icon: 'heart'}
      ];

      this.yourRestaurantMenuItems = [
        {title: 'Register Restaurant', component: 'page-your-restaurant', icon: 'clipboard'}
      ];

      this.accountMenuItems = [
        {title: 'Login', component: 'page-auth', icon: 'log-in'},
        {title: 'My Account', component: 'page-my-account', icon: 'contact'},
        {title: 'Logout', component: 'page-auth', icon: 'log-out'},
      ];

      this.helpMenuItems = [
        {title: 'Extra Pages (with Animations)', component: 'page-custom-pages', icon: 'albums'},
        {title: 'About', component: 'page-about', icon: 'information-circle'},
        {title: 'Support', component: 'page-support', icon: 'call'},
        {title: 'App Settings', component: 'page-settings', icon: 'cog'},
        {title: 'Walkthrough', component: 'page-walkthrough', icon: 'photos'}
      ];
    }

    initializeApp() {
      this.platform.ready().then(() => {
        if(this.platform.is('cordova')) {
          // Should update user with a field with device_token_id
          this.fcm.getToken().then((token: String) => {
            console.log(`Device Token Id: ${token}`)
          });
          this.pushsetup();
        }
        const authSubscription = this.afAuth.authState.subscribe((user: any) => {
          console.log('authState subscribed user: ', JSON.stringify(user));

          // logged user
          if (user) {
            this.restaurantService.setActiveByEmail(user.email,
              () => {
                this.rootPage = 'page-orders-lobby';
              },
              (e: Error) => {
                console.error(e);
                this.logout();
              }
            );

          }
          // no user
          else {
            this.rootPage = 'page-auth';
          }

          authSubscription.unsubscribe();
        });
      });
      

	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
      }
    }

    pushsetup() {
      setTimeout(() => {
        FCMPlugin.onNotification((data: any) => {
          console.log(data)
          this.alertCtrl.create({
            title: data.title,
            message: data.message
          }).present();
        }, (error) => {
          console.log(error);
        });
      }, 5000);
    }

    initializeFirebase() {
      this.firebase.getToken()
        .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

    logout() {
      this.afAuth.auth.signOut();
      this.nav.setRoot('page-auth');
    }
}
