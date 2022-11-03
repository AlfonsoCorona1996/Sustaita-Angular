import { Component, OnInit } from '@angular/core';
import { permisos } from 'src/app/interfaces/cotizaciones.interfaces';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  permisos: permisos = {
    categorias: [
      {
        viewValue: 'Cotizaciones',
        show: true,
        sub: [
          { show: true, viewValue: 'Mis cotizaciones', descripcion:"Todas las cotizaciones solicitadas", route: "mis-cotizaciones", icon:"cotizaciones.svg" },
          { show: true, viewValue: 'Solicitar', descripcion:"Solicitar nueva cotizacion",route: "", icon:"cotizaciones-solicitar.svg" },
          { show: false, viewValue: 'Actualizar cotizacion', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
        ]
      },
      {
        viewValue: 'Reportes',
        show: true,
        sub: [
          { show: false, viewValue: 'Mis reportes', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:""},
          { show: true, viewValue: 'Solicitar reportes', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:""},
          { show: false, viewValue: 'Actualizar reportes', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:""},
        ]
      },
      {
        viewValue: 'Equipos',
        show: false,
        sub: [
          { show: false, viewValue: 'Mis equipos', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
          { show: false, viewValue: 'Solicitar equipos', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
          { show: true, viewValue: 'Actualizar equipos', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
        ]
      },
      {
        viewValue: 'Facturas',
        show: false,
        sub: [
          { show: false, viewValue: 'Mis facturas', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
          { show: true, viewValue: 'Solicitar facturas',descripcion:"Todas las cotizaciones solicitadas", route: "", icon:"" },
          { show: true, viewValue: 'Actualizar facturas', descripcion:"Todas las cotizaciones solicitadas",route: "", icon:"" },
        ]
      },
    ]
  }

  constructor() { }

  ngOnInit(): void {
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    window.location.reload();
  }

  uncheck(){
    const burger = document.getElementById("burger") as HTMLInputElement | null
    if(burger != null){
      burger.checked = false
      for (let check of this.permisos.categorias) {
        if (check.show) {
          const box = document.getElementById(check.viewValue) as HTMLInputElement | null;
          if (box != null) { box.checked = false; }
        }
      }
    }
  }

}
