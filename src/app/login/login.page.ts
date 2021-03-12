import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  user = this.apiService.getCurrentUser();

  showPassword:boolean;
  password_type: string;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private alertCtrl:AlertController
  ) {
   }

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

    this.showPassword=false;
    this.password_type ="password"
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.navCtrl.navigateRoot('tabs/home');
  }

  showHidePassword(){
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
    this.showPassword = !this.showPassword
  }

  login(form: NgForm) {
    this.apiService.signIn(form.value.text, form.value.password).subscribe(
      res => {
        console.log('Login response:', res)
        this.alertService.presentToast('Anmeldung erfolgreich!')
        this.closeModal()},
      err => {
        console.log('Login response:',err)
        let header = 'Fehler bei der Anmeldung'
        let subHeader = 'Status Code: ' +  err.error.data.status
        let msg = err.error.message 
        this.alertService.showAlert(header, subHeader, msg);
      }
    );
  }
  

  logout() {
    this.apiService.logout();
  }
 
  async openPage(urlPassed) {
    await Browser.open({ toolbarColor: '##000080', url: urlPassed })
  }

}




