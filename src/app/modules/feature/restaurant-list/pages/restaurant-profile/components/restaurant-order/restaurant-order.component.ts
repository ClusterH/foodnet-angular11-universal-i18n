import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, ViewChild } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { RestaurantList } from '../../../../models';
import * as moment from 'moment';
import { RestaurantMenuComponent } from '../../components/restaurant-menu/restaurant-menu.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-order',
  templateUrl: './restaurant-order.component.html',
  styleUrls: ['./restaurant-order.component.scss']
})
export class RestaurantOrderComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurant: RestaurantList;
  counts: number;
  cartProductList: Array<any>;
  cartProductList$: Observable<Array<any>>;
  totalPrice$: Observable<number>;
  totalPrice: number = 0;
  deliveryAddressList: Array<any>;
  deliveryAddressList$: Observable<Array<any>>;
  isSpinner: boolean = true;

  @ViewChild(RestaurantMenuComponent) menuComponent: RestaurantMenuComponent;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private deliveryAddressService: DeliveryAddressService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
  }

  ngOnInit(): void {
    if (this.cookieService.get('cartProducts')) {
      console.log(JSON.parse(this.cookieService.get('cartProducts')));
      this.cartProductList = JSON.parse(this.cookieService.get('cartProducts')).cartList;
      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice = JSON.parse(this.cookieService.get('cartProducts')).totalPrice;
      this.totalPrice$ = of(this.totalPrice);
    }

    const lang = this.cookieService.get('change_lang') || 'ro';
    this.deliveryAddressService.getDeliveryAddress(lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      if (res.status == 400) {
        this.deliveryAddressList = [];
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
      } else {
        this.deliveryAddressList = res.result;
        this.deliveryAddressList$ = of(this.deliveryAddressList);
        this.isSpinner = false;
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

  counterChange(event, product?): void {
    console.log(event, product, this.cartProductList);
    this.counts = event.counts;
    this.cartProductList.map(item => {
      if (item.product.product_id == product.product.product_id) {
        console.log('ddd');
        item.product.count = this.counts;
        item.totalPrice = this.countProductTotalPrice(item);
      }

      return item;
    })

    this.cartProductList$ = of(this.cartProductList);
    this.totalPrice = this.countCartTotalPrice(this.cartProductList);
    this.totalPrice$ = of(this.totalPrice);

    this.cookieService.put('cartProducts', JSON.stringify({ cartList: this.cartProductList, totalPrice: this.totalPrice }));
    this.menuComponent.counterChange({ counts: this.counts }, product.product.product_id);
  }

  countProductTotalPrice(product): number {
    console.log(product);
    let requiredExtraTotal: number = 0;
    product.requiredExtra.map(item => {
      requiredExtraTotal = requiredExtraTotal + item.count * item.extra_price;
    });
    let optionalExtraTotal: number = 0;
    product.optionalExtra.map(item => {
      optionalExtraTotal = optionalExtraTotal + item.count * item.extra_price;
    });
    const total = product.product.count * product.product.product_price + product.product.count * product.product.box_price + (requiredExtraTotal + optionalExtraTotal);

    return total;
  }

  countCartTotalPrice(cartList: Array<any>): number {
    let totalPrice = 0;
    cartList.map(item => {
      totalPrice = totalPrice + item.totalPrice;
    });

    return totalPrice;
  }

  orderSuccess(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}/success`]);
  }


}
