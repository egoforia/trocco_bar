import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { RestaurantFireService } from './restaurant-fire-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class CartFireService {

  ordersRef: AngularFireList<{}>;

  userId: String;

  totalSubject:         BehaviorSubject<number>   = new BehaviorSubject<number>(0);
  canDoCheckoutSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private afDB: AngularFireDatabase, private restaurantService: RestaurantFireService, private afAuth: AngularFireAuth) {
    // async solution
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userId = user.uid
    //     this.orders = this.afDB.list(`orders/${this.restaurantService.getActive().id}/${this.userId}`);
    //   }
    // });

    try {
      const uid = this.afAuth.auth.currentUser.uid;
      const today = new Date().toISOString().slice(0, 10);
      const restaurant_id = this.restaurantService.getActive().id;

      // this.ordersRef = this.afDB.list(`guests/${today}/${restaurant_id}/${uid}/orders`);
      this.ordersRef = this.afDB.list(`orders/${restaurant_id}/${today}`)
    } catch (e) {
      console.error(e);
    }
  }

  addToCart(dishes) {
    console.log(this.ordersRef);
    // return this.orders.push({dish_id: dish.id, quantity: quantity, status: 'preparing'});
    return this.ordersRef.push({
      status:   "open",
      user_id:  this.afAuth.auth.currentUser.uid,
      dishes:   dishes.map(item => {
        return { dish_id: item.dish_id, quantity: item.quantity };
      })
    });
  }

  getOrders() {
    return this.ordersRef.valueChanges()
      .map(orders => {
        // check if user can do checkout
        let canDoCheckout = orders.length > 0 && orders.filter((order: any) => {
          return order.status != 'finalized' && order.status != 'canceled'
        }).length == 0;
        this.canDoCheckoutSubject.next(canDoCheckout);

        console.log('can do checkout? ', canDoCheckout);

        return orders.map((order: any) => {
          this.clearTotal();

          order.dishes.forEach(item => {
            item.dish = this.restaurantService.getDish(item.dish_id);
            // sum to total if order has been finalized
            if (order.status == 'finalized')
              item.dish.subscribe(dish => {
                this.addToTotal(dish.price * item.quantity);
              });
          });
          return order;
        });
      });
  }

  addToTotal(value: number) {
    let total = this.totalSubject.getValue();
    total += value;
    this.totalSubject.next(total);
  }

  clearTotal() {
    this.totalSubject.next(0);
  }

  removefromCart(order) {
    // let index = this.orders.indexOf(order);
    // if (index > -1) {
    //   this.orders.splice(index, 1);
    // }
    // return Promise.resolve();
  }

  editQtdOrder(order, op) {
  	// let order = this.orders[id - 1]
		// let index = this.orders.indexOf(order);
		// let order;
  //   if (index > -1) {
  //     this.orders[index];
  //   }

		// for (let i in this.orders) {
		// 	if (this.orders[i].id === order.id) {
		// 		if (op === 'minus') {
		// 			this.orders[i].qtd--;
		//     	break;
		// 		}
		// 		if (op === 'plus') {
		// 			this.orders[i].qtd++;
		//     	break;
		// 		}
		// 	}
		// }
		return Promise.resolve();
  }

  cleanCart() {
  	// this.orders = [];
  }

  // findAll() {
  //   return Promise.resolve(restaurants);
  // }

  // findById(id) {
  //   return Promise.resolve(restaurants[id - 1]);
  // }

  // findByName(searchKey: string) {
  //   let key: string = searchKey.toUpperCase();
  //   return Promise.resolve(restaurants.filter((restaurant: any) =>
  //       (restaurant.title +  ' ' +restaurant.address +  ' ' + restaurant.city + ' ' + restaurant.description).toUpperCase().indexOf(key) > -1));
  // }

  // getFavorites() {
  //   return Promise.resolve(this.favorites);
  // }

  // favorite(restaurant) {
  //   this.favoriteCounter = this.favoriteCounter + 1;
  //   this.favorites.push({id: this.favoriteCounter, restaurant: restaurant});
  //   return Promise.resolve();
  // }

  // unfavorite(favorite) {
  //   let index = this.favorites.indexOf(favorite);
  //   if (index > -1) {
  //     this.favorites.splice(index, 1);
  //   }
  //   return Promise.resolve();
  // }

}
