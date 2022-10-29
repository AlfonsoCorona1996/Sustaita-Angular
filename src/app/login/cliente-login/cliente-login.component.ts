import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';


declare var iziToast: any;

interface user_login {
  email: string;
  password: string;
}

interface user_res{
  data: {
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    rol: string,
    telefono: string,
    __v: number,
    _id: string
  }
  token: string,
}


@Component({
  selector: 'app-cliente-login',
  templateUrl: './cliente-login.component.html',
  styleUrls: ['./cliente-login.component.css']
})
export class ClienteLoginComponent implements OnInit {

  public user: user_login = {
    email: '',
    password: '',
  };
  public usuario :any = {};
  public token:any ='';
  Logo: string = '../../assets/Sustaita_color.svg';

  constructor(
    private _loginService:LoginService,
    private _router: Router
  ){
    this.token = this._loginService.getToken();
  }

  ngOnInit(): void {
    if(this.token){
      this._router.navigate(['/cliente']);
    }
  }

  login(loginForm: NgForm, email: NgModel) {
     if (email.valid) {
      if (loginForm.valid) {
        this._loginService.login_cliente(this.user).subscribe({
          next: (v) => {
            if(v.data == undefined){
              iziToast.show({
                title: 'Error:',
                titleColor: '#FF0000',
                timeout: 3000,
                messageColor: '#051b34',
                color: '#FFFFFF',
                progressBarColor: '#0087d4',
                class: 'text-danger',
                position: 'topRight',
                message: v.message,
              });
            }else{
              this.usuario = v.data;

              localStorage.setItem('token', v.token);
              localStorage.setItem('_id', v.data._id);
              this._router.navigate(['/cliente/inicio']);
            }
          },
          error: (e) => console.error(e)
        });
        // alert('Si es valido');
      } else {
        iziToast.show({
          title: 'Error:',
          titleColor: '#FF0000',
          timeout: 3000,
          messageColor: '#051b34',
          color: '#FFFFFF',
          progressBarColor: '#0087d4',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos',
        });
      }
    } else {
    //   iziToast.show({
    //     title: 'Error:',
    //     titleColor: '#FF0000',
    //     timeout: 3000,
    //     messageColor: '#051b34',
    //     color: '#FFFFFF',
    //     progressBarColor: '#0087d4',
    //     class: 'text-danger',
    //     position: 'topRight',
    //     message: 'Formato de correo invalido',
    //   });
    }
  }

  fuerafoco(email: NgModel) {
     if (email.valid){
       const valid = document.getElementById('Correo') as HTMLElement;
       valid.style.outlineColor = '#8EEB57'
     } else {
      const valid = document.getElementById('Correo') as HTMLElement;
      valid.style.outlineColor = '#D4151C'
     }

  }

}
