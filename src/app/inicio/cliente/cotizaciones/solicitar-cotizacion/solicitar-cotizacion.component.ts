import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CotizacionesClienteService } from '../../../../services/cotizaciones-cliente.service';
import { Equipo, sitio_combo, Equipo_res } from '../../../../interfaces/cotizaciones.interfaces';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-solicitar-cotizacion',
  templateUrl: './solicitar-cotizacion.component.html',
  styleUrls: ['./solicitar-cotizacion.component.css']
})
export class SolicitarCotizacionComponent implements OnInit {

  public empresa: string = '';
  public sitios: Array<sitio_combo> | undefined = [];
  public equipos: Array<Equipo> | undefined = [];
  public toppings = new FormControl('');
  public mobile: boolean = true;
  public equipo_disabled: boolean = true;
  public equipo_text: string = "selecciona"
  public color_Equipo: string = "#f6f8fa"

  constructor(
    private _cotizaciones_clienteService: CotizacionesClienteService
  ) { }

  ngOnInit(): void {
    this._cotizaciones_clienteService.listar_sitios().subscribe({
      next: (v) => {
        this.sitios = v;
      },
      error: (e) => console.error(e)
    });

    const token = localStorage.getItem('token') || undefined;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.empresa = decodedToken.empresa;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      this.mobile = true
    } else {
      // false for not mobile device
      this.mobile = false
    }
  }


  select(opcion: string) {
    if (opcion != "selecciona") {
      this._cotizaciones_clienteService.listar_equipos(opcion).subscribe({
        next: (v) => {
          this.equipos = v?.Equipos;
        },
        error: (e) => console.error(e)
      });
      this.color_Equipo = "#FFFFFF"

    } else {
      this.equipos = []
      this.color_Equipo = "#F6F8FA"
    }
    this.toppings = new FormControl('');
  }

  equipos_select() {
    console.log(this.toppings)
    // const combo = document.getElementById(id)
    // const sitio = document.getElementById("sitio_combo") as HTMLInputElement;
    // console.log(combo && sitio.value != "selecciona")
    // if(combo && sitio.value != "selecciona"){
    //   this.equipo_disabled = false;
    //   combo.style.color = 'white'
    // }
    // else{
    //   this.equipo_disabled = true
    // }
  }


}
