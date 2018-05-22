import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

// import {DishService} from '../../providers/dish-service-mock';

import { OrdersFireService } from '../../providers/orders-fire-service';
import { RestaurantFireService } from '../../providers/restaurant-fire-service'
import { CartFireService } from '../../providers/cart-fire-service'
import { Observable } from 'rxjs/Observable';

@IonicPage({
	name: 'page-dish-detail',
	segment: 'dish/:id'
})

@Component({
    selector: 'page-dish-detail',
    templateUrl: 'dish-detail.html'
})
export class DishDetailPage {
	id: number;
	restaurant_id: number;
  dish: any;
  qtd: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public restaurantService: RestaurantFireService, public ordersService: OrdersFireService) {
    this.id = this.navParams.get('id');
		// this.restaurant_id = this.navParams.get('restaurant_id');

		this.restaurantService.getDish(this.id).subscribe(dish => {
			this.dish = dish;
		});
  }

  // minus adult when click minus button
  minusQtd() {
    this.qtd--;
  }
  // plus adult when click plus button
  plusQtd() {
    this.qtd++;
  }

  addToOrder(dish, qtd) {
		this.ordersService.addDish(dish, qtd);
		let toast = this.toastCtrl.create({
      message: `${qtd} x ${dish.name} foi adicionado ao pedido`,
      cssClass: 'mytoast',
      duration: 2000
    });
    toast.present(toast);

		this.navCtrl.pop();
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

	canAddToOrder():boolean {
		const lastOrder = this.ordersService.getLastOrder().getValue();

		if (!lastOrder.status || lastOrder.status == 'finalized' || lastOrder.status == 'canceled')
			return true;
		else
			return false;
	}

}
