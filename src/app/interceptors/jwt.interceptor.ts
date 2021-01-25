import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private apiService: ApiService) { }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.apiService.getUserValue();
        
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
 
        return next.handle(request);
    }
}