import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CookieBarComponent } from './components/cookiebar/cookiebar.component';
import { CitySearchService } from './services/city-search.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AutoCompleteModule,
    DropdownModule,
    DialogModule,
  ],
  declarations: [HeaderComponent, FooterComponent, CookieBarComponent],
  providers: [CitySearchService],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatButtonModule,
    //primeNg
    CarouselModule,
    AutoCompleteModule,
    DropdownModule,
    DialogModule,
    MessageModule,
    MessagesModule,
    TableModule,

    HeaderComponent,
    FooterComponent,
    CookieBarComponent,
  ]
})
export class ShareModule {
  constructor() { }
}
