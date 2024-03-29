import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio.component';
import { Child_Cliente_Guard } from '../guards/child_cliente.guard';
import { PrincipalClientComponent } from './cliente/principal-client.component';
import { MisCotizacionesComponent } from './cliente/cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { FormsModule } from '@angular/forms';
import { SolicitarCotizacionComponent } from './cliente/cotizaciones/solicitar-cotizacion/solicitar-cotizacion.component';



const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    canActivateChild: [Child_Cliente_Guard],
    children: [
      {path: 'principal',component: PrincipalClientComponent},
      {path: 'mis-cotizaciones',component: MisCotizacionesComponent},
      {path: 'solicitar-cotizacion',component: SolicitarCotizacionComponent},
      {path: '**',redirectTo: 'principal'}
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class InicioRoutingModule { }
