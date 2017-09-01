import {Component, ElementRef, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {IonicPage, ModalController, NavController, Platform, ToastController} from 'ionic-angular';

declare let google;

interface Destiny {
  latitude: string;
  longitude: string;
  name: string;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentPosition: any;
  currentMarker: any;
  destinyMarker: any;
  info: string;
  isTravelCompleted: boolean;
  currentDestinyIndex: number;
  destinies: Array<Destiny>;
  destiny: Destiny;
  currentPositionMapLat: any;
  destinyMapLat: any;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private platform: Platform,
              private geolocation: Geolocation,
              private toastCtrl: ToastController) {
    this.isTravelCompleted = false;
    this.currentDestinyIndex = -1;
    this.destinies = [
      {latitude: '20.7037903', longitude: '-101.3422822', name: 'Destiny 1'},
      {latitude: '20.689564', longitude: '-101.340768', name: 'Destiny 2'},
      {latitude: '20.675085', longitude: '-101.335990', name: 'Destiny 3'},
      {latitude: '20.671219', longitude: '-101.339547', name: 'Destiny 4'},
      {latitude: '20.661366', longitude: '-101.335231', name: 'Destiny 5'}
    ];
  }

  public ionViewDidLoad() {
    this.initMap();
    this.moveToNextLocation();
    this.showInstructions();

    let watch = this.geolocation.watchPosition();
    watch.subscribe((position) => {
      if (position.coords) {
        this.currentPosition = position;
        this.currentPositionMapLat = new google.maps.LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
        this.setCurrentMarker();

        this.centerMap();
      } else {
        this.showError(position);
      }
    });
  }

  private initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      streetViewControl: false,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.directionsDisplay.setMap(this.map);
  }

  public moveToNextLocation() {
    this.isTravelCompleted = this.currentDestinyIndex + 1 >= this.destinies.length;
    if (this.isTravelCompleted) {
      this.alert('You are Here!');
      this.destiny = null;
      this.destinyMapLat = null;
      this.destinyMarker.setMap(null);
      return;
    }

    this.currentDestinyIndex++;
    this.destiny = this.destinies[this.currentDestinyIndex];
    this.destinyMapLat = new google.maps.LatLng(this.destiny.latitude, this.destiny.longitude);
    this.setDestinyMarker();
    this.centerMap();
  }

  public centerMap() {
    if (this.isTravelCompleted && this.currentPositionMapLat) {
      this.map.setCenter(this.currentPositionMapLat);
    }
    if (!this.isTravelCompleted && this.currentPositionMapLat && this.destinyMapLat) {
      let bound = new google.maps.LatLngBounds();
      bound.extend(this.currentPositionMapLat);
      bound.extend(this.destinyMapLat);
      this.map.fitBounds(bound);

      let totalDistance = google.maps.geometry.spherical.computeDistanceBetween(this.currentPositionMapLat, this.destinyMapLat) / 1000;
      this.info = totalDistance.toFixed(1) + ' Km';
      if (totalDistance < 0.1) {
        this.moveToNextLocation();
      }
    }
  }

  private setCurrentMarker() {
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }
    this.currentMarker = new google.maps.Marker({
      map: this.map,
      icon: 'assets/icon/current_marker.png',
      position: this.currentPositionMapLat
    });
  }

  private setDestinyMarker() {
    if (this.destinyMarker) {
      this.destinyMarker.setMap(null);
    }
    this.destinyMarker = new google.maps.Marker({
      map: this.map,
      icon: 'assets/icon/destiny_marker.png',
      position: this.destinyMapLat
    });
  }

  public startExternalNavigating() {
    // ios
    if (this.platform.is('ios')) {
      window.open('maps://?saddr=' + this.currentPositionToString() + '&daddr=' + this.destinyToString(), '_system');
    }

    // android
    if (this.platform.is('android')) {
      window.open('geo://' + this.currentPositionToString() + '?q=' + this.destinyToString(), '_system');
    }
  }

  private currentPositionToString(): string {
    return this.currentPosition.coords.latitude + ',' + this.currentPosition.coords.longitude;
  }

  private destinyToString(): string {
    return this.destiny.latitude + ',' + this.destiny.longitude;
  }

  private showInstructions() {
    let modal = this.modalCtrl.create('InstructionsPage');
    modal.present();
  }

  public openHelp() {
    this.navCtrl.push('AboutPage');
  }

  private showError(error: object) {
    console.warn(error);
    this.alert('Error', 'top', 5000);
  }

  private alert(message: string, position = 'bottom', duration = 3000) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present();
  }
}
