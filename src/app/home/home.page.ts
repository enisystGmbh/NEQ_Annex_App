import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, switchMap, tap } from 'rxjs/operators';

import {LoginPage} from '../login/login.page'
import {AlertService } from 'src/app/services/alert/alert.service';
import {ApiService} from '../services/api/api.service'

import {TabnavService} from '../services/tabnav/tabnav.service'
import {environment} from '../../environments/environment'
import { EnilyserLoginPage } from '../enilyser-login/enilyser-login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  QRSCANNED_DATA: string;
  scanSubscription: any;
  
  login = environment.LOGIN
  login_name = environment.DISPLAY_NAME

  dataReturned:any;

  constructor(
    private qrScanner: QRScanner,
    private alertService: AlertService,
    private platform: Platform,
    private  modalController: ModalController,
    private tabNavService:TabnavService,
    private apiService:ApiService,
    private http: HttpClient,
    ) {
      this.tabNavService.scanEndObservable.subscribe(value => {
        if (value){
          this.adjustView()
          this.scanSubscription.unsubscribe();
        }
      })
  }

  ngOnInit() { 
  }

  ionViewWillEnter(){
  //    
}
  ionViewWillLeave() {
    this.stopScanning();
  }

  scan() {
    this.tabNavService.scanOpen =true;
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    window.document.body.style.backgroundColor = 'transparent';

    // Optionally request the permission early
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted

        document.getElementsByTagName("body")[0].style.opacity = "0";

        // start scanning
        this.scanSubscription = this.qrScanner.scan().subscribe((text: string) => {

          this.QRSCANNED_DATA = text;
          console.log(this.QRSCANNED_DATA)

          this.adjustView()

          this.scanSubscription.unsubscribe();
          this.qrScanner.hide(); // hide camera preview
          this.qrScanner.destroy();

          //data: dev-pliezhausen;https://eniserv.de/dev-pliezhausen/
          var res = this.QRSCANNED_DATA .split(";")
          if (!res[0] || !res[1])
            this.alertService.showAlert("Ein Fehler ist aufgetreten!", "Der QR-Code ist nicht korret.","Versuchen Sie es erneut.")
          else{
            environment.ENILYSER_NAME = res[0]
            environment.ENILYSER_ID = res[1]
            this.openEnilyserLogin()
          }

        });
        this.qrScanner.enableLight();
        this.qrScanner.useBackCamera();
        this.qrScanner.show();

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
        this.qrScanner.openSettings();

      } else {
      }
    })
      .catch((e: any) => {
        console.log(e)
        if (e.name == 'CAMERA_ACCESS_DENIED') {
          document.getElementsByTagName("body")[0].style.opacity = "1";
          this.alertService.showAlert('Erlaubnis auf Kammerazugriff', 'Um den QR Scan zu verwenden, braucht die App eine Erlaubnis für den Kammerazugriff.\n. Diese Einstellung kann jeder Zeit unter Einstellungen geändert werden.', 'Angelehnt');
        }
        else {
          console.log('Error is: ', e)
        }
      });

  }

  stopScanning() {
    (this.scanSubscription) ? this.scanSubscription.unsubscribe() : null;
    this.scanSubscription = null;

    this.adjustView()

    this.qrScanner.hide();
    this.qrScanner.destroy();
    this.tabNavService.scanOpen =false;

  }

  adjustView() {
    document.getElementsByTagName("body")[0].style.opacity = "1";
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    window.document.body.style.backgroundColor = '#FFF';
  }

  async openLogin(){
    const modal = await this.modalController.create({
      component:LoginPage,
      cssClass: 'custom-modal-css',
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.login = environment.LOGIN
        this.login_name =environment.DISPLAY_NAME
      }
    });
    return await modal.present();
  }

  async openEnilyserLogin(){
    const modal = await this.modalController.create({
      component:EnilyserLoginPage,
      cssClass: 'custom-modal-css',
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //Do something
      }
    });
    return await modal.present();
  }

  openLogout(){
    this.apiService.logout();
    this.login = false;
    console.log("Log Out")
  }
}