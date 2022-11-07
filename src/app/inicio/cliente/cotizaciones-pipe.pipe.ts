import { Pipe, PipeTransform } from '@angular/core';
import { cot_list } from 'src/app/interfaces/cotizaciones.interfaces';

@Pipe({
  name: 'cotizacionesPipe'
})
export class CotizacionesPipePipe implements PipeTransform {

  transform(value: cot_list[] | undefined, Kanban: string = '', tipo: string, arg: string): any {
    if (value != undefined && value.length > 0) {

      value = value.filter(fil => fil.status.includes(Kanban));
      const result = [];

      for (const post of value) {
        if (tipo == 'fecha') {
          if (post.fecha_cad!.indexOf(arg) > -1 && Kanban == 'Caduco') {
            result.push(post);
          }
          if (post.fecha_cot!.indexOf(arg) > -1 && Kanban == 'Entregada') {
            result.push(post);
          }
          if (post.fecha_pro!.indexOf(arg) > -1 && Kanban == 'Proceso') {
            result.push(post);
          }
          if (post.fecha_sol!.indexOf(arg) > -1 && Kanban == 'Solicitada') {
            result.push(post);
          }
        } else {
          if (post[tipo as keyof typeof post]!.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
            result.push(post);
          }
        }
      }
      return result;

    }
    return []

  }
}
