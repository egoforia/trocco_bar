import {Component} from '@angular/core';
import {IonicPage, Config, NavController, NavParams, ToastController, ModalController} from 'ionic-angular';
// import {RestaurantService} from '../../providers/restaurant-service-mock';
import { RestaurantFireService } from '../../providers/restaurant-fire-service'
import { Observable } from 'rxjs/Observable';
import leaflet from 'leaflet';

@IonicPage({
	name: 'page-restaurant-list',
	segment: 'restaurant-list'
})

@Component({
    selector: 'page-restaurant-list',
    templateUrl: 'restaurant-list.html'
})
export class RestaurantListPage {

    restaurants: Observable<any>;
    searchKey: string = "";
    viewMode: string = "list";
    proptype: string;
    from: string;
    map;
    markersGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, public restaurantService: RestaurantFireService, public toastCtrl: ToastController, public modalCtrl: ModalController, public config: Config) {
        this.findAll();
        this.proptype = this.navParams.get('proptype') || "";
        this.from = this.navParams.get('from') || "";
        // console.log(this.proptype);
    }

    openFilterModal() {
      let modal = this.modalCtrl.create('page-restaurant-filter');
      // modal.onDidDismiss(data => {
      //   console.log(data);
      // });
      modal.present();
    }

    openRestaurantDetail(restaurant: any) {
			this.restaurantService.setActive(restaurant);

  		this.navCtrl.push('page-restaurant-detail');
    }

    favorite(restaurant) {
        // this.service.favorite(restaurant)
        //     .then(restaurant => {
        //         let toast = this.toastCtrl.create({
        //             message: 'Property added to your favorites',
        //             cssClass: 'mytoast',
        //             duration: 2000
        //         });
        //         toast.present(toast);
        //     });
    }

    onInput(event) {
        // this.service.findByName(this.searchKey)
        //     .then(data => {
        //         this.restaurants = data;
        //         if (this.viewMode === "map") {
        //             this.showMarkers();
        //         }
        //     })
        //     .catch(error => alert(JSON.stringify(error)));
    }

    onCancel(event) {
      this.findAll();
    }

    findAll() {
    	this.restaurants = this.restaurantService.findAll();
    }

    showMap() {
        setTimeout(() => {
            this.map = leaflet.map("map").setView([42.361132, -71.070876], 14);
            leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(this.map);
            this.showMarkers();
        })
    }

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);
        this.restaurants.forEach(restaurant => {
            if (restaurant.lat, restaurant.long) {
                let marker: any = leaflet.marker([restaurant.lat, restaurant.long]).on('click', event => this.openRestaurantDetail(event.target.data));
                marker.data = restaurant;
                this.markersGroup.addLayer(marker);
            }
        });
        this.map.addLayer(this.markersGroup);
    }

}
