import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { OrdersFireService } from '../../providers/orders-fire-service';
import { Observable } from 'rxjs/Observable';

@IonicPage({
	name: 'page-orders',
	segment: 'orders'
})

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})

export class OrdersPage {
	order$: Observable<any>;

  constructor(
		public navCtrl: 			NavController,
		public navParams: 		NavParams,
		public toastCtrl: 		ToastController,
		public ordersService: OrdersFireService,
		private alertCtrl: 		AlertController
	) {
		this.getLastOrder();
  }

  ionViewDidLoad() {

  }

	getLastOrder() {
		this.order$ = this.ordersService.getLastOrder();
	}

	openRestaurantDetail() {
		this.navCtrl.push('page-restaurant-detail');
	}

	openCheck() {
		this.navCtrl.push('page-cart');
	}

  sendOrder() {
		let alert = this.alertCtrl.create({
			title: 'Confirmar Pedido',
      message: "Ao clicar em confirmar, você se responsabiliza por pagar seu pedido.",
			buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
						console.log(data);
						this.ordersService.addToCart()
							.then(order => {
								let toast = this.toastCtrl.create({
					          message: 'Seu pedido foi enviado para o balcão.',
					          cssClass: 'mytoast',
					          duration: 2000
					      });
					      toast.present(toast);
							});
          }
        }
      ]
		});

		alert.present();
	}
}
