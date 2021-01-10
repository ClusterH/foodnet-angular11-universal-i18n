import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, ViewChild } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { AuthService } from 'src/app/modules/feature/auth/services';
import { RestaurantOrderService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { RestaurantList } from '../../../../models';
import { OrderProductList, DeliveryAddress, Payment } from '../../models';

import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-restaurant-order',
  templateUrl: './restaurant-order.component.html',
  styleUrls: ['./restaurant-order.component.scss']
})

export class RestaurantOrderComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurant: RestaurantList;
  orderProductList: OrderProductList[];
  loginDeliveryAddressId: number = -1;
  deliveryAddressList: Array<any>;
  deliveryAddressList$: Observable<Array<any>>;
  isEmptyDeliveryList: boolean = false;
  deliveryAddress: DeliveryAddress = null;
  orderProductOption: any;
  deliveryAddressOption: any;
  paymentOption: Payment;
  isAuth: boolean = false;
  isSpinner: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private orderService: RestaurantOrderService,
    private deliveryAddressService: DeliveryAddressService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
    this.paymentOption = {
      take: 0,
      cutlery: 0,
      messageCourier: ""
    }
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthenticated();
    if (this.isAuth) {
      this.getDeliveryAddress();
    } else {
      this.isSpinner = false;
    }
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

  getDeliveryAddress(): void {
    const lang = this.cookieService.get('change_lang') || 'ro';
    this.deliveryAddressService.getDeliveryAddress(lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 200 && !isEmpty(res.result)) {
        console.log('=====NONempty');
        this.isEmptyDeliveryList = false;
        this.deliveryAddressList = [...res.result];
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
      } else {
        console.log('=====empty');
        this.isEmptyDeliveryList = true;
        this.deliveryAddressList = [];
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
      }
    }, (errorResponse) => {
      this.isSpinner = false;
    });
  }

  orderSuccess(): void {
    const restaurantOption = { restaurantId: JSON.parse(this.cookieService.get('restaurant')).restaurant_id };
    const body = { ...restaurantOption, ...this.orderProductOption, ...this.deliveryAddressOption, ...this.paymentOption };

    this.orderService.restaurantOrder(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 400) {

      } else if (res.status == 200) {
        const location = JSON.parse(this.cookieService.get('currentLocation')).location;
        this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}/success`]);
      }
    }, (errorResponse) => {
      this.isSpinner = false;
    });
  }

  goBack(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}`]);
  }

  orderProductListEmitter(event: OrderProductList[]): void {
    this.orderProductList = event;
    this.orderProductOption = { products: this.orderProductList };
  }

  loginDeliveryAddressIdEmitter(event: number): void {
    this.loginDeliveryAddressId = event;
    this.deliveryAddressOption = { deliveryAddressId: this.loginDeliveryAddressId };
  }

  logoutDeliveryAddressEmitter(event: DeliveryAddress): void {
    this.deliveryAddress = event;
    this.deliveryAddressOption = this.deliveryAddress;
  }

  noDeliveryAddressEmitter(event: DeliveryAddress): void {
    this.deliveryAddress = event;
    this.deliveryAddressOption = this.deliveryAddress;
  }

  paymentEventEmitter(event: Payment): void {
    this.paymentOption = event;
  }
}
