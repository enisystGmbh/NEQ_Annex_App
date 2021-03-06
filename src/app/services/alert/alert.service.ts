import { Injectable } from '@angular/core';

import { ToastController, AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private toastController: ToastController,
    private alertController:AlertController) { }


  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'dark'
    });
    toast.present();
  }

  async showAlert(header, sub, msg) {
    this.alertController.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

}