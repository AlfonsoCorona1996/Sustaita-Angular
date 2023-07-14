import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { cot_list } from 'src/app/interfaces/cotizaciones.interfaces';
import { CotizacionesClienteService } from 'src/app/services/cotizaciones-cliente.service';
import { CotizacionesPipePipe } from '../../cotizaciones-pipe.pipe';
import { JwtHelperService } from '@auth0/angular-jwt';
import { cot_larga, Equipo } from '../../../../interfaces/cotizaciones.interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface options {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-mis-cotizaciones',
  templateUrl: './mis-cotizaciones.component.html',
  styleUrls: ['./mis-cotizaciones.component.css'],
  providers: [CotizacionesPipePipe],
  encapsulation: ViewEncapsulation.None
})
export class MisCotizacionesComponent implements OnInit {

  public mobile: Boolean = false;
  public windowWith: Boolean = true;
  public cotizaciones: Array<cot_list> | undefined = [];
  public descripcion_html: SafeHtml = ''
  public caducada: number = 0;
  public solicitada: number = 0;
  public proceso: number = 0;
  public entregada: number = 0;
  public buscador: string = '';
  public filter_list: string = '';
  public filter_option: string = 'folio';
  public empresa: string = '';
  public status: string = '';
  public today: Date = new Date();
  public diferencia: string = ""
  public cotizacion: cot_larga = {
    _id: '',
    folio: '',
    des_corta: '',
    des_larga: '',
    empresa: '',
    sitio: '',
    equipos: [],
    atencion: '',
    remitente: '',
    fecha_sol: new Date(),
    fecha_pro: new Date(),
    fecha_cot: new Date(),
    fecha_cad: new Date(),
    doc: '',
    vigencia: '',
    status: '',
    __v: 0,

  }

  constructor(
    private _cotizaciones_clienteService: CotizacionesClienteService,
    private CotizacionesPipe: CotizacionesPipePipe,
    private sanitazer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this._cotizaciones_clienteService.listar_cotizaciones_cliente().subscribe({
      next: (v) => {

        this.cotizaciones = v;
        if (this.cotizaciones != undefined) {
          for (let stat of this.cotizaciones) {

            if (stat.status === 'Entregada') {
              this.entregada += 1
            } else if (stat.status === 'Solicitada') {
              this.solicitada += 1

            } else if (stat.status === 'Proceso') {
              this.proceso += 1
            } else {
              this.caducada += 1
            }
          }

        }
      },
      error: (e) => console.error(e)
    });

    const token = localStorage.getItem('token') || undefined;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.empresa = decodedToken.empresa;

    // const parser = new DOMParser();
    // const document = parser.parseFromString(this.cotizacion.des_larga, 'text/html')
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      this.mobile = true
    } else {
      // false for not mobile device
      this.mobile = false
    }

    if (window.innerWidth < 601) {
      this.windowWith = true
    } else {
      this.windowWith = false
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 601) {
      this.windowWith = true
    } else {
      this.windowWith = false
    }
  }

  Search(search: string) {
    // this.page = 0;
    this.filter_list = search;
    this.solicitada = this.CotizacionesPipe.transform(this.cotizaciones, 'Solicitada', this.filter_option, search).length
    this.entregada = this.CotizacionesPipe.transform(this.cotizaciones, 'Entregada', this.filter_option, search).length
    this.proceso = this.CotizacionesPipe.transform(this.cotizaciones, 'Proceso', this.filter_option, search).length
    this.caducada = this.CotizacionesPipe.transform(this.cotizaciones, 'Caduco', this.filter_option, search).length
  }

  select(opcion: string) {
    // if(opcion != 'Fecha' && this.filter_list != ''){
    //   this.filter_list = ''
    //   this.buscador = ''
    // }
    this.filter_option = opcion
  }

  Details(folio: string) {
    this._cotizaciones_clienteService.listar_cotizacion_cliente_largas(folio).subscribe({
      next: (v) => {
        this.cotizacion = v[0];
        console.log(this.cotizacion)
        this.descripcion_html = this.sanitazer.bypassSecurityTrustHtml(this.cotizacion.des_larga);
        this.details_();
        this.time_between();
      },
      error: (e) => console.error(e)
    })
  }

  details_() {
    const color = document.getElementById("miscotizaciones-status") as HTMLInputElement | null;
    if (this.cotizacion.status == "Solicitada") {
      this.status = "Solicitado"
      color?.setAttribute("style", "  background-color: #0086d4;");
      var fechaInicio = new Date(this.cotizacion.fecha_sol).getTime();
      var fechaFin = new Date().getTime();
      if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) < 2) {
        if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) == 1) {
          this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " día")
        } else {
          if (Math.floor((fechaFin - fechaInicio) / 60000) > 59) {
            const horas = Math.floor((fechaFin - fechaInicio) / 60000 / 60)
            const minutos = Math.floor((fechaFin - fechaInicio) / 60000) - (horas * 60)
            this.diferencia = (" - hace " + horas + " horas y " + minutos + " minutos ")
          } else {
            this.diferencia = (" - hace " + Math.floor((fechaFin - fechaInicio) / 60000) + " minutos ")
          }
        }
      } else {
        this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " días")
      }
    }
    else if (this.cotizacion.status == "Proceso") {
      this.status = "En Proceso"
      color?.setAttribute("style", "  background-color: #0a9ea1;");
      var fechaInicio = new Date(this.cotizacion.fecha_pro).getTime();
      var fechaFin = new Date().getTime();
      if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) < 2) {
        if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) == 1) {
          this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " día")
        } else {
          this.diferencia = (" - hoy")
        }
      } else {
        this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " días")
      }
    }
    else if (this.cotizacion.status == "Entregada") {
      this.status = "Entregado"
      color?.setAttribute("style", "  background-color: #14b76e;");
      var fechaInicio = new Date(this.cotizacion.fecha_cot).getTime();
      var fechaFin = new Date().getTime();
      if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) < 2) {
        if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) == 1) {
          this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " día")
        } else {
          this.diferencia = (" - hoy")
        }
      } else {
        this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " días")
      }
    }
    else {
      this.status = "Caducado"
      color?.setAttribute("style", "  background-color: #e03f32;");
      var fechaInicio = new Date(this.cotizacion.fecha_cad).getTime();
      var fechaFin = new Date().getTime();
      if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) < 2) {
        if (Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) == 1) {
          this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " día")
        } else {
          this.diferencia = (" - hoy")
        }
      } else {
        this.diferencia = (" - hace " + Math.floor(((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))) + " días")
      }
    }
  }

  time_between() {

  }

  uncheck() {
    if (this.cotizaciones) {
      for (let check of this.cotizaciones) {
        if (check.folio) {
          const box = document.getElementById(check.folio) as HTMLInputElement | null;
          if (box != null) { box.checked = false; }
        }
      }
    }
  }

  scrollTabs(side: string) {
    const scrollableArea = document.getElementById("Tab-center");
    if (scrollableArea != null) {
      if (side == 'left') {
        scrollableArea.scrollBy(-70, 0);
      } else {
        scrollableArea.scrollBy(70, 0);
      }
    }
  }

  scroll_Tap(n:number){
    const scrollableArea = document.getElementById("Tab-center");
    if (scrollableArea != null) {
      scrollableArea.scrollTo(((170*n)-((scrollableArea.offsetWidth-170)/2)), 0)
      // scrollableArea.scrollTo((scrollableArea.scrollWidth/100 * n), 0)
      // scrollableArea.scrollBy(-100, 0);
      // scrollableArea.scrollBy(n, 0);
    }
  }

  Opciones: options[] = [
    { value: 'folio', viewValue: 'Folio' },
    { value: 'descripcion', viewValue: 'Descripcion' },
    { value: 'sitio', viewValue: 'Sitio' },
    { value: 'fecha', viewValue: 'Fecha' },
  ];


}



