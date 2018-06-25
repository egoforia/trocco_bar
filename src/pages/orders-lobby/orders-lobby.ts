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
  waitingGuests: Array<any>;
  activeGuests: Array<any>;
  finishedGuests: Array<any>;

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
    this.waitingGuests   = [];
    this.activeGuests    = [];
    this.finishedGuests  = [];

    this.usersService.getCurrentUser$().subscribe((restaurant: any) => {
      this.restaurant = restaurant;
      this.getWaitingGuests();
      this.getActiveGuests();
      this.getFinishedGuests();
    });
  }

  showLoading() {
    this.loadingCtrl.create({
      content: "Atualizando lista...",
      duration: 3000
    }).present();
  }

  convertGuestToObject(array, key) {
    const guest = array[key];

    return {
      user_id: key,
      status: guest["status"],
      entrance_value: guest["entrance_value"],
      check_number: guest["check_number"],
      created_at: new Date(guest["created_at"])
    }
  }

  getWaitingGuests() {
    this.ordersLobbyService.getGuests$().subscribe((guests: any) => {
      if (guests) {
        this.waitingGuests = Object.keys(guests).map((key: any) => this.convertGuestToObject(guests, key));
        this.sortListAndGetUserInformation(this.waitingGuests);
        this.waitingGuests = this.waitingGuests.filter((item: any) => item.status == "waiting");
      } else {
        this.waitingGuests = [];
        this.showLoading();
      }
    });
  }

  getActiveGuests() {
    this.ordersLobbyService.getGuests$().subscribe((guests: any) => {
      if (guests) {
        this.activeGuests = Object.keys(guests).map((key: any) => this.convertGuestToObject(guests, key));
        this.sortListAndGetUserInformation(this.activeGuests);
        this.activeGuests = this.activeGuests.filter((item: any) => item.status == "open");
      } else {
        this.activeGuests = [];
        this.showLoading();
      }
    });
  }

  getFinishedGuests() {
    this.ordersLobbyService.getGuests$().subscribe((guests: any) => {
      if (guests) {
        this.finishedGuests = Object.keys(guests).map((key: any) => this.convertGuestToObject(guests, key));
        this.sortListAndGetUserInformation(this.finishedGuests);
        this.finishedGuests = this.finishedGuests.filter((item: any) => item.status == "finished");
      } else {
        this.finishedGuests = [];
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

  openGuestDetailModal(guest, status) {
    const modal = this.modalCtrl.create('page-order-modal', { type: status, order: guest })
    modal.present();
  }
}
