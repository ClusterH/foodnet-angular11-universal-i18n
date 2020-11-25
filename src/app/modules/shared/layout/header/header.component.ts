import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CookieService } from '@gorniv/ngx-universal';
import { isPlatformBrowser } from '@angular/common';
import { CitySearchService } from '../../services/city-search.service';

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
  private _unsubscribeAll: Subject<any>;


  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private cookieService: CookieService,
    private citySearchService: CitySearchService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();

    this.languages = [{ name: 'ro', label: 'RO' }, { name: 'hu', label: 'HU' }, { name: 'en', label: 'EN' }];
    this.selectedLanguage = this.cookieService.get('language') ? this.languages.find(country => country.name === this.cookieService.get('language')) : { name: 'ro', label: 'RO' };
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    const lang = this.cookieService.get('language') || 'ro';
    this.citySearchService.getLocations(lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.locations = res.locations;
    });
  }

  changeLanguage(language: any): void {
    this.cookieService.put('language', language.name);
    this.selectedLanguage = language;
    console.log(this.selectedLanguage);
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
}

export interface Lang {
  name: string;
  label: string;
}
