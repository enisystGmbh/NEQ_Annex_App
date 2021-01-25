import { Component, OnInit } from '@angular/core';
import * as JSONdata from "./licenses.json"

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.page.html',
  styleUrls: ['./licenses.page.scss'],
})
export class LicensesPage implements OnInit {

  data:any
  key:any;
  
  constructor() { }

  ngOnInit() {
    this.data = JSONdata
    this.data = this.data.default
    console.log(this.data)
    this.key = Object.keys(this.data)
  }


}
