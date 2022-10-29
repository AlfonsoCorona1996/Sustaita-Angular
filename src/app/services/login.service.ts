import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { permisos } from '../interfaces/cotizaciones.interfaces';

interface user {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public url;


  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;

  }


  login_admin(data: user): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, { headers: headers });

  }

  login_cliente(data: user): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_cliente', data, { headers: headers });
  }


  getToken() {
    return localStorage.getItem('token');
  }

  getName() {
    const token = localStorage.getItem('token') || undefined;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.nombre;
  }

  getCliente_permissions():permisos {
    const token = localStorage.getItem('token') || undefined;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.permisos
  }



  public isAuthenticated(allowRoles: string[]): boolean {

    const token = localStorage.getItem('token') || undefined;

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      if (!decodedToken || now > decodedToken.exp) {
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }


    return true;


  }

  public isAdmin():boolean{
    const token = localStorage.getItem('token') || undefined;

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if (decodedToken.rol !='admin') {
        return false;
      }
    } catch (error) {
      return false;
    }


    return true;
  }

  public isCliente():boolean{
    const token = localStorage.getItem('token') || undefined;

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if (decodedToken.rol !='cliente') {
        return false;
      }
    } catch (error) {
      return false;
    }


    return true;
  }
}
