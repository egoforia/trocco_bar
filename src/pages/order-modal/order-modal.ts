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
  public custom_id: String = '';

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private orderLobbyService: OrdersLobbyFireService,
      public alertCtrl: AlertController
  ) {
    this.type = this.navParams.get('type');
    this.order = this.navParams.get('order');
    this.getDishes();
  }

  closeModal() {
    this.navCtrl.pop();
  }

  openOrder() {
    this.orderLobbyService.setGuestToOpen(this.order, this.custom_id);
    this.closeModal();
  }

  getDishes() {
    if(this.order.dishes) {
      this.order.dishes.forEach((item, index) => {
        const sub = this.orderLobbyService.getDish$(item.dish_id).subscribe((data) => {
          item = Object.assign(item, data);
          sub.unsubscribe();
        })
      });
    }
  }

  changeOrderStatusTo(status = 'preparing') {
    this.orderLobbyService.getOrderRef(this.order.id).update({ status: status });
    this.closeModal();
  }
}
