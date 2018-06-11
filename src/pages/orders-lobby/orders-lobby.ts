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
  restaurant: Observable<any>;
  guests: Observable<any[]> = [];
  activeOrders: Observable<any[]>;
  finishedOrders: Observable<any[]>;

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
      this.getGuests();
      this.getActiveOrders();
      this.getFinishedOrders();
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrdersLobbyPage');
  }

  getGuests() {
    this.ordersLobbyService.getGuests().subscribe((guests: any) => {
      if (guests) {
        this.guests = Object.keys(guests).map((key) => {
          return {
            user_id: key,
            status: guests[key]["status"],
            client_name: guests[key]["client_name"],
            created_at: new Date(guests[key]["created_at"])
          }
        });

        this.guests = this.guests.sort((a, b) => a.created_at > b.created_at);
        this.guests.map((entry) => this.getGuestUserInformation(entry));
      }
    });
  }

  getActiveOrders() {
    this.ordersLobbyService.getActiveOrders$().subscribe((orders: Array<any>) => {
      this.activeOrders = orders;
      this.sortListAndGetUserInformation(this.activeOrders);
    });
  }

  getFinishedOrders() {
    this.ordersLobbyService.getFinishedOrders$().subscribe((orders: Array<any>) => {
      this.finishedOrders = orders;
      this.sortListAndGetUserInformation(this.finishedOrders);
    });
  }

  getGuestUserInformation(entry) {
    const sub = this.usersService.getUser$(entry.user_id).subscribe((user: any) => {
      entry = Object.assign(entry, user);
      sub.unsubscribe();
    });
  }

  sortListAndGetUserInformation(list) {
    list = list.sort((a, b) => a.created_at > b.created_at);
    list.map((entry) => this.getGuestUserInformation(entry));
  }

  setPreparing(order_id) {
    this.ordersLobbyService.setPreparing(order_id);
  }

}
