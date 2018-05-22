import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantDetailPage } from './restaurant-detail';

@NgModule({
	declarations: [
		RestaurantDetailPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantDetailPage)
	],
	exports: [
		RestaurantDetailPage
	]
})

export class RestaurantDetailPageModule { }
