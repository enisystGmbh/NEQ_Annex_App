import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api/api.service';
import { LoginPage } from '../login/login.page'

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-account-popover',
  templateUrl: './account-popover.page.html',
  styleUrls: ['./account-popover.page.scss'],
})



export class AccountPopoverPage implements OnInit {
  login:boolean;
  dataReturned: any;
  user = this.apiService.getCurrentUser();

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private apiService: ApiService) 
    {
      this.apiService.authState.subscribe(state => {
        if (state) {
          let currentUser = this.apiService.getUserValue();
          if (currentUser && currentUser.token) {
            this.user = currentUser
            this.login = true
          } else {
            this.login = false
          }
       }
      })
    }


  ngOnInit() {
  }

  async openLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      cssClass: 'custom-modal-css',
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.login = environment.LOGIN
        this.closePopover()
      }
    });
    return await modal.present();
  }

  openLogout() {
    this.apiService.logout();
    this.login = false;
    this.closePopover()
  }


  closePopover() {
    this.popoverController.dismiss();
  }

}
