import { Component, OnInit } from '@angular/core';
import { cot_list} from 'src/app/interfaces/cotizaciones.interfaces';
import { CotizacionesClienteService } from 'src/app/services/cotizaciones-cliente.service';
import { CotizacionesPipePipe } from '../../cotizaciones-pipe.pipe';

interface options {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-mis-cotizaciones',
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.css'],
  providers: [CotizacionesPipePipe]
})
export class MisCotizacionesComponent implements OnInit {

  public cotizaciones: Array<cot_list> | undefined = [];
  public caducada: number = 0;
  public solicitada: number = 0;
  public proceso: number = 0;
  public entregada: number = 0;
  public buscador:string = '';
  public filter_list: string = '';
  public filter_option: string = 'folio';

  constructor(
    private _cotizaciones_clienteService: CotizacionesClienteService,
    private CotizacionesPipe: CotizacionesPipePipe
  ) { }

  ngOnInit(): void {

    this._cotizaciones_clienteService.listar_cotizaciones_cliente().subscribe({
      next: (v) => {

        this.cotizaciones = v;
        if(this.cotizaciones != undefined){
        for (let stat of this.cotizaciones) {

          if (stat.status === 'Entregada') {
              this.entregada += 1
          } else if (stat.status === 'Solicitada') {
            this.solicitada += 1

          } else if (stat.status === 'Proceso') {
            this.proceso += 1
          }else{
            this.caducada += 1
          }
        }
        console.log( this.cotizaciones)

      }
      },
      error: (e) => console.error(e)
    });


  }


  Search(search: string) {
    // this.page = 0;
    this.filter_list = search;
    this.solicitada = this.CotizacionesPipe.transform(this.cotizaciones,'Solicitada',this.filter_option,search ).length
    this.entregada = this.CotizacionesPipe.transform(this.cotizaciones,'Entregada',this.filter_option,search ).length
    this.proceso = this.CotizacionesPipe.transform(this.cotizaciones,'Proceso',this.filter_option,search ).length
    this.caducada = this.CotizacionesPipe.transform(this.cotizaciones,'Caduco',this.filter_option,search ).length
  }

  select(opcion:string){
    // if(opcion != 'Fecha' && this.filter_list != ''){
    //   this.filter_list = ''
    //   this.buscador = ''
    // }
    this.filter_option = opcion
  }

  Opciones: options[] = [
    { value: 'folio', viewValue: 'Folio' },
    { value: 'descripcion', viewValue: 'Descripcion' },
    { value: 'sitio', viewValue: 'Sitio' },
    { value: 'fecha', viewValue: 'Fecha' },
  ];


}



