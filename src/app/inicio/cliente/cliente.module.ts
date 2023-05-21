import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalClientComponent } from './principal-client.component';
import { CotizacionesPipePipe } from './cotizaciones-pipe.pipe';
import { MisCotizacionesComponent } from './cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitarCotizacionComponent } from './cotizaciones/solicitar-cotizacion/solicitar-cotizacion.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';




@NgModule({
  declarations: [
    PrincipalClientComponent,
    CotizacionesPipePipe,
    MisCotizacionesComponent,
    SolicitarCotizacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTabsModule
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

