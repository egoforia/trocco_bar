import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';

import leaflet from 'leaflet';

@IonicPage({
	name: 'page-nearby',
	segment: 'nearby'
})

@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html'
})
export class NearbyPage {

    restaurants: Array<any>;
    map;
    markersGroup;

    constructor(public navCtrl: NavController, public service: RestaurantService, public modalCtrl: ModalController) {
        this.findAll();
    }

    openRestaurantFilterPage() {
      let modal = this.modalCtrl.create('page-restaurant-filter');
      // modal.onDidDismiss(data => {
      //   console.log(data);
      // });
      modal.present();
    }

    openRestaurantDetail(restaurant: any) {
  		this.navCtrl.push('page-restaurant-detail', {
				'id': restaurant.id
			});
    }

    findAll() {
        this.service.findAll()
            .then(data => this.restaurants = data)
            .catch(error => alert(error));
    }

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);
        this.restaurants.forEach(restaurant => {
            if (restaurant.lat, restaurant.long) {
                let marker: any = leaflet.marker([restaurant.lat, restaurant.long]).on('click', event => this.openRestaurantDetail(restaurant));
                marker.data = restaurant;
                this.markersGroup.addLayer(marker);
            }
        });
        this.map.addLayer(this.markersGroup);
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.map = leaflet.map("nearby-map").setView([42.361132, -71.070876], 14);
            leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(this.map);
            this.showMarkers();
        })
    }

}
