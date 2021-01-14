import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from '@gorniv/ngx-universal';

@Injectable()
export class CartCountService {
  cartCount = new BehaviorSubject<number>(null);
  cartCount$ = this.cartCount.asObservable();
  isHiddenLang = new BehaviorSubject<boolean>(false);
  isHiddenLang$ = this.isHiddenLang.asObservable();

  constructor(private cookieService: CookieService) { }

  getCartNumber(): void {
    const cartProductList = this.cookieService.get('cartProducts') ? JSON.parse(this.cookieService.get('cartProducts')).cartList : [];

    let count: number = 0;
    if (cartProductList != []) {
      cartProductList.map(product => {
        count = count + product.product.count;
      })
    }

    this.cartCount.next(count);
  }

  hiddenLang(ishidden: boolean): void {
    this.isHiddenLang.next(ishidden);
  }
}
