import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../auth/services/auth.guard';

import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '**', component: ProfileComponent },
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
})
export class ProfileRoutingModule { }
