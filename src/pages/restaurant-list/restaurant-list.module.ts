import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantListPage } from './restaurant-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		RestaurantListPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantListPage),
		PipesModule
	],
	exports: [
		RestaurantListPage
	]
})

export class RestaurantListPageModule { }
