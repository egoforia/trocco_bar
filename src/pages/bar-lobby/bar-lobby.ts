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
  openOrders: Array<any>;
  preparingOrders: Array<any>;
  readyOrders: Array<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public restaurantService: RestaurantFireService,
    public usersService: UsersFireService,
    public ordersLobbyService: OrdersLobbyFireService,
    public modalCtrl: ModalController
  ) {
    this.openOrders      = [];
    this.preparingOrders = [];
    this.readyOrders     = [];

    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
      this.getOpenOrders();
      this.getPreparingOrders();
      this.getReadyOrders();
    });
  }

  getOpenOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.openOrders = Object.keys(orders).map((key: any) => {
          return {
            id: key,
            status: orders[key]["status"],
            user_id: orders[key]["user_id"],
            dishes: orders[key]["dishes"],
            custom_id: orders[key]["custom_id"]
          }
        });
        this.openOrders = this.openOrders.filter((item: any) => item.status == "open");
        this.sortListAndGetUserInformation(this.openOrders, 'custom_id', '>');
      } else {
        this.openOrders = [];
      }
    });
  }

  getPreparingOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.preparingOrders = Object.keys(orders).map((key: any) => {
          return {
            id: key,
            status: orders[key]["status"],
            user_id: orders[key]["user_id"],
            dishes: orders[key]["dishes"],
            custom_id: orders[key]["custom_id"]
          }
        });
        this.preparingOrders = this.preparingOrders.filter((item: any) => item.status == "preparing");
        this.sortListAndGetUserInformation(this.preparingOrders, 'custom_id', '>');
      } else {
        this.preparingOrders = [];
      }
    });
  }

  getReadyOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.readyOrders = Object.keys(orders).map((key: any) => {
          return {
            id: key,
            status: orders[key]["status"],
            user_id: orders[key]["user_id"],
            dishes: orders[key]["dishes"],
            custom_id: orders[key]["custom_id"]
          }
        });
        this.readyOrders = this.readyOrders.filter((item: any) => item.status == "ready");
        this.sortListAndGetUserInformation(this.readyOrders, 'custom_id', '>');
      } else {
        this.readyOrders = [];
      }
    });
  }

  sortListAndGetUserInformation(list, sort_by = 'created_at', operator = '<') {
    if (operator == '<') {
      list = list.sort((a, b) => a[sort_by] < b[sort_by]);
    } else {
      list = list.sort((a, b) => a[sort_by] > b[sort_by]);
    }

    list.map((entry: any) => this.getGuestUserInformation(entry));
  }

  getGuestUserInformation(entry) {
    const sub = this.usersService.getUser$(entry.user_id).subscribe((user: any) => {
      entry = Object.assign(entry, user);
      sub.unsubscribe();
    });
  }
}
