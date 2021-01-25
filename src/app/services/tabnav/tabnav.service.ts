import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabnavService {
  public navigationProccess:Array<any> = [];
  public lastTabName:string = "";
  public currentBack:string = "";
  public scanOpen: boolean = false;

  public scanEndObservable= new Subject<boolean>();
  constructor(
  ) {}

  emitScan(val) {
    this.scanEndObservable.next(val);
  }

  pushTabHistory(tabName:string){
    let navHistory = {
      url:tabName
    };
    this.navigationProccess.push(navHistory)
  }

 
}
