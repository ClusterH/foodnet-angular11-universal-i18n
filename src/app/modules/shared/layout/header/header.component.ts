import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CookieService } from '@gorniv/ngx-universal';
import { isPlatformBrowser } from '@angular/common';
import { CitySearchService } from '../../services';
import { AuthService } from '../../../feature/auth/services/auth.service';
import { SessionStorageService } from '../../../core';
import { CartCountService } from 'src/app/modules/shared/services';
import * as environment from '../../../../../environments/environment';
import { isEmpty } from 'lodash';

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
  selectedCity: any = null;
  filteredCities: any[];
  currentLang: string;
  profileType: string;
  menuShow: boolean;
  userName: string;
  cartNumber: number = 0;
  cartNumber$: Observable<number>;
  isHiddenLang: boolean = false;
  isHiddenLang$: Observable<boolean>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private citySearchService: CitySearchService,
    public cartCountService: CartCountService,
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
    this.cartCountService.getCartNumber();
    this.cartCountService.cartCount$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.cartNumber = res;
      this.cartNumber$ = of(this.cartNumber);
    });
    this.cartCountService.isHiddenLang$.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.isHiddenLang = res;
      this.isHiddenLang$ = of(this.isHiddenLang);
    })
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
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

    this.citySearchService.currentCity$.subscribe(res => {

      this.selectedCity = res;
      if (this.selectedCity == null) {
        if (this.cookieService.get('currentLocation')) {
          this.selectedCity = this.locations.find(item => item.id === JSON.parse(this.cookieService.get('currentLocation')).id);
          this.citySearchService.currentCity.next(this.selectedCity);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changeLanguage(language: any): void {
    this.cookieService.put('change_lang', language.name);
    this.citySearchService.getLocations(this.currentLang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

      this.locations = res.locations;
    });
  }

  searchCity(event) {
    this.filteredCities = [];
    this.locations.forEach(item => {
      if (item.cities.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(event.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
        this.filteredCities.push(item);
      }
    });
  }

  getRestaurantsByLocation(): void {

    const location = this.locations.find(item => item.id === this.selectedCity.id);
    this.cookieService.put('currentLocation', JSON.stringify({ id: location.id, location: location.cities }));
    this.citySearchService.currentCity.next(location);
    this.router.navigate([`/${location.cities.replace(/\s/g, '-')}`]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  logIn(): void {
    this.router.navigate(['/auth/login']);
  }

  register(): void {
    this.router.navigate(['/auth/register']);
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

  moveToHome(): void {
    this.selectedCity = null;

    if (this.cookieService.get('filter_option')) {
      this.cookieService.remove('filter_option');
    }
    if (this.cookieService.get('currentLocation')) {
      this.cookieService.remove('currentLocation');
    }
  }

  countCart(): void {
    const cartProductList = JSON.parse(this.cookieService.get('cartProducts')).cartList || [];
    let count: number = 0;
    if (cartProductList != []) {
      cartProductList.map(product => {
        count = count + product.product.count;
      })
    }

    this.cartNumber = count;
    this.cartNumber$ = of(this.cartNumber);
  }

  goToOrder(): void {
    if (this.cartNumber == 0) {
      return;
    }

    const restaurant = JSON.parse(this.cookieService.get('restaurant'));
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${restaurant.restaurant_name.replace(/\s/g, '-')}/order`]);
  }
}

export interface Lang {
  name: string;
  label: string;
}
