import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalClientComponent } from './principal-client.component';



@NgModule({
  declarations: [
    PrincipalClientComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrincipalClientComponent
  ]
})
export class ClienteModule { }
