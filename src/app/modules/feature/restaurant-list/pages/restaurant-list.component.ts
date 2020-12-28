import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from '../../../core';
import { Subject, Observable, of } from 'rxjs';
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
  isSpinner: boolean = true;
  filterShow: boolean = false;
  filterOption: FilterOption;

  lang: string;
  locationId: number;
  searchString: string;
  restaurantList$: Observable<RestaurantList[]>;
  restaurantListLength$: Observable<number> = of(0);
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private sessionStorageService: SessionStorageService,
    private restaurantFilterService: RestaurantFilterService,
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.lang = this.cookieService.get('change_lang');
    this.filterOption = new FilterOption;
  }

  ngOnInit(): void {


    this.isSpinner = true;
    this.locationId = JSON.parse(this.cookieService.get('currentLocation')).id;
    this.restaurantFilterService.getRestaurantsByLocation(this.cookieService.get('change_lang'), this.locationId).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.restaurantList$ = of(res.result);
      this.restaurantListLength$ = of(res.result.length);
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

  filterShowEvent(event): void {
    this.filterShow = event;
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
      this.restaurantList$ = of(res.result);
      this.restaurantListLength$ = of(res.result.length);
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
    this.cookieService.put('restaurant', JSON.stringify(restaurant));

    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${restaurant.restaurant_name.replace(/\s/g, '-')}`]);
  }
}
