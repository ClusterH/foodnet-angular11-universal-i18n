import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CookieService } from '@gorniv/ngx-universal';
import { isPlatformBrowser } from '@angular/common';
import { CitySearchService } from '../../services';
import { AuthService } from '../../../feature/auth/services/auth.service';
import { SessionStorageService } from '../../../core/session-storage/session-storage.service';
import * as environment from '../../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  selectedLanguage: Lang;
  currentUrl: string;
  languages: Lang[];
  locations: any;
  texts: string[];
  results: string[];
  currentLang: string;
  profileType: string;
  menuShow: boolean;
  userName: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private citySearchService: CitySearchService,
    public authService: AuthService,
    public sessionService: SessionStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.activatedroute.paramMap.subscribe(params => {
      this.profileType = params.get('id');
    });
    this.menuShow = false;
    this.userName = this.cookieService.get('auth_name');
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
    // this.currentLang = window.location.pathname.split('/')[1] || 'ro';
    this.currentLang = this.cookieService.get('change_lang');
    this.languages = [{ name: 'ro', label: 'RO' }, { name: 'hu', label: 'HU' }, { name: 'en', label: 'EN' }];
    this.selectedLanguage = this.languages.find(country => country.name === this.currentLang);

    this.citySearchService.getLocations(this.currentLang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.locations = res.locations;
    });
    if (this.isBrowser) {
      window.addEventListener('click', (event) => {
        this.menuContentManage(event);
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changeLanguage(language: any): void {
    this.cookieService.put('change_lang', language.name);
  }

  searchCity(event) {
    this.results = [];
    this.locations.forEach(item => {
      if (item.cities.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(event.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
        this.results.push(item.cities);
      }
    });
  }

  getRestaurantsByLocation(): void {
    this.router.navigate([`${this.texts}`]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  loadComponent(component): void {
    this.router.navigate(['/profile/' + component]);
  }

  menuContentManage(event): void {
    if (!event.target.matches('.menu_content') && !event.target.matches('.profile_menu')) {
      this.menuShow = false;
    }
  }

  menuShowEvent(): void {
    this.menuShow = !this.menuShow;
  }
  menuShowMouseEvent(): void {
    this.menuShow = true;
  }
}

export interface Lang {
  name: string;
  label: string;
}
