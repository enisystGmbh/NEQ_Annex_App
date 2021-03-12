import { Component, OnInit, NgZone } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform, PopoverController, LoadingController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { AccountPopoverPage } from 'src/app/account-popover/account-popover.page';

import { map, switchMap, tap } from 'rxjs/operators';

import { Storage } from '@ionic/storage';
import {AlertService } from 'src/app/services/alert/alert.service';
import {ApiService} from '../services/api/api.service';


import {TabnavService} from '../services/tabnav/tabnav.service';
import {environment} from '../../environments/environment';

const ENILYSER = 'enilyser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  user = this.apiService.getCurrentUser();

  QRSCANNED_DATA: string;
  scanSubscription: any;
  
  login = environment.LOGIN

  enilyserName:string;
  enilyserID:string;
  enilyserLogin:boolean;
  enilyserResponse:any;

  dataReturned:any;
  status:any;

  constructor(
    private qrScanner: QRScanner,
    private alertService: AlertService,
    private plt: Platform,
    private tabNavService:TabnavService,
    private apiService:ApiService,
    private storage: Storage,
    private popoverContoller:PopoverController,
    private loadingController: LoadingController,
    private ngZone: NgZone,
    ) {
      this.plt.ready().then(() => {
        this.storage.get(ENILYSER).then(data => {
          if (data) {
            this.enilyserName = data.name
            this.enilyserID = data.id
            this.enilyserLogin = true
            this.apiService.getEnilyserPosts(data.id).subscribe(
              data=> {this.enilyserResponse = data})
            console.log('Enilyser Response: ', this.enilyserResponse)
          }
          else{
            this.enilyserLogin = false
          }
        })
      })
      this.tabNavService.scanEndObservable.subscribe(value => {
        if (value){
          this.adjustView()
          this.scanSubscription.unsubscribe();
        }
     })
    }

  ngOnInit() { 
    this.checkToken()
  }

  ionViewWillEnter(){
  //    
  }


  async createPopover(event)
   {
     const popover = await this.popoverContoller.create({
      event,
      component: AccountPopoverPage,
      cssClass: 'my-custom-class', // optional
    });
    return await popover.present();
   }

  ionViewWillLeave() {
    this.stopScanning();
  }


  checkToken() {
    this.apiService.checkToken().subscribe(
      data => {this.status =  data['data']['status']},
      error => {this.status = error['status']}
    )
    return this.status
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Bitte warten...',
      duration: 2000
    });
    await loading.present();

    await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  tryScanning(){
    this.status = this.checkToken()
    this.presentLoading()
    setTimeout(() => {  console.log('start scanning');this.scan(); }, 2000);
  }

  scan() {
    console.log('Token status: ', this.status)
    if (this.status == 200){
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

            this.adjustView()

            this.scanSubscription.unsubscribe();
            this.qrScanner.hide(); // hide camera preview
            this.qrScanner.destroy();

            let obj = JSON.parse(this.QRSCANNED_DATA);
            
            if (obj.Permission == 'Enisyst2021'){
              this.signEnilyser(obj.ID,obj.Name)
            } else{
              this.alertService.showAlert('Ein Fehler ist aufgetreten!','Fehlgeschlagene Erlaubnis' ,'Der QR-Code ist nicht korret.')
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
            this.alertService.showAlert('Erlaubnis auf Kammerazugriff', 'Angelehnt', 'Um den QR Scan zu verwenden, braucht die App eine Erlaubnis für den Kammerazugriff.\n. Diese Einstellung kann jeder Zeit unter Einstellungen geändert werden.');
          }
          else {
            this.alertService.showAlert('Ein unbekannter Fehler ist aufgetreten', 'Actung!', e);
            console.log('Error is: ', e)
          }
        });
    }else{
      let errorMsg = ''
      let statusCode = 'Status Code: '+String(this.status)
      if (this.status == 403){
          errorMsg = 'Sie habe keine Zugriffsrechte auf den Inhalt,\n daher verweigert der Server eine ordnungsgemäße Antwort.'
      } else if(this.status == 503){
          errorMsg = 'Der Server ist nicht bereit, die Anfrage zu bearbeiten.'
      } else {
        errorMsg = 'Ein unbekannter Fehler ist aufgetreten'
      }
      this.alertService.showAlert('Fehler bei der Anmeldung',statusCode, errorMsg)
    }

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
    this.presentLoading()
    setTimeout(() => {  console.log('refrash page');this.refresh(); }, 2000);
  }
  refresh() {
    console.log('Enilyser login: ' , this.enilyserLogin)
    this.ngZone.run(() => {
      console.log('force update the screen');
    });
  }


  signEnilyser(id, name){
    const data = {
      'id': id,
      'name': name
    };
    
    this.storage.set(ENILYSER, data)
    this.enilyserName = name;
    this.enilyserID = id;
    this.enilyserLogin = true;
    this.apiService.getEnilyserPosts(id).subscribe(
      data=> {this.enilyserResponse = data}
    )

  }
  
  logoutEnilyser(){
    this.storage.remove(ENILYSER).then(
      data => console.log(data),
      error => console.error(error)
    );
    this.enilyserLogin = false;
  }
  
}

