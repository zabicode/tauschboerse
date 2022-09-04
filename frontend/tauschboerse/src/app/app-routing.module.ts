import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guards';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FigureCreateComponent } from './figures/figure-create/figure-create.component';
import { FigureDetailsComponent } from './figures/figure-details/figure-details.component';
import { FigureListComponent } from './figures/figure-list/figure-list.component';

const routes: Routes = [
  { path: '', component: FigureListComponent },
  { path: 'search/:keyword', component: FigureListComponent},
  { path: 'create', component: FigureCreateComponent, canActivate: [AuthGuard] },
  { path: 'figure-details/:id', component: FigureDetailsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
