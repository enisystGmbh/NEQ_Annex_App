import { Component } from '@angular/core';

import { Platform, NavController, ModalController, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router'

import { TabnavService } from '../app/services/tabnav/tabnav.service';
import {ApiService} from '../app/services/api/api.service'

import { environment } from '../environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // set up hardware back button event.

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Scane',
      url: '/tabs/home',
      icon: 'scan-outline'
    },
    {
      title: 'Settings',
      url: '/tabs/settings',
      icon: 'settings-outline'
    },
  ]
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController,
    private tabNavService: TabnavService,
    private apiService: ApiService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.apiService.authState.subscribe(state => {
        if (state) {
          let currentUser = this.apiService.getUserValue();
          if (currentUser && currentUser.token){ 
            environment.LOGIN = true;
          } else {
            environment.LOGIN = false;
          }
        } else {
          environment.LOGIN = false;
        }
      });

      this.platform.backButton.subscribeWithPriority(99999999, async () => {
        let pushHistoryCount = this.tabNavService.navigationProccess.length;
        console.log('Scan:',this.tabNavService.scanOpen)
        if (this.tabNavService.scanOpen){
          this.tabNavService.emitScan(true)
        } else if (this.router.url.includes('tabs') == true && pushHistoryCount > 1) {
          let url = this.tabNavService.navigationProccess[pushHistoryCount - 2].url;
          this.tabNavService.navigationProccess.splice(pushHistoryCount - 1, 1);
          this.tabNavService.currentBack = url;
          //currentBack should be assigned before navgiate back
          this.navCtrl.navigateBack(url);  
        } else if (this.router.url.includes('tabs') == true && pushHistoryCount < 2) {
          // here is the array less than 2 which is one (you could make it ==0 but i make it if app glitches or something)
          //so if app is on main start point it exit on back pressed
          this.showExitConfirm()
        }
      });

      const path = window.location.pathname.split('tabs/')[1];
      if (path !== undefined) {
        this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      }
    });
  }

  showExitConfirm() {
    this.alertCtrl.create({
      header: 'Beende App',
      message: 'Möchten Sie die App schließen?',
      backdropDismiss: false,
      buttons: [{
        text: 'Nein',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Ja',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
