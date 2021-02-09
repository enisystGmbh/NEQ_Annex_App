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
 
  user = this.api.getCurrentUser();

  showPassword:boolean;
  password_type: string;

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private alertCtrl:AlertController
  ) {
    this.user.subscribe(user => {
      if (user) {
       //Do something
      } else {
        
      }});
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
    this.api.signIn(form.value.text, form.value.password)
    .subscribe(
      res => {
        this.alertService.presentToast('Anmeldung erfolgreich!')
        this.closeModal()},
      err => {
        this.alertService.showError(err);
      }
    );
  }
  
  /*
  signUp() {
    this.api.signUp(this.userForm.value.username, this.userForm.value.email, this.userForm.value.password).subscribe(
      async res => {
          const toast = await this.toastCtrl.create({
            message: res['message'],
            duration: 3000
          });
          toast.present();
      },
      err => {
        this.showError(err);
      }
    );
  }
 */
  async openPwReset() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot password?',
      message: 'Enter your email or username to retrieve a new password',
      inputs: [
        {
          type: 'text',
          name: 'usernameOrEmail'
        }
      ],
      buttons: [
        {
          role: 'cancel',
          text: 'Back'
        },
        {
          text: 'Reset Password',
          handler: (data) => {
            this.resetPw(data['usernameOrEmail']);
          }
        }
      ]
    });
  
    await alert.present();
  }
 
  resetPw(usernameOrEmail) {
    this.api.resetPassword(usernameOrEmail).subscribe(
      async res => {
        const toast = await this.alertService.presentToast( res['message'])
      },
      err => {
        this.alertService.showError(err);
      }
    );
  }
 
  logout() {
    this.api.logout();
  }
 
  async openPage(urlPassed) {
    await Browser.open({ toolbarColor: '##000080', url: urlPassed })
  }

}




