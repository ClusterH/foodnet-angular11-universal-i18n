import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { isPlatformBrowser } from '@angular/common';

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
  // langs: any;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    console.log(this.selectedLanguage, this.cookieService.get('language'));

    this.languages = [{ name: 'en', label: 'En' }, { name: 'ro', label: 'Ro' }, { name: 'hu', label: 'Hu' }];
    this.selectedLanguage = this.cookieService.get('language') ? this.languages.find(country => country.name === this.cookieService.get('language')) : { name: 'en', label: 'En' };
    console.log(this.selectedLanguage, this.cookieService.get('language'));

    this.locations = [
      {
        "id": 1,
        "cities": "Târgu Mureș en"
      },
      {
        "id": 2,
        "cities": "Miercurea Ciuc en"
      },
      {
        "id": 3,
        "cities": "Odorheiu Secuiesc en"
      },
      {
        "id": 4,
        "cities": "Cluj Napoca en"
      },
      {
        "id": 5,
        "cities": "Brașov en"
      },
      {
        "id": 6,
        "cities": "Brădești en"
      }
    ];


    // this.langs = ["HU", "EN", "RO"];
  }

  ngOnInit(): void {
    // localStorage.setItem('currentLang', this.selectedLanguage.name);

    this.router.events.subscribe(event => {
      console.log('event===>>>', event);
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  changeLanguage(language: any): void {
    this.cookieService.put('language', language.name);
    this.selectedLanguage = language;
    console.log(this.selectedLanguage);
  }

  searchCity(event) {
    this.results = [];
    this.locations.forEach(item => {
      if (item.cities.toLowerCase().includes(event.query)) {
        this.results.push(item.cities);
      }
    });
  }
}

export interface Lang {
  name: string;
  label: string;
}
