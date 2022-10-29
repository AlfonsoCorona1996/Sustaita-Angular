import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteLoginComponent } from './login/cliente-login/cliente-login.component';
import { TokenGuard } from './guards/token.guard';

const routes: Routes = [
 {
   path: 'cliente',
   loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioModule),
   canActivate: [TokenGuard]
  },
  {
    path: 'login',
    component: ClienteLoginComponent,
    pathMatch: 'full'
   },
  //  {
  //    path: 'login/admin',
  //    component: AdminLoginComponent
  //   },
   {
     path: '**',
     redirectTo: 'login'
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
