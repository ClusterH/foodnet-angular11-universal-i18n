import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { CookieService } from '@gorniv/ngx-universal';
import { CartCountService } from 'src/app/modules/shared/services';
import { OrderProductList, ExtraList } from '../../../../models';
import { isEmpty } from 'lodash';
import { RestaurantMenuComponent } from '../../../restaurant-menu/restaurant-menu.component';

@Component({
  selector: 'app-restaurant-order-list',
  templateUrl: './restaurant-order-list.component.html',
  styleUrls: ['./restaurant-order-list.component.scss']
})

export class RestaurantOrderListComponent implements OnInit {
  counts: number;
  cartProductList: Array<any>;
  cartProductList$: Observable<Array<any>>;
  totalPrice$: Observable<number>;
  totalPrice: number = 0;
  isDeleteAllDialog: boolean = false;

  @Output() orderProductListEmitter = new EventEmitter<OrderProductList[]>();
  @ViewChild(RestaurantMenuComponent) menuComponent: RestaurantMenuComponent;

  constructor(
    private router: Router,
    public cookieService: CookieService,
    private cartCountService: CartCountService,
  ) { }

  ngOnInit(): void {
    if (this.cookieService.get('cartProducts')) {
      this.cartProductList = JSON.parse(this.cookieService.get('cartProducts')).cartList;
      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice = JSON.parse(this.cookieService.get('cartProducts')).totalPrice;
      const minOrder = Number(this.cookieService.get('restaurant_minOrder'));
      if (this.totalPrice < minOrder) {
        this.goToRestaurant();
      }

      this.totalPrice$ = of(this.totalPrice);
      this.orderProductListEmitter.emit(this.generateOrderProductList());
    } else {
      this.goToRestaurant();
    }
  }

  goToRestaurant(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    const restaurant_name = this.cookieService.get('restaurant') ? JSON.parse(this.cookieService.get('restaurant')).restaurant_name : null;

    this.router.navigate([`${location.replace(/\s/g, '-')}/${restaurant_name.replace(/\s/g, '-')}`]);
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
    this.cartCountService.getCartNumber();
    this.orderProductListEmitter.emit(this.generateOrderProductList());
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

    const minOrder = Number(this.cookieService.get('restaurant_minOrder'));
    if (totalPrice < minOrder) {
      this.goToRestaurant();
    }

    return totalPrice;
  }

  generateOrderProductList(): OrderProductList[] {
    let orderProduct: OrderProductList[] = [];
    this.cartProductList.map(cartProduct => {
      orderProduct.push({
        variantId: cartProduct.product.variant_id,
        productId: cartProduct.product.product_id,
        productPrice: cartProduct.product.product_price,
        quantity: cartProduct.product.count,
        message: cartProduct.comment,
        extras: this.generateExtras(cartProduct.requiredExtra, cartProduct.optionalExtra),
      })
    })

    return orderProduct;
  }

  generateExtras(requiredExtra: Array<any>, optionalExtra: Array<any>): ExtraList[] {
    let extras: ExtraList[] = [];
    if (requiredExtra != []) {
      requiredExtra.map(extra => {
        extras.push({
          id: extra.extra_id,
          quantity: extra.count,
          extraPrice: extra.extra_price,
          type: "req"
        })
      })
    }

    if (optionalExtra != []) {
      optionalExtra.map(extra => {
        extras.push({
          id: extra.extra_id,
          quantity: extra.count,
          extraPrice: extra.extra_price,
          type: "opt"
        })
      })
    }

    return extras;
  }

  deleteProductFromCart(product, type?: string): void {
    if (this.cartProductList.length === 1 || type == 'all') {
      this.isDeleteAllDialog = true;
    } else {
      const index = this.cartProductList.indexOf(product);
      if (index > -1) {
        this.totalPrice = this.totalPrice - product.totalPrice;
        this.cartProductList.splice(index, 1);
      }

      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice$ = of(this.totalPrice);
      this.cookieService.put('cartProducts', JSON.stringify({ cartList: this.cartProductList, totalPrice: this.totalPrice }));
      this.cartCountService.getCartNumber();
    }
  }

  closeMsg(isDelete: boolean): void {
    if (isDelete) {
      this.cartProductList = null;
      this.cartProductList$ = of(this.cartProductList);
      this.cookieService.remove('cartProducts');
      this.cartCountService.getCartNumber();
      this.isDeleteAllDialog = false;
      this.goToRestaurant()
    } else {
      this.isDeleteAllDialog = false;
    }
  }
}
