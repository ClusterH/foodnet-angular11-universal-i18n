import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CookieService } from '@gorniv/ngx-universal';
import { isPlatformBrowser } from '@angular/common';
import { CitySearchService } from '../../services/city-search.service';
import { AuthService } from '../../../feature/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isBrowser: boolean;
  selectedLanguage: Lang;
  currentUrl: string;
  languages: Lang[];
  locations: any;
  texts: string[];
  results: string[];
  currentLang: string;
  private _unsubscribeAll: Subject<any>;


  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    public cookieService: CookieService,
    private citySearchService: CitySearchService,
    public authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
    this.currentLang = window.location.pathname.split('/')[1];
    console.log(this.currentLang);
    // const siteLanguage = this.languageList.find(f => f.code === this.siteLocale).label;
    this.languages = [{ name: 'ro', label: 'RO' }, { name: 'hu', label: 'HU' }, { name: 'en', label: 'EN' }];
    this.selectedLanguage = this.languages.find(country => country.name === this.currentLang);

    // const lang = this.cookieService.get('language') || 'ro';
    this.citySearchService.getLocations(this.currentLang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.locations = res.locations;
    });
  }

  changeLanguage(language: any): void {
    // this.cookieService.put('language', language.name);
    // this.selectedLanguage = language;
    // console.log(this.selectedLanguage);
  }

  searchCity(event) {
    this.results = [];
    console.log(this.results);
    this.locations.forEach(item => {
      if (item.cities.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(event.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
        this.results.push(item.cities);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

export interface Lang {
  name: string;
  label: string;
}
