import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, ViewChild } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { AuthService } from 'src/app/modules/feature/auth/services';
import { RestaurantOrderService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { RestaurantList } from '../../../../models';
import { OrderProductList } from '../../models';

import * as moment from 'moment';
import { isEmpty, takeUntil } from 'rxjs/operators';

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
  deliveryAddressList: Array<any>;
  deliveryAddressList$: Observable<Array<any>>;
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
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthenticated();
    if (this.isAuth) {
      this.getDeliveryAddress();
    }
  }

  getDeliveryAddress(): void {
    const lang = this.cookieService.get('change_lang') || 'ro';
    this.deliveryAddressService.getDeliveryAddress(lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.deliveryAddressList = res.result;
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
      } else {
        this.deliveryAddressList = [];
        this.deliveryAddressList$ = of(this.deliveryAddressList);
      }
    }, (errorResponse) => {
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

  orderSuccess(): void {
    // console.log(this.cartProductList);
    // console.log(this.selectedDeliveryAddress);
    // console.log(this.take, '===', this.cutlery);
    // console.log(JSON.parse(this.cookieService.get('restaurant')));
    // console.log(JSON.parse(this.cookieService.get('currentLocation')));
    // let orderProduct: any = [];
    // this.cartProductList.map(cartProduct => {
    //   orderProduct.push({
    //     variantId: cartProduct.product.variant_id,
    //     productId: cartProduct.product.product_id,
    //     productPrice: cartProduct.product.product_price,
    //     quantity: cartProduct.product.count,
    //     message: "",
    //     extras: this.generateExtras(cartProduct.requiredExtra, cartProduct.optionalExtra),
    //   })
    // })

    const body = {
      // "deliveryAddressId": this.selectedDeliveryAddress.id,
      // "restaurantId": JSON.parse(this.cookieService.get('restaurant')).restaurant_id,
      // "take": this.take ? 1 : 0,
      // "cutlery": this.cutlery ? 0 : 1,
      // "products": orderProduct,
      // "messageCourier": "",
      // "locationId": JSON.parse(this.cookieService.get('currentLocation')).id
    }

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

  orderProductListEmitter(event: OrderProductList[]): void {
    this.orderProductList = event;
  }
}
