import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';
import { UsersFireService } from '../../providers/users-fire-service';
import { OrdersLobbyFireService } from '../../providers/orders-lobby-fire-service'

@IonicPage({
  name: 'page-bar-lobby',
  segment: 'bar-lobby'
})
@Component({
  selector: 'page-bar-lobby',
  templateUrl: 'bar-lobby.html',
})
export class BarLobbyPage {
  restaurant: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public restaurantService: RestaurantFireService,
    public usersService: UsersFireService,
    public ordersLobbyService: OrdersLobbyFireService,
    public modalCtrl: ModalController
  ) {
    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarLobbyPage');
  }

}
