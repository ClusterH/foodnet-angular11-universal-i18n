import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, ViewChild } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { AuthService } from 'src/app/modules/feature/auth/services';
import { RestaurantOrderService } from '../../services';
import { CartCountService } from 'src/app/modules/shared/services';
import { Router } from '@angular/router';
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
  isOrder: boolean = false;
  isAuth: boolean = false;
  isSpinner: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private orderService: RestaurantOrderService,
    private deliveryAddressService: DeliveryAddressService,
    private authService: AuthService,
    private cartCountService: CartCountService,
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

    this.cartCountService.hiddenLang(true);
  }

  ngOnInit(): void {
    this.isOrder = false;
    this.isAuth = this.authService.isAuthenticated();
    if (this.isAuth) {
      this.getDeliveryAddress();
    } else {
      this.isSpinner = false;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.cartCountService.hiddenLang(false);
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
        this.isEmptyDeliveryList = false;
        this.deliveryAddressList = [...res.result];
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
      } else {
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
    this.isOrder = true;
    const restaurantOption = { restaurantId: JSON.parse(this.cookieService.get('restaurant')).restaurant_id };
    const totalPrice = JSON.parse(this.cookieService.get('cartProducts')).totalPrice;
    const body = { ...{ lang: this.cookieService.get('change_lang'), totalPrice: totalPrice }, ...restaurantOption, ...this.orderProductOption, ...this.deliveryAddressOption, ...this.paymentOption };

    this.orderService.restaurantOrder(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 200) {
        this.cookieService.remove('cartProducts');
        this.cartCountService.getCartNumber();
        this.cookieService.put('orderId', res.finalOrderId);
        const location = JSON.parse(this.cookieService.get('currentLocation')).location;
        this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}/success`]);
      } else {
        this.isOrder = false;
      }
    }, (errorResponse) => {
      this.isOrder = false;
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
    const locationId = JSON.parse(this.cookieService.get('currentLocation')).id;
    this.deliveryAddressOption = { locationId: locationId, deliveryAddressId: this.loginDeliveryAddressId };
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
