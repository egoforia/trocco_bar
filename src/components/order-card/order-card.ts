import { Component } from '@angular/core';

/**
 * Generated class for the OrderCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'order-card',
  templateUrl: 'order-card.html'
})
export class OrderCardComponent {

  constructor() {

  }

  setPreparing() {
    console.log('preparing');
  }

}
