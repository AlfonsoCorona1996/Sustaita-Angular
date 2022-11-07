import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalClientComponent } from './principal-client.component';
import { CotizacionesPipePipe } from './cotizaciones-pipe.pipe';
import { MisCotizacionesComponent } from './cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { FormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    PrincipalClientComponent,
    CotizacionesPipePipe,
    MisCotizacionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    PrincipalClientComponent,
    CotizacionesPipePipe,
    MisCotizacionesComponent
  ],
  providers:[
    CotizacionesPipePipe,
  ]
})
export class ClienteModule { }
