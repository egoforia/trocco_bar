import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UsersFireService } from './users-fire-service';
import { RestaurantFireService } from './restaurant-fire-service';

@Injectable()
export class OrdersLobbyFireService {
  restaurant: any = {};
  openOrdersRef: AngularFireList<{}>;
  today: string = '';
  guests: Array<any>;

  constructor(public afDB: AngularFireDatabase, public usersService: UsersFireService, public restaurantService: RestaurantFireService) {
    this.today = new Date().toISOString().slice(0, 10);
    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
    });
  }

  getOrderRef(order_id) {
    return this.afDB.object(`orders/${this.restaurant.id}/${this.today}/${order_id}`);
  }

  getGuests$() {
    return this.afDB.object(`guests/${this.today}/${this.restaurant.id}`).valueChanges();
  }

  getOrders$() {
    return this.afDB.object(`orders/${this.restaurant.id}/${this.today}`).valueChanges();
  }

  getOpenOrders$() {
    // return this.openOrdersRef.snapshotChanges()
    //   .map(orders => {
    //     orders.forEach((order: any) => {
    //       order.dishes = order.payload.val().dishes;

    //       // load dishes
    //       order.dishes.forEach((item: any) => {
    //         item.dish = this.getDish$(item.dish_id);
    //       });

    //       console.log('order dishes: ', order.dishes);

    //       // load user
    //       order.user$ = this.usersService.getUser$(order.payload.val().user_id);
    //       order.key;
    //     });

    //     return orders;
    //   });
  }

  getDish$(dish_id) {
    return this.afDB.object(`estabelecimentos/${this.restaurant.id}/dishes/${dish_id}`).valueChanges();
  }

  setGuestToOpen(guest, check_number) {
    this.afDB.object(`guests/${this.today}/${this.restaurant.id}/${guest.user_id}`).update({check_number: check_number, status: "open"}).then(() => {
      return this.afDB.list(`orders/${this.restaurant.id}/${this.today}`).push({
        user_id: guest.user_id,
        check_number: check_number,
        status: "open",
        created_at: + new Date()
      });
    });
  }

  cancelGuest(guest) {
    return this.afDB.object(`guests/${this.today}/${this.restaurant.id}/${guest.user_id}`).update({status: "canceled" });
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
