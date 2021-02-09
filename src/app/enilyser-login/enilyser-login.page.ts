import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ToastController, AlertController } from '@ionic/angular';
import {environment} from '../../environments/environment'

@Component({
  selector: 'app-enilyser-login',
  templateUrl: './enilyser-login.page.html',
  styleUrls: ['./enilyser-login.page.scss'],
})
export class EnilyserLoginPage implements OnInit {

  showPassword:boolean;
  password_type: string;
  enilyser_name = environment.ENILYSER_NAME

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private alertCtrl:AlertController){}
  
  ngOnInit() {
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
    this.api.signIn(form.value.text, form.value.password).subscribe(
      res => {
        console.log(res)
        this.alertService.presentToast('Anmeldung erfolgreich!')
        this.closeModal()},
      err => {
        this.alertService.showError(err);
      }
    );
  }

  
  // login(form: NgForm) {
  //   this.api.loginEnilyser(form.value.text, form.value.password)
  // }

}
