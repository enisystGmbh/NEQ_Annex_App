import { Injectable } from '@angular/core';
import { BehaviorSubject, from ,Observable, throwError } from 'rxjs';
import { HttpClient} from '@angular/common/http';

import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { map, switchMap, tap,catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';


const JWT_KEY = 'jwtstoragekey';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public authState  = new BehaviorSubject(null);
 
  constructor(
    private http: HttpClient, 
    private storage: Storage,
    private plt: Platform
     ) {
    this.plt.ready().then(() => {
      this.storage.get(JWT_KEY).then(data => {
        if (data) {
          this.authState.next(data);
        }
      })
    })
  }

  signIn(username, password) {
    return this.http.post(`${environment.API_URL}/wp-json/jwt-auth/v1/token`, {username, password}).pipe(
      switchMap(data => {
        this.checkToken()
        return from(this.storage.set(JWT_KEY, data));
      }),
      tap(data => {
        this.authState.next(data);
      })
    );
  }


  getEnilyserPosts(enilyser) {
    return this.http.post(`${environment.API_URL}/wp-json/ionic/v1/enilyser/${enilyser}/web.dwh?V=%23%23getMG%28%29`, {}).pipe(
      map((data) => {
        return data;
      }), catchError( error => {
        return throwError( error );
      })
   )
        
  }
    
  checkToken(){
    return this.http.post(`${environment.API_URL}/wp-json/jwt-auth/v1/token/validate`,{}).pipe(
      map((data) => {
        return data;
      }), catchError( error => {
        return throwError( error );
      })
   )
  }

  getCurrentUser() {
    return this.authState.asObservable();
  }
 
  getUserValue() {
    return this.authState.getValue();
  }
 
  logout() {
    this.storage.remove(JWT_KEY).then(() => {
      this.authState.next(null);
      this.checkToken()
      console.log('Login: ', environment.LOGIN)
    });
  }

}