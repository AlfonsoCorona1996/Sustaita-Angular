import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class Child_Admin_Guard implements CanActivateChild {

  constructor(
    private _loginService:LoginService,
    private _router:Router
  ){

  }

  canActivateChild():any{
    if(!this._loginService.isAdmin()){
      iziToast.show({
        title: 'Denegado:',
        titleColor: '#FF0000',
        timeout: 3000,
        messageColor: '#8c8c8c',
        color: '#FFFFFF',
        progressBarColor: '#0087d4',
        class: 'text-danger',
        position: 'bottomRight',
        message:'No tienes permiso para ingresar a esta ruta',
      });
      if(!this._loginService.isCliente()){
        localStorage.removeItem('token');
        this._router.navigate(['/login']);
      }
      this._router.navigate(['/inicio/cliente']);
      return false;
    }
    return true;

  }
}
