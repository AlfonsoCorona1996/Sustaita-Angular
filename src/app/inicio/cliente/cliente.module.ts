import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalClientComponent } from './principal-client.component';
import { CotizacionesPipePipe } from './cotizaciones-pipe.pipe';
import { MisCotizacionesComponent } from './cotizaciones/mis-cotizaciones/mis-cotizaciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitarCotizacionComponent } from './cotizaciones/solicitar-cotizacion/solicitar-cotizacion.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';


import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from '@tinymce/tinymce-angular';

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
    MatTabsModule,
    // BrowserModule,
    EditorModule
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

