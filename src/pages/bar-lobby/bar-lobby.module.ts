import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarLobbyPage } from './bar-lobby';

@NgModule({
  declarations: [
    BarLobbyPage,
  ],
  imports: [
    IonicPageModule.forChild(BarLobbyPage),
  ],
})
export class BarLobbyPageModule {}
