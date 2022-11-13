import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CotizacionesClienteService } from '../../../../services/cotizaciones-cliente.service';
import { sitio_combo } from '../../../../interfaces/cotizaciones.interfaces';

@Component({
  selector: 'app-solicitar-cotizacion',
  templateUrl: './solicitar-cotizacion.component.html',
  styleUrls: ['./solicitar-cotizacion.component.css']
})
export class SolicitarCotizacionComponent implements OnInit {

  public empresa: string = '';
  public sitios: Array<sitio_combo> | undefined = [];

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
  }

}
