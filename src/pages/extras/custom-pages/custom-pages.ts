import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {MenuItem} from '../../../interfaces/navigation';

@IonicPage({
  name: 'page-custom-pages',
  segment: 'extras'
})

@Component({
  selector: 'page-custom-pages',
  templateUrl: 'custom-pages.html',
})

export class CustomPagesPage {

  cpagesItems: Array<MenuItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cpagesItems = [
      {title: 'Login', component: "page-login-list", icon: 'log-in'},
      {title: 'Register', component: 'page-register', icon: 'document'},
			{ title: 'Order Timeline', component: 'page-timeline', icon: 'clock'}
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPagesPage');
  }

  openPage(page) {
    console.log(page);
      this.navCtrl.push(page);
  }
}
