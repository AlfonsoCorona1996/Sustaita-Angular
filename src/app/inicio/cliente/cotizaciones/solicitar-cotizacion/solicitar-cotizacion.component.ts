import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CotizacionesClienteService } from '../../../../services/cotizaciones-cliente.service';
import { Equipo, sitio_combo, Equipo_res, Refacciones, Refaccion, Refaccion_cot, cot, cotizacion_registrar } from '../../../../interfaces/cotizaciones.interfaces';
// import { FormControl, FormGroup } from '@angular/forms';
// import { MatTabsModule } from '@angular/material/tabs';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { data } from 'jquery';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var iziToast: any;

@Component({
  selector: 'app-solicitar-cotizacion',
  templateUrl: './solicitar-cotizacion.component.html',
  styleUrls: ['./solicitar-cotizacion.component.css']
})
export class SolicitarCotizacionComponent implements OnInit {

  public empresa: string = '';
  public empresa_id: string = '';
  public folio: string = '';
  // public arr_files_name: string[] = ["4O7SQ7ofmiJEGekA6r4Xvf4K.png"];
  public titulo: string = '';
  public descripcion: string = '';
  public atencion: string = '';
  public sitios: Array<sitio_combo> | undefined = [];
  public equipos: Array<Equipo> | undefined = [];
  public sitio_selected: sitio_combo = { nombre: "TBD", id: "TBD" };
  // public toppings = new FormControl('');
  public mobile: boolean = true;
  public equipo_disabled: boolean = true;
  public equipo_text: string = "selecciona"
  public color_Equipo: string = "#f6f8fa"
  public equipos_selected: Array<Equipo> = []
  public refacciones_part_list: Array<string> = []
  public refacciones_info_list: Array<Refaccion> = []
  public refacciones_select_list: Array<Refaccion_cot> = []
  public selectedFiles: Array<File> = []
  public registrar: cotizacion_registrar = {
    folio: '',
    des_cliente: '',
    des_empresa: '',
    empresa: '',
    sitio: '',
    id_sitio: '',
    equipos: [],
    atencion: '',
    fecha_sol: new Date(),
    status: '',
    refacciones: [],
    archivos: []
  };








  constructor(
    private _cotizaciones_clienteService: CotizacionesClienteService,
    private _login_service: LoginService,
    private _router: Router
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
    this.empresa_id = decodedToken.id_empresa;
    this.atencion = decodedToken.sub;


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      this.mobile = true
    } else {
      // false for not mobile device
      this.mobile = false
    }
  }

  // ! Funcion para obtener los equipos del siitio seleccionado
  // ? Recibe el value = id de sitio y el text = nombre del sitio para agregarlo en los datos de las refacciones futuramente agregadas
  select(value: string, text: string) {
    if (value != "selecciona") {
      this.sitio_selected = {
        nombre: text,
        id: value
      }
      this._cotizaciones_clienteService.listar_equipos(value).subscribe({
        next: (v) => {
          this.equipos = v?.Equipos;
        },
        error: (e) => console.error(e)
      });
      this.color_Equipo = "#FFFFFF"

    } else {
      this.sitio_selected = { nombre: "TBD", id: "TBD" };
      this.equipos = []
      this.color_Equipo = "#F6F8FA"
    }
    // this.toppings = new FormControl('');
    // this.refacciones_part_list = []
    this.equipos_selected = []
    this.refacciones_select_list = []
  }

  // !Funcion para obtener los equipos del siitio seleccionado
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
      this.refacciones_info_list = []
      this.refacciones_part_list = []
    }
    //* Regresar el tap de refacciones a la primera
    const checkbox = document.getElementById("next-refaccionn") as HTMLInputElement | null;
    if (checkbox) {
      console.log("aqui")
      checkbox.checked = false
    }
  }

  // ! Funcion para abrir poup de refacciones, pero en la tab de seleccionadas
  open_refacciones_selected() {
    if (this.refacciones_info_list.length > 0) {
      const checkbox = document.getElementById("add-refaccion") as HTMLInputElement | null;
      const checkbox2 = document.getElementById("next-refaccionn") as HTMLInputElement | null;
      if (checkbox && checkbox2) {
        checkbox.checked = true
        checkbox2.checked = true
      }
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
  }

  // ! Funcion para cerrar el popup de seleccionar refaccion (no se si borrar [] de refacciones seleccionadas)
  close_refaccion_card() {
    const close = document.getElementById("add-refaccion") as HTMLInputElement | null;
    if (close) {
      close.checked = false
    }
    // this.refacciones_select_list = []
  }

  // ! Funcion para cerrar el popup de seleccionar refaccion desde boton finalizar
  finish() {
    const close = document.getElementById("add-refaccion") as HTMLInputElement | null;
    if (close) {
      close.checked = false
    }
  }

  // ! Funcion para agregar si la refaccion contempla instalacion o no
  // ? Recibe id = index del array
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

  // ! Funcion para pasar refacccion del [] general al [] de refacciones seleccionadas
  // ? Recibe index = index del []
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
        __v: this.refacciones_info_list[index].__v,
        sitio: this.sitio_selected
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

  // ! Funcion para borrar una refaccion de las refacciones seleccionadas y regresarla al [] general
  // ? Recibe index = index de []
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

  remove_file(index: number) {
    this.selectedFiles.splice(index, 1)

  }

  // ! Funcion para validar si el archivo ya existe, es menor a 4mb y añadirlo al [] de archivos
  // ? Se envia la funcion event para tomar de ahi el archivo
  fileChangeEvent(evento: Event) {
    var file;
    const isThereFile = evento.target as HTMLInputElement;
    if (isThereFile && isThereFile.files && isThereFile.files[0]) {
      for (let i = 0; i < isThereFile.files.length; i++) {
        // file = <File>isThereFile.files[0];
        const file = <File>isThereFile.files[i];

        if (file.size <= 4000000) {
          var exist: boolean = false
          for (let f of this.selectedFiles) {
            if (f.name == file.name && f.size == file.size) {
              exist = true
              break
            }
          }
          if (exist) {
            console.log("ya esta")
            iziToast.show({
              title: 'Error:',
              titleColor: '#FF0000',
              timeout: 3000,
              messageColor: '#051b34',
              color: '#FFFFFF',
              progressBarColor: '#0087d4',
              class: 'text-danger',
              position: 'topRight',
              message: 'El archivo ' + file.name + ' ya fue seleccionado',
            });
          } else {
            this.selectedFiles.push(file)
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
            message: file.name + ', no pudo ser agregado por que es mayor a 4MB',
          });
          //  const inputFile = document.getElementById("file-input") as HTMLInputElement | null;;
          //  if (inputFile){
          //   inputFile.value = ''
          //  }
        }
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
        message: 'No seleccionaste ningun archivo',
      });
    }
  }

  request() {

    if (this.titulo != '' && this.descripcion != '' && this.equipos_selected.length > 0) {
      const token = this._login_service.getToken()
      this.registrar = {
        folio: '',
        des_cliente: this.titulo,
        des_empresa: this.descripcion,
        empresa: this.empresa_id,
        sitio: this.sitio_selected.nombre,
        id_sitio: this.sitio_selected.id,
        equipos: this.equipos_selected,
        atencion: this.atencion,
        fecha_sol: new Date(),
        status: 'Solicitada',
        refacciones: this.refacciones_select_list,
        archivos: []
      }

      this._cotizaciones_clienteService.registro_solicitud_cotizacion_JSON(this.registrar).subscribe({
        next: (v) => {
          if (v != undefined) {
            this.folio = v.folio
            if (this.selectedFiles.length > 0) {
              this._cotizaciones_clienteService.registro_solicitud_cotizacion_FILES(this.selectedFiles, token).subscribe({
                next: (v) => {
                  this._cotizaciones_clienteService.update_files_names(v.data, this.folio).subscribe({
                    next: (v) => {
                      this._router.navigate(['/cliente/inicio/mis-cotizaciones']);
                    },
                    error: (e) => console.error(e)
                  });
                },
                error: (e) => console.error(e)
              });
            }
          }
        },
        error: (e) => console.error(e)
      })




      // this._cotizaciones_clienteService.update_files_names(this.arr_files_name).subscribe({
      //   next: (v) => {
      //     console.log(v)
      //   },
      //   error: (e) => console.error(e)
      // });


      // this._router.navigate(['/cliente/inicio/mis-cotizaciones']);

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
        message: 'Es necesario llenar los campos faltantes para continuar',
      });
    }
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
