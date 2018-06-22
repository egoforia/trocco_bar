import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  public entrance_value: Float32Array = 0.0;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private orderLobbyService: OrdersLobbyFireService
  ) {
    this.type = this.navParams.get('type');
    this.order = this.navParams.get('order');
    this.getDishes();
  }

  closeModal() {
    this.navCtrl.pop();
  }

  openOrder() {
    this.orderLobbyService.setGuestToOpen(this.order, this.check_number, this.entrance_value);
    this.closeModal();
  }

  getDishes() {
    if(this.order.dishes) {
      this.order.dishes.forEach((item, _index) => {
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
