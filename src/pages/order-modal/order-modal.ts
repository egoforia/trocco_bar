import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { OrdersLobbyFireService } from '../../providers/orders-lobby-fire-service'

@IonicPage({
  name: 'page-order-modal',
  segment: 'order-modal'
})
@Component({
  selector: 'page-order-modal',
  templateUrl: 'order-modal.html',
})
export class OrderModalPage {
  public type: String = 'guest';
  public order: any;
  public check_number: String = '';
  public entrance_value: number = 0.0;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private ordersLobbyService: OrdersLobbyFireService,
      private alertCtrl: AlertController
  ) {
    this.type = this.navParams.get('type');
    this.order = this.navParams.get('order');
    this.getGuestDishes();
  }

  closeModal() {
    this.navCtrl.pop();
  }

  showErrorAlert(message) {
    this.alertCtrl.create({
      title: 'Erro',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: (_data) => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).present();
  }

  openOrder() {
    try {
      this.ordersLobbyService.setGuestToOpen(this.order, this.check_number, Number(this.entrance_value));
    } catch(e) {
      this.showErrorAlert('Não foi possível abrir a comanda, tente novamente');
    }
    this.closeModal();
  }

  mapDishesAndStatus(orders) {
    const dishes = [];

    orders = orders.map(order => {
      return { status: order.status, dishes: (order["dishes"] || []) }
    });

    Object.values(orders).map((order: any) => {
      if(order.dishes.length != 0) {
        Object.values(order.dishes).map((dish: any) => {
          dish.status = order.status;
          dishes.push(dish);
        });
      }
    });

    return dishes;
  }

  getGuestDishes() {
    let dishes = []

    this.ordersLobbyService.filterGuestByUserId$(this.order).subscribe((orders: any) => {
      if (orders) {
        dishes = this.mapDishesAndStatus(orders);
        this.order.dishes = dishes;
        dishes = [];
        this.getDishInformation();
      }
    });
  }

  calcTotal() {
    this.order.total = 0;
    try {
      this.order.total += Number(this.order.entrance_value);
    } catch(e) {}

    this.order.dishes.map((dish) => {
      if(dish.status !== 'canceled') {
        this.order.total += (dish.price * dish.quantity);
      }
    });
  }

  getDishInformation() {
    if(this.order.dishes) {
      this.order.dishes.forEach((item, _index) => {
        const sub = this.ordersLobbyService.getDish$(item.dish_id).subscribe((data) => {
          item = Object.assign(item, data);
          this.order.total += item.price;
          this.calcTotal();
          sub.unsubscribe();
        });
      });
    }
  }

  changeOrderStatusTo(status = 'preparing') {
    this.ordersLobbyService.getOrderRef(this.order.id).update({ status: status });
    this.closeModal();
  }
}
