import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio.component';
import { PopUpModule } from './pop-up/pop-up.module';
import { InicioRoutingModule } from './inicio-routing.module';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { ClienteModule } from './cliente/cliente.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    PopUpModule,
    InicioRoutingModule,
    SharedModule,
    ClienteModule,
    FormsModule,
    // BrowserModule
  ],
  exports: [
    InicioComponent
  ]
})
export class InicioModule { }
