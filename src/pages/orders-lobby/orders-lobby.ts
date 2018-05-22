import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';
import { UsersFireService } from '../../providers/users-fire-service';
import { OrdersLobbyFireService } from '../../providers/orders-lobby-fire-service'

@IonicPage({
  name: 'page-orders-lobby',
	segment: 'orders-lobby'
})
@Component({
  selector: 'page-orders-lobby',
  templateUrl: 'orders-lobby.html',
})
export class OrdersLobbyPage {

  open$: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public restaurantService: RestaurantFireService,
    public usersService: UsersFireService,
    public ordersLobbyService: OrdersLobbyFireService
  ) {
    this.open$ = this.ordersLobbyService.getOpenOrders$()
    // this.open$.subscribe(orders => {
    //   debugger;
    // });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrdersLobbyPage');
  }

  setPreparing(order_id) {
    this.ordersLobbyService.setPreparing(order_id);
  }

}
