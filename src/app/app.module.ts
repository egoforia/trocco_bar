import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import {MessageService} from "../providers/message-service-mock";
import {RestaurantService} from "../providers/restaurant-service-mock";
import {DishService} from "../providers/dish-service-mock";
import {CategoryService} from "../providers/category-service-mock";
import {CartService} from "../providers/cart-service-mock";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

import { RestaurantFireService } from "../providers/restaurant-fire-service";
import { CartFireService } from "../providers/cart-fire-service";
import { OrdersFireService } from "../providers/orders-fire-service";
import { UsersFireService } from '../providers/users-fire-service';

import { Facebook } from '@ionic-native/facebook';
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
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
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
    StatusBar,
    SplashScreen,
    Keyboard,
    RestaurantService,
    DishService,
    CategoryService,
    MessageService,
    CartService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Firebase,
    AngularFireDatabase,
    RestaurantFireService,
    CartFireService,
    OrdersFireService,
    UsersFireService,
    OrdersLobbyFireService,
    Facebook
  ]
})
export class AppModule {}
