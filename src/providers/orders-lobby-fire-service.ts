import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { UsersFireService } from './users-fire-service';

@Injectable()
export class OrdersLobbyFireService {

  restaurant_id: number = 1;

  openOrdersRef: AngularFireList<{}>;
  today: string = '';

  constructor(public afDB: AngularFireDatabase, public usersService: UsersFireService) {
    this.today = new Date().toISOString().slice(0, 10);

    this.openOrdersRef = this.afDB.list(`orders/${this.restaurant_id}/${this.today}`);
  }

  getOrderRef(order_id) {
    return this.afDB.object(`orders/${this.restaurant_id}/${this.today}/${order_id}`);
  }

  getOpenOrders$() {
    return this.openOrdersRef.snapshotChanges()
      .map(orders => {
        orders.forEach((order: any) => {
          order.dishes = order.payload.val().dishes;

          // load dishes
          order.dishes.forEach((item: any) => {
            item.dish = this.getDish$(item.dish_id);
          });

          console.log('order dishes: ', order.dishes);


          // load user
          order.user$ = this.usersService.getUser$(order.payload.val().user_id);
          order.key;

        });

        return orders;
      });
  }

  getDish$(dish_id) {
    return this.afDB.object(`estabelecimentos/${this.restaurant_id}/dishes/${dish_id}`).valueChanges();
  }

  setPreparing(order_id) {
    return this.getOrderRef(order_id).update({ status: 'preparing' });
  }

  setReady(order_id) {
    return this.getOrderRef(order_id).update({ status: 'ready' });
  }

  setFinalized(order_id) {
    return this.getOrderRef(order_id).update({ status: 'finalized' });
  }

  setCanceled(order_id) {
    return this.getOrderRef(order_id).update({ status: 'canceled' });
  }

}
