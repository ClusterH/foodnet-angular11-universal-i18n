import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { CartCountService } from 'src/app/modules/shared/services';
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
  isSpinner = true;
  filterShow: boolean = false;
  filterOption: FilterOption;
  isRemovePrevOrderDialog: boolean = false;

  lang: string;
  locationId: number;
  searchString: string;
  restaurantList$: Observable<RestaurantList[]>;
  restaurantListLength$: Observable<number> = of(0);
  newRestaurant: RestaurantList;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private cartCountService: CartCountService,
    private restaurantFilterService: RestaurantFilterService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.lang = this.cookieService.get('change_lang');
    this.filterOption = new FilterOption;
    // this.cartCountService.hiddenLang(true);
  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(routeParams => {
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
    });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    // this.cartCountService.hiddenLang(false);
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

  restaurantProfile(restaurant: RestaurantList) {
    const prevRestaurantId = this.cookieService.get('restaurant') ? JSON.parse(this.cookieService.get('restaurant')).restaurant_id : null;

    if (prevRestaurantId == restaurant.restaurant_id) {
      this.goToRestaurant(restaurant.restaurant_name);
    } else {
      const cartList = this.cookieService.get('cartProducts') ? JSON.parse(this.cookieService.get('cartProducts')) : null;
      if (cartList == null) {
        this.cookieService.put('restaurant', JSON.stringify(restaurant));
        this.goToRestaurant(restaurant.restaurant_name);
      } else {
        this.newRestaurant = restaurant;
        this.isRemovePrevOrderDialog = true;
      }
    }
  }

  closeMsg(isDelete: boolean): void {
    if (isDelete) {
      this.cookieService.put('restaurant', JSON.stringify(this.newRestaurant));
      this.cookieService.remove('cartProducts');
      this.isRemovePrevOrderDialog = false;
      this.cartCountService.getCartNumber();
      this.goToRestaurant(this.newRestaurant.restaurant_name);
    } else {
      const restaurant_name = this.cookieService.get('restaurant') ? JSON.parse(this.cookieService.get('restaurant')).restaurant_name : null;
      this.isRemovePrevOrderDialog = false;
      this.goToRestaurant(restaurant_name);
    }
  }

  goToRestaurant(restaurantName): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${restaurantName.replace(/\s/g, '-')}`]);
  }
}
