import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RestaurantList, FilterOption } from '../models';
import { RestaurantFilterService } from '../services';
import * as moment from 'moment';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss'],
})

export class RestaurantListComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  isSpinner: boolean = false;
  filterShow: boolean = false;
  filterOption: FilterOption;

  lang: string;
  locationId: number;
  searchString: string;
  restaurantList: RestaurantList[];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private restaurantFilterService: RestaurantFilterService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.lang = this.cookieService.get('change_lang');
    this.isSpinner = true;
    this.filterOption = new FilterOption;
  }

  ngOnInit(): void {
    this.locationId = Number(this.sessionStorageService.getItem('currentLocationId'));
    this.restaurantFilterService.getRestaurantsByLocation(this.lang, this.locationId).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      this.restaurantList = [...res.result];
      this.isSpinner = false;
    },
      (errorResponse) => {
        this.isSpinner = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  filterShown(): void {
    this.filterShow = !this.filterShow;
  }

  onKeyUpSearch(): void {
    this.filterOption.searchString = this.searchString;
    this.filterRestaurant();
  }

  filterEventFromPanel(event: any) {
    this.filterOption.filters = event;
    this.filterRestaurant();
  }

  filterRestaurant() {
    this.isSpinner = true;
    this.filterOption.lang = this.lang;
    this.filterOption.locationId = this.locationId;
    this.restaurantFilterService.getFilteredRestaurants(this.filterOption).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.restaurantList = [...res.result];
      this.isSpinner = false;
    },
      (errorResponse) => {
        this.isSpinner = false;
      });
  }

  isOverdue(openTime, closeTime): boolean {
    const format = 'hh:mm';
    const open = moment(openTime, format);
    const close = moment(closeTime, format);
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const current = moment(`${hour}:${minute}`, format);

    return current.isBetween(open, close);
  }

  restaurantProfile(restaurant: any) {
    console.log(restaurant);
    this.sessionStorageService.setParams(restaurant);
    const location = 'Târgu Mureș'
    this.router.navigate([`${location}/${restaurant.restaurant_name}`]);
  }
}
