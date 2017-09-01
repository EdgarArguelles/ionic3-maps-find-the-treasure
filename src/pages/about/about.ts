import {Component} from '@angular/core';
import {IonicPage, ModalController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  public showInstructions() {
    let modal = this.modalCtrl.create('InstructionsPage');
    modal.present();
  }
}
