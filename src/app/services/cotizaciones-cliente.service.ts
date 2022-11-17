import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cotizaciones, cot, cot_list, cot_larga, sitio_combo, Sitios, Equipo, Equipos, Equipo_res } from '../interfaces/cotizaciones.interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class CotizacionesClienteService {

  public url;
  // $modal = new EventEmitter<boolean>();
  // $folio = new EventEmitter<string>();


  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;

  }

//! MIS COTIZACIONES

  // ? Datos para card de cotizacion Kanban
  listar_cotizaciones_cliente(): Observable<cot_list[] | undefined> {
    const token = localStorage.getItem('token') || undefined;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const data = {
      empresa:decodedToken.id_empresa
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<Cotizaciones>(this.url + 'listar_cotizaciones_clientes/',data,{headers:headers})
      .pipe(
        map(this.lista_cot)
      );
  }

  private lista_cot(resp: Cotizaciones):cot_list[] | undefined {
    if(resp.data == undefined){
      return undefined;
    }
    const lista: cot_list[] = resp.data.map(cotizacion => {

      let vigencia = '';
      let status = cotizacion.status;

      let caducidad = new Date(cotizacion.fecha_cot);

      if (cotizacion.status === 'Entregada') {
        const now = new Date();
        const dia = new Date(cotizacion.fecha_cot).getDate();
        caducidad.setDate(dia + cotizacion.vigencia);

        if (now > caducidad) {
          caducidad
          status = 'Caduco';
          vigencia = 'Caducó'
        } else {
          const vigencia_dias = Math.round((caducidad.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (vigencia_dias < 2){
            if(vigencia_dias == 0){
              vigencia = 'último dia';
            }
            else{
              vigencia = '1 dia';
            }

          }else{
            vigencia = vigencia_dias + ' dias';
          }
        }
      }


      return {
        folio:     cotizacion.folio,
        descripcion: cotizacion.des_cliente,
        sitio:     cotizacion.sitio,
        fecha_sol: new Date(cotizacion.fecha_sol).toLocaleDateString("es-MX"),
        fecha_pro: new Date(cotizacion.fecha_pro).toLocaleDateString("es-MX"),
        fecha_cot: new Date(cotizacion.fecha_cot).toLocaleDateString("es-MX"),
        fecha_cad: new Date(caducidad).toLocaleDateString("es-MX"),
        vigencia,
        status,
      }

    })

    return lista

  }


    // ? Datos completos de cotizacion cuando se hace click en card kanban
  listar_cotizacion_cliente_largas(folio:string): Observable<cot_larga[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get<Cotizaciones>(this.url + `listar_cotizaciones_clientes/${folio}`, { headers: headers })
      .pipe(
        map(this.lista_cot_larga)
      );
  }

  private lista_cot_larga(resp: Cotizaciones):cot_larga[] {
    const cot: cot_larga[] = resp.data.map(cotizacion => {

      let vigencia = '';
      let status = cotizacion.status;
      const caducidad =  new Date(cotizacion.fecha_cot);
      if (cotizacion.status === 'Entregada') {
        const now = new Date();
        const dia = new Date(cotizacion.fecha_cot).getDate();
        caducidad.setDate(dia + cotizacion.vigencia);
        if (now > caducidad) {
          status = 'Caduco';
          vigencia = 'Caducó'
        } else {
          const vigencia_dias = Math.round((caducidad.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (vigencia_dias < 2){
            if(vigencia_dias == 0){
              vigencia = 'último dia';
            }
            else{
              vigencia = '1 dia';
            }

          }else{
            vigencia = vigencia_dias + ' dias';
          }
        }
      }

      return {
        _id:       cotizacion._id,
        folio:     cotizacion.folio,
        des_corta: cotizacion.des_cliente,
        des_larga: cotizacion.des_empresa,
        empresa:   cotizacion.empresa,
        sitio:     cotizacion.sitio,
        equipos:   cotizacion.equipos,
        atencion:  cotizacion.atencion,
        remitente: cotizacion.remitente,
        fecha_sol: cotizacion.fecha_sol,
        fecha_pro: cotizacion.fecha_pro,
        fecha_cot: cotizacion.fecha_cot,
        fecha_cad: caducidad,
        doc:       cotizacion.doc,
        vigencia,
        status,
        __v:        cotizacion.__v
      }

    })

    return cot

  }



//! SOLICITAR COTIZACION

// ? Combobox sitios
listar_sitios():Observable<sitio_combo[] | undefined> {
  const token = localStorage.getItem('token') || undefined;
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
  const data = {
    empresa:decodedToken.id_empresa
  };
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this._http.post<Sitios>(this.url + 'listar_sitios/',data,{headers:headers})
  .pipe(
    map(this.lista_sitios)
  )
}

private lista_sitios(resp: Sitios):sitio_combo[] | undefined {
  if(resp.data == undefined){
    return undefined;
  }
  const sitio: sitio_combo[] = resp.data.map(sitio => {
    return {
      nombre: sitio.nombre,
      id: sitio._id
    }

  })

  return sitio

}

// ? Combobox equipos
listar_equipos(id_sitio:string):Observable<Equipo_res | undefined> {
  const data = {
    sitio:id_sitio
  };
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this._http.post<Equipos>(this.url + 'listar_equipos/',data,{headers:headers})
  .pipe(
    map(this.lista_equipos)
  )
}

private lista_equipos(resp: Equipos):Equipo_res | undefined {
  if(resp.data == undefined){
    return undefined;
  }
  // const equipo: Equipo_res = resp.data.map(equipo => {
  //   return {
  //     _id: equipo._id,
  //     Equipos: equipo.Equipos
  //     // id: equipo.id,
  //     // marca: equipo.marca,
  //     // modelo: equipo.modelo,
  //     // serie: equipo.serie,
  //     // tipo: equipo.tipo,
  //     // capacidad: equipo.capacidad,
  //     // refrigerante: equipo.refrigerante,
  //     // manual: equipo.manual
  //   }

  // })

  return resp.data

}





}
