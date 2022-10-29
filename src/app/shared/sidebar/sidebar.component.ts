import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { permisos } from 'src/app/interfaces/cotizaciones.interfaces';
import { LoginService } from '../../services/login.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(":leave", [animate(1000, style({ opacity: 0 }))])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  Logo: string = '../../assets/Sustaita_color.svg';
  isDisplay = true;
  timeout: boolean = false;
  permisos: permisos = {
    categorias: [
      {
        viewValue: 'Cotizaciones',
        show: true,
        sub: [
          { show: true, viewValue: 'Mis cotizaciones', route: "mis-cotizaciones" },
          { show: false, viewValue: 'Solicitar cotizacion', route: "" },
          { show: false, viewValue: 'Actualizar cotizacion', route: "" },
        ]
      },
      {
        viewValue: 'Reportes',
        show: true,
        sub: [
          { show: false, viewValue: 'Mis reportes', route: "" },
          { show: true, viewValue: 'Solicitar reportes', route: "" },
          { show: false, viewValue: 'Actualizar reportes', route: "" },
        ]
      },
      {
        viewValue: 'Equipos',
        show: false,
        sub: [
          { show: false, viewValue: 'Mis equipos', route: "" },
          { show: false, viewValue: 'Solicitar equipos', route: "" },
          { show: true, viewValue: 'Actualizar equipos', route: "" },
        ]
      },
      {
        viewValue: 'Facturas',
        show: false,
        sub: [
          { show: false, viewValue: 'Mis facturas', route: "" },
          { show: true, viewValue: 'Solicitar facturas', route: "" },
          { show: true, viewValue: 'Actualizar facturas', route: "" },
        ]
      },
    ]
  }

  constructor(
    private _loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.permisos = this._loginService.getCliente_permissions()
  }
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    window.location.reload();
  }



  //? Funciones para close y open

  uncheckAll() {
    for (let check of this.permisos.categorias) {
      if (check.show) {
        const box = document.getElementById(check.viewValue) as HTMLInputElement | null;
        if (box != null) { box.checked = false; }
      }
    }
  }

  leave() {
    this.timeout = true;
    setTimeout(() => {
      if (this.timeout) {
        this.uncheckAll()

        if (window.matchMedia("(max-width: 769px)").matches) {
        }
      }

    }, 1000);
  }

  enter() {
    this.timeout = false;
  }

  close(event: any) {
    if (window.matchMedia("(max-width: 769px)").matches){
    if (event.target.id == 'sidebar_back') {
      $(() => {
        var effects = 'animate__fadeOut';
        var effects2 = 'animate__fadeOutLeft';
        var element = $('div.sidebar_back');
        var element2 = $('section.sidebar_inside');

        $(element2).removeClass('animate__slideInLeft').addClass(effects2);

        $(element).removeClass('animate__fadeIn').addClass(effects);
        setTimeout(() => {
          $(element).removeClass(effects).addClass('animate__fadeIn')
          $(element2).removeClass(effects2).addClass('animate__slideInLeft')
          $("div.sidebar_back").hide();
          $("div.sidebar_inside").hide();
        }, 500);
      })
    }
  }
  }
  close_2() {
    if (window.matchMedia("(max-width: 769px)").matches){

    setTimeout(() => {
      $(() => {
        var effects = 'animate__fadeOut';
        var effects2 = 'animate__fadeOutLeft';
        var element = $('div.sidebar_back');
        var element2 = $('section.sidebar_inside');

        $(element2).removeClass('animate__slideInLeft').addClass(effects2);

        $(element).removeClass('animate__fadeIn').addClass(effects);
        setTimeout(() => {
          $(element).removeClass(effects).addClass('animate__fadeIn')
          $(element2).removeClass(effects2).addClass('animate__slideInLeft')
          $("div.sidebar_back").hide();
          $("div.sidebar_inside").hide();
        }, 500);
      })
    }, 200);
    this.uncheckAll()
  }
  }

}
