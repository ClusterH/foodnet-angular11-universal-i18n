import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantMenuComponent } from '../components/restaurant-menu/restaurant-menu.component';
import { HeaderComponent } from 'src/app/modules/shared/layout/header/header.component';
import { CookieService } from '@gorniv/ngx-universal';
import { CartCountService } from 'src/app/modules/shared/services';
import { RestaurantMenuService } from './../services';
import { RestaurantList, FilterOption } from '../../../models';
import { Subject, Observable, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss'],
})

export class RestaurantProfileComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  counts: number;
  restaurant: RestaurantList;
  restaurantId: number;
  filterOption: Array<any> = [];
  filters: any;
  header_menu: string = '';
  header_info: string = '';
  header_review: string = '';
  cartProductList: Array<any>;
  cartProductList$: Observable<Array<any>>;
  totalPrice$: Observable<number>;
  totalPrice: number = 0;
  minOrderPrice: number;
  isSpinner: boolean = false;
  isDeleteAllDialog: boolean = false;

  @ViewChild(RestaurantMenuComponent) menuComponent: RestaurantMenuComponent;
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    public cookieService: CookieService,
    private cartCountService: CartCountService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
    this.header_menu = $localize`:@@restaurant-profile-tab-menu:Menu`;
    this.header_info = $localize`:@@restaurant-profile-tab-info:INFO & PROMOTIONS`;
    this.header_review = $localize`:@@restaurant-profile-tab-review:Evaluation`;
    this.filters = [
      { name: $localize`:@@profile-component-btn-a:No shipping costs`, value: "freeDelivery" },
      { name: $localize`:@@profile-component-btn-b:News`, value: "newest" },
      { name: $localize`:@@profile-component-btn-e:Pizza`, value: "pizza" },
      { name: $localize`:@@profile-component-btn-d:Hamburger`, value: "hamburger" },
      { name: $localize`:@@profile-component-btn-g:Daily Menu`, value: "dailyMenu" },
      { name: $localize`:@@profile-component-btn-f:Soup`, value: "soup" },
      { name: $localize`:@@profile-component-btn-h:Salad`, value: "salad" },
      { name: $localize`:@@profile-component-btn-i:Cash`, value: "money" },
      { name: $localize`:@@profile-component-btn-j:Card`, value: "card" },
      { name: $localize`:@@profile-component-btn-c:Within 1 hour`, value: "withinOneHour" }
    ];
    this.minOrderPrice = Number(this.cookieService.get('restaurant_minOrder'));
    this.cartCountService.hiddenLang(true);
  }

  ngOnInit(): void {
    this.isSpinner = true;
    if (this.cookieService.get('filter_option')) {
      const filterOption = JSON.parse(this.cookieService.get('filter_option'));
      for (let option in filterOption) {
        if (filterOption[option] == 1) {
          this.filterOption.push(this.filters.filter(item => item.value === option)[0].name);
        }
      }
    }

    if (this.cookieService.get('cartProducts')) {

      this.cartProductList = JSON.parse(this.cookieService.get('cartProducts')).cartList;
      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice = JSON.parse(this.cookieService.get('cartProducts')).totalPrice;
      this.totalPrice$ = of(this.totalPrice);
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

  counterChange(event, product?): void {
    this.counts = event.counts;
    this.cartProductList.map(item => {
      if (item.product.product_id == product.product.product_id) {
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
    this.cartCountService.getCartNumber();
  }

  orderProduct(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}/order`]);
  }

  addProductToCartEventEmitter(event): void {
    this.cartProductList = event.cartList;
    this.cartProductList$ = of(this.cartProductList);
    this.totalPrice = event.totalPrice;
    this.totalPrice$ = of(this.totalPrice);
  }

  countProductTotalPrice(product): number {
    let requiredExtraTotal: number = 0;
    if (!isEmpty(product.requiredExtra)) {
      product.requiredExtra.map(item => {
        requiredExtraTotal = requiredExtraTotal + item.count * item.extra_price;
      });
    }

    let optionalExtraTotal: number = 0;
    if (!isEmpty(product.optionalExtra)) {
      product.optionalExtra.map(item => {
        optionalExtraTotal = optionalExtraTotal + item.count * item.extra_price;
      });
    }

    let boxPrice: number = 0;
    if (product.product.box_price) {

      boxPrice = product.product.count * product.product.box_price;
    }
    const total = product.product.count * product.product.product_price + boxPrice + (requiredExtraTotal + optionalExtraTotal);

    return total;
  }

  countCartTotalPrice(cartList: Array<any>): number {
    let totalPrice = 0;
    cartList.map(item => {
      totalPrice = totalPrice + item.totalPrice;
    });

    return totalPrice;
  }

  showDeleteAllDialog(): void {
    this.isDeleteAllDialog = true;
  }

  deleteProductFromCart(product, type?: string): void {
    if (this.cartProductList.length === 1 || type == 'all') {
      this.cartProductList = null;
      this.cartProductList$ = of(this.cartProductList);
      this.cookieService.remove('cartProducts');
      this.menuComponent.deleteFromCart(product, 'all');
      this.cartCountService.getCartNumber();
      return;
    } else {
      const index = this.cartProductList.indexOf(product);
      if (index > -1) {
        this.totalPrice = this.totalPrice - product.totalPrice;
        this.cartProductList.splice(index, 1);
      }

      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice$ = of(this.totalPrice);
      this.cookieService.put('cartProducts', JSON.stringify({ cartList: this.cartProductList, totalPrice: this.totalPrice }));
      this.menuComponent.deleteFromCart(product, 'current');
      this.cartCountService.getCartNumber();
    }
  }

  closeMsg(isDelete: boolean): void {
    if (isDelete) {
      this.deleteProductFromCart(null, 'all');
      this.isDeleteAllDialog = false;
    } else {
      this.isDeleteAllDialog = false;
    }
  }

  hideLoader(): void {
    this.isSpinner = false;
  }
}
