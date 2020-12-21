import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/feature/home/pages/home.component';
import { NotFoundComponent } from './modules/feature/not-found/not-found.component';
import { AuthGuard } from './modules/feature/auth/services/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./modules/feature/auth/auth.module').then(m => m.AuthModule) },
  { path: 'profile/:id', loadChildren: () => import('./modules/feature/profile/profile.module').then(m => m.ProfileModule) },
  { path: ':location', loadChildren: () => import('./modules/feature/restaurant-list/restaurant-list.module').then(m => m.RestaurantListModule) },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
