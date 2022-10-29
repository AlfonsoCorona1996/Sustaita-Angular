import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPopModule } from './admin-pop/admin-pop.module';
import { PopUpComponent } from './pop-up.component';



@NgModule({
  declarations: [
    PopUpComponent
  ],
  imports: [
    CommonModule,
    AdminPopModule
  ],
  exports: [
    PopUpComponent
  ]
})
export class PopUpModule { }
