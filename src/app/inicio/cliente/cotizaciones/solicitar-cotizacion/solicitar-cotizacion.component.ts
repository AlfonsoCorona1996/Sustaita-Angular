import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CotizacionesClienteService } from '../../../../services/cotizaciones-cliente.service';
import { Equipo, sitio_combo, Equipo_res, Refacciones, Refaccion, Refaccion_cot, cot } from '../../../../interfaces/cotizaciones.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

declare var iziToast: any;

@Component({
  selector: 'app-solicitar-cotizacion',
  templateUrl: './solicitar-cotizacion.component.html',
  styleUrls: ['./solicitar-cotizacion.component.css']
})
export class SolicitarCotizacionComponent implements OnInit {

  public empresa: string = '';
  public sitios: Array<sitio_combo> | undefined = [];
  public equipos: Array<Equipo> | undefined = [];
  // public toppings = new FormControl('');
  public mobile: boolean = true;
  public equipo_disabled: boolean = true;
  public equipo_text: string = "selecciona"
  public color_Equipo: string = "#f6f8fa"
  public equipos_selected: Array<Equipo> = []
  public refacciones_part_list: Array<string> = []
  public refacciones_info_list: Array<Refaccion> = []
  public refacciones_select_list: Array<Refaccion_cot> = []

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
    // this.toppings = new FormControl('');
    // this.refacciones_part_list = []
    this.equipos_selected = []
  }


  equipos_select() {
    if (this.equipos_selected.length > 0) {
      this.refacciones_part_list = []
      for (const list of this.equipos_selected) {
        this.refacciones_part_list = this.refacciones_part_list.concat(list.refacciones)
      }
      this.refacciones_part_list = this.refacciones_part_list.filter((item, pos) => this.refacciones_part_list.indexOf(item) === pos)
      this._cotizaciones_clienteService.listar_refacciones(this.refacciones_part_list).subscribe({
        next: (v) => {
          if (v && v.data) {
            this.refacciones_info_list = v.data

            var i = 0;

            for (const list_refacciones of this.refacciones_info_list) {
              for (const list_equipos of this.equipos_selected) {
                const ref: Array<string> = list_equipos.refacciones
                if (ref.includes(list_refacciones._id)) {
                  if (this.refacciones_info_list[i].equipos == undefined) {
                    this.refacciones_info_list[i].equipos = []
                  }
                  this.refacciones_info_list[i].equipos = this.refacciones_info_list[i].equipos.concat(list_equipos.modelo)
                }
              }
              i++;
            }
          } else {
            this.refacciones_info_list = []
          }
        },
        error: (e) => console.error(e)
      });
    }
    else {
      iziToast.show({
        title: 'Error:',
        titleColor: '#FF0000',
        timeout: 3000,
        messageColor: '#051b34',
        color: '#FFFFFF',
        progressBarColor: '#0087d4',
        class: 'text-danger',
        position: 'topRight',
        message: 'Selecciona sitio y equipo(s)',
      });

    }
    // if (this.toppings.value) {
    //   this.equipos_selected = this.toppings.value
    //   this.refacciones_part_list = []
    //   for (const list of this.equipos_selected) {
    //     this.refacciones_part_list = this.refacciones_part_list.concat(list)
    //   }
    //   this.refacciones_part_list = this.refacciones_part_list.filter((item, pos) => this.refacciones_part_list.indexOf(item) === pos)
    //   this._cotizaciones_clienteService.listar_refacciones(this.refacciones_part_list).subscribe({
    //     next: (v) => {
    //       if(v  && v.data){
    //         this.refacciones_info_list = v.data
    //       }else{
    //         this.refacciones_info_list = []
    //       }
    //     },
    //     error: (e) => console.error(e)
    //   });
    // }


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

  close_refaccion_card() {
    const close = document.getElementById("add-refaccion") as HTMLInputElement | null;
    if (close) {
      close.checked = false
    }
    this.refacciones_select_list = []
  }

  finish() {
    const close = document.getElementById("add-refaccion") as HTMLInputElement | null;
    if (close) {
      close.checked = false
    }
  }

  install(id: number) {
    const install = document.getElementById(id + 'install') as HTMLInputElement | null;
    if (install) {
      if (install.checked) {
        this.refacciones_select_list[id].install = true
      } else {
        this.refacciones_select_list[id].install = false
      }
    }
  }

  addRefaccion(index: number) {
    const cant: number = +(<HTMLInputElement>document.getElementById(index + 'cant')).value;
    if (cant > 0 && cant < 99) {
      // const card = document.getElementById("" + index);
      const newRefaccion: Refaccion_cot = {
        nombre: this.refacciones_info_list[index].nombre,
        part: this.refacciones_info_list[index].part,
        id_refaccion: this.refacciones_info_list[index]._id,
        cant: cant,
        install: false,
        equipos: this.refacciones_info_list[index].equipos,
        tipo: this.refacciones_info_list[index].tipo,
        para: this.refacciones_info_list[index].para,
        __v: this.refacciones_info_list[index].__v
      }
      // this.refacciones_info_list[index]
      this.refacciones_info_list.splice(index, 1)
      this.refacciones_select_list.push(newRefaccion);
      (<HTMLInputElement>document.getElementById(index + 'cant')).value = ""
      const close = document.getElementById(index + 'check') as HTMLInputElement | null;
      if (close) {
        close.checked = false
      }
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
        message: 'Ingresa numeros entre 1 - 99',
      });
      (<HTMLInputElement>document.getElementById(index + 'cant')).value = "";
      this.focus(index + 'cant')
    }

  }

  deleteRefaccion(index: number) {
    const newRefaccion: Refaccion = {
      _id: this.refacciones_select_list[index].id_refaccion,
      nombre: this.refacciones_select_list[index].nombre,
      part: this.refacciones_select_list[index].part,
      tipo: this.refacciones_select_list[index].tipo,
      para: this.refacciones_select_list[index].para,
      __v: this.refacciones_select_list[index].__v,
      equipos: this.refacciones_select_list[index].equipos
    }
    this.refacciones_select_list.splice(index, 1);
    this.refacciones_info_list.push(newRefaccion);
  }

  async focus(id: string) {
    await this.delay(300);
    const input = document.getElementById(id);
    input?.focus()
  }

  public trackItem(index: number, item: any): number {
    return item.id;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
