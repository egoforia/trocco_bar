import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from "angularfire2/database";
import { RestaurantFireService } from "../../providers/restaurant-fire-service";
import { UsersFireService } from "../../providers/users-fire-service";
import { OrdersLobbyFireService } from "../../providers/orders-lobby-fire-service"

@IonicPage({
  name: "page-bar-lobby",
  segment: "bar-lobby"
})
@Component({
  selector: "page-bar-lobby",
  templateUrl: "bar-lobby.html",
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

  convertOrderToObject(array, key) {
    return {
      id: key,
      status: array[key]["status"],
      user_id: array[key]["user_id"],
      dishes: array[key]["dishes"] || [],
      check_number: array[key]["check_number"],
      created_at: new Date(array[key]["created_at"])
    }
  }

  getOpenOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.openOrders = Object.keys(orders).map((key: any) => this.convertOrderToObject(orders, key));
        this.openOrders = this.openOrders.filter((item: any) => item.status == "open");
        this.openOrders.map((order: any) => this.getDishesInformation(order));
        this.sortListAndGetUserInformation(this.openOrders, "created_at", ">");
      } else {
        this.openOrders = [];
      }
    });
  }

  getPreparingOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.preparingOrders = Object.keys(orders).map((key: any) => this.convertOrderToObject(orders, key));
        this.preparingOrders = this.preparingOrders.filter((item: any) => item.status == "preparing");
        this.preparingOrders.map((order: any) => this.getDishesInformation(order));
        this.sortListAndGetUserInformation(this.preparingOrders, "created_at", ">");
      } else {
        this.preparingOrders = [];
      }
    });
  }

  getReadyOrders() {
    this.ordersLobbyService.getOrders$().subscribe((orders: any) => {
      if (orders) {
        this.readyOrders = Object.keys(orders).map((key: any) => this.convertOrderToObject(orders, key));
        this.readyOrders = this.readyOrders.filter((item: any) => item.status == "ready");
        this.readyOrders.map((order: any) => this.getDishesInformation(order));
        this.sortListAndGetUserInformation(this.readyOrders, "created_at", ">");
      } else {
        this.readyOrders = [];
      }
    });
  }

  sortListAndGetUserInformation(list, sort_by = "created_at", operator = "<") {
    if (operator == "<") {
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

  changeOrderStatusTo(order, status = "preparing") {
    this.ordersLobbyService.getOrderRef(order.id).update({ status: status });
  }

  getDishesInformation(order){
    order.dishes.forEach((item, _index) => {
      const sub = this.ordersLobbyService.getDish$(item.dish_id).subscribe((data) => {
        item = Object.assign(item, data);
        sub.unsubscribe();
      });
    });
  }

  summary(order) {
    const dishes_and_quantity = [];

    order.dishes.forEach((dish: any) => {
      dishes_and_quantity.push(`${dish.quantity}x ${dish.name}`);
    });

    return dishes_and_quantity;
  }
}
