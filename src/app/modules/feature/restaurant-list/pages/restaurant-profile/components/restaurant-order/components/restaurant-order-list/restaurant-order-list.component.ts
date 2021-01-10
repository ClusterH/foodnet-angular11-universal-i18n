import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { CookieService } from '@gorniv/ngx-universal';
import { CartCountService } from 'src/app/modules/shared/services';
import { OrderProductList, ExtraList } from '../../../../models';

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

  @Output() orderProductListEmitter = new EventEmitter<OrderProductList[]>();

  constructor(
    public cookieService: CookieService,
    private cartCountService: CartCountService,
  ) { }

  ngOnInit(): void {
    if (this.cookieService.get('cartProducts')) {
      console.log(JSON.parse(this.cookieService.get('cartProducts')));
      this.cartProductList = JSON.parse(this.cookieService.get('cartProducts')).cartList;
      this.cartProductList$ = of(this.cartProductList);
      this.totalPrice = JSON.parse(this.cookieService.get('cartProducts')).totalPrice;
      this.totalPrice$ = of(this.totalPrice);
      this.orderProductListEmitter.emit(this.generateOrderProductList());
    }
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
    this.cartCountService.getCartNumber();
    this.orderProductListEmitter.emit(this.generateOrderProductList());
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

    return Number(total.toFixed(2));
  }

  countCartTotalPrice(cartList: Array<any>): number {
    let totalPrice = 0;
    cartList.map(item => {
      totalPrice = totalPrice + item.totalPrice;
    });

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
        message: "",
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
          extraPrice: extra.extra_price
        })
      })
    }

    if (optionalExtra != []) {
      optionalExtra.map(extra => {
        extras.push({
          id: extra.extra_id,
          quantity: extra.count,
          extraPrice: extra.extra_price
        })
      })
    }

    return extras;
  }
}
