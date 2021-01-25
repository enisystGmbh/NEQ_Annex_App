import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const JWT_KEY = 'jwtstoragekey';

const ENILYSER_KEY = 'enilyserstoragekey';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public authState  = new BehaviorSubject(null);
 
  constructor(
    private http: HttpClient, 
    private storage: Storage,
     private plt: Platform,
     private httpCommon :HTTP) {
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
        return from(this.storage.set(JWT_KEY, data));
      }),
      tap(data => {
        this.authState.next(data);
      })
    );
  }
  
  /*
  signUp(username, email, password) {
    return this.http.post(`${environment.API_URL}/wp/v2/users/register`, { username, email, password });
  }
  */

  resetPassword(usernameOrEmail) {
    console.log(usernameOrEmail)
    return this.http.post(`${environment.API_URL}/wp-json/bdpwr/v1/set-password`, { email: usernameOrEmail });
    //return this.http.post(`${environment.API_URL}/wp-json/wp/v2/users/lost-password`, { user_login: usernameOrEmail });
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
      environment.TOKEN = 'token';
      environment.EMAIL = 'user_mail';
      environment.NICE_NAME = 'user_nicename';
      environment.DISPLAY_NAME = 'user_display_name';
      console.log(environment.LOGIN)
    });
  }


  loginEnilyser(username,password){
    // const responseData = dwhRequest([`##Logout()`, `##Login('${username}','${password}')`]);
   // console.log(responseData)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Headers','*')
    headers.append('Accept', '*/*')
    headers.append('Access-Control-Request-Method', 'POST') 
    headers.append('Access-Control-Request-Headers',' Content-Type, Authorization')

    return this.http.post(`https://deveniserv.de/enilyser/${environment.ENILYSER_ID}/web.dwh`,{}).subscribe( 
      response => console.log(response)
    )
  }
}