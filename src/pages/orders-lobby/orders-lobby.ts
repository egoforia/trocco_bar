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
  menuopts: String = 'waiting';
  orders: Array<any>;

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
    //   console.log(orders)
    // });

    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
      this.ordersLobbyService.getGuests().subscribe(guests => {
        this.guests = Object.keys(guests).map((key) => {
          return { user_id: key, status: guests[key]["status"] }
        });
      });
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrdersLobbyPage');
  }

  getGuestUserInformation(user_id) {

  }

  setPreparing(order_id) {
    this.ordersLobbyService.setPreparing(order_id);
  }

}
