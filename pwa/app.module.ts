import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
// import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';

import { RestaurantFireService } from "../providers/restaurant-fire-service";
import { CartFireService } from "../providers/cart-fire-service";
import { OrdersFireService } from "../providers/orders-fire-service";
import { UsersFireService } from '../providers/users-fire-service';
import { OrdersLobbyFireService } from '../providers/orders-lobby-fire-service';

export const firebaseConfig = {
  apiKey: "AIzaSyCpeYNLer4m1nEG_ZT6N50dnoZfbeIpj4Y",
  authDomain: "trocco-ea3f1.firebaseapp.com",
  databaseURL: "https://trocco-ea3f1.firebaseio.com",
  projectId: "trocco-ea3f1",
  storageBucket: "trocco-ea3f1.appspot.com",
  messagingSenderId: "15700150803"
};

@NgModule({
  declarations: [
    foodIonicApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(foodIonicApp, {
			preloadModules: true,
			iconMode: 'md',
			mode: 'md'
    }),
    IonicStorageModule.forRoot({
      name: '__foodIonicDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    PipesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    foodIonicApp
  ],
  providers: [
    Firebase,
    AngularFireDatabase,
    RestaurantFireService,
    CartFireService,
    OrdersFireService,
    UsersFireService,
    OrdersLobbyFireService,
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    // { provide: APP_BASE_HREF, useValue : '/' },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
