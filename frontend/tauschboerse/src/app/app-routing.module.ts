import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FigureCreateComponent } from './figures/figure-create/figure-create.component';
import { FigureDetailsComponent } from './figures/figure-details/figure-details.component';
import { FigureListComponent } from './figures/figure-list/figure-list.component';

const routes: Routes = [
  { path: '', component: FigureListComponent },
  { path: 'search/:keyword', component: FigureListComponent},
  { path: 'create', component: FigureCreateComponent },
  { path: 'figure-details/:id', component: FigureDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
