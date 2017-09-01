import {Component} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-instructions',
  templateUrl: 'instructions.html',
})
export class InstructionsPage {

  constructor(private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  public goToHome() {
    this.viewCtrl.dismiss();
  }
}
