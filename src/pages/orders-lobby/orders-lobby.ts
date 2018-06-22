import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController  } from 'ionic-angular';
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
  restaurant: Observable<any>;
  guests: Array<any>;
  activeOrders: Array<any>;
  finishedOrders: Array<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public restaurantService: RestaurantFireService,
    public usersService: UsersFireService,
    public ordersLobbyService: OrdersLobbyFireService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
    this.guests          = [];
    this.activeOrders    = [];
    this.finishedOrders  = [];

    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
      this.getGuests();
      this.getActiveOrders();
      this.getFinishedOrders();
    });
  }

  showLoading() {
    this.loadingCtrl.create({
      content: "Atualizando lista...",
      duration: 3000
    }).present();
  }

  getGuests() {
    this.ordersLobbyService.getGuests$().subscribe((guests: any) => {
      if (guests) {
        this.guests = Object.keys(guests).map((key: any) => {
          return {
            user_id: key,
            status: guests[key]["status"],
            created_at: new Date(guests[key]["created_at"])
          }
        });

        this.sortListAndGetUserInformation(this.guests);
        this.guests = this.guests.filter((item: any) => item.status == "waiting");
      } else {
        this.guests = [];
      }

      if (this.guests.length > 0) {
        this.showLoading();
      }
    });
  }

  getActiveOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if(orders) {
        this.activeOrders = Object.keys(orders).map((key: any) => {
          return {
            id: key,
            status: orders[key]["status"],
            user_id: orders[key]["user_id"],
            dishes: orders[key]["dishes"] || [],
            check_number: orders[key]["check_number"]
          }
        });
        this.activeOrders = this.activeOrders.filter((item: any) => {
          if(item.status == "preparing" || item.status == "ready" || item.status == "open") {
            return item;
          }
        });
        this.sortListAndGetUserInformation(this.activeOrders, 'check_number', '>');
      } else {
        this.activeOrders = [];
      }

      if(this.activeOrders.length > 0) {
        this.showLoading();
      }
    });
  }

  getFinishedOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.finishedOrders = Object.keys(orders).map((key: any) => {
          return {
            id: key,
            status: orders[key]["status"],
            user_id: orders[key]["user_id"],
            dishes: orders[key]["dishes"] || [],

          }
        });
        this.finishedOrders = this.finishedOrders.filter((item: any) => item.status == "ok");
        this.sortListAndGetUserInformation(this.finishedOrders, 'check_number', '>');
      } else {
        this.finishedOrders = [];
      }

      if (this.finishedOrders.length > 0) {
        this.showLoading();
      }
    });
  }

  getGuestUserInformation(entry) {
    const sub = this.usersService.getUser$(entry.user_id).subscribe((user: any) => {
      entry = Object.assign(entry, user);
      sub.unsubscribe();
    });
  }

  sortListAndGetUserInformation(list, sort_by = 'created_at', operator = '<') {
    if(operator == '<') {
      list = list.sort((a, b) => a[sort_by] < b[sort_by]);
    } else {
      list = list.sort((a, b) => a[sort_by] > b[sort_by]);
    }

    list.map((entry: any) => this.getGuestUserInformation(entry));
  }

  setPreparing(order_id) {
    this.ordersLobbyService.setPreparing(order_id);
  }

  openOrderDetailModal(order, status) {
    const modal = this.modalCtrl.create('page-order-modal', { type: status, order: order })
    modal.present();
  }
}
