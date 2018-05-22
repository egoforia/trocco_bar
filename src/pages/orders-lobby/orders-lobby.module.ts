import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersLobbyPage } from './orders-lobby';

@NgModule({
  declarations: [
    OrdersLobbyPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersLobbyPage),
  ],
})
export class OrdersLobbyPageModule {}
