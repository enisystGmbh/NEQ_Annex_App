import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
const { Browser } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private callNumber: CallNumber,
    private emailComposer: EmailComposer,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    Browser.addListener('browserPageLoaded', () => {
      console.log('browserPageLoaded event called');
    })
    Browser.addListener('browserFinished', () => {
      console.log('browserFinished event called');
    })
    Browser.prefetch({
      urls: ['https://www.enisyst.de']
    })
  }

  async openPage(urlPassed) {
    await Browser.open({ toolbarColor: '##000080', url: urlPassed })
  }
  
  callNow(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

    //Send mail
  sendNow(mail){
    let email = {
      to: mail,
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  goToLicense(){
    this.navCtrl.navigateForward('tabs/licenses');
  }

}
