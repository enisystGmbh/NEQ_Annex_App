import { Component } from '@angular/core';
import { Platform } from '@ionic/angular'
import { TabnavService } from '../services/tabnav/tabnav.service';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private platform: Platform,
    private router: Router,
    private tabNavService: TabnavService) {


    this.router.events.subscribe((event: RouterEvent) => {

      if (event.url !== undefined) {
        if (this.tabNavService.lastTabName !== event.url && event.url !== this.tabNavService.currentBack) {
          // we put last tab name not equal event.url so the event don't go twice through array
          // we put event.url not equal current back that is since when navcontroll in back button go back its considered a router event and we don't need it to be inserted again
          this.tabNavService.pushTabHistory(event.url);
        }
        this.tabNavService.lastTabName = event.url;
      }
    });
  }
}
