import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/pages/main/main.component';
import { ProjectComponent } from './components/pages/project/project.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'project',
    component: ProjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
