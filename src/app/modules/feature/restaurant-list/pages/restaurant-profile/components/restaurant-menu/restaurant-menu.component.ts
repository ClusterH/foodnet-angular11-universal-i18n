import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { isEmpty } from 'lodash';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, ProductList, SubCategory } from '../../models';
import { RestaurantMenuService } from '../../services';
import { CartCountService } from 'src/app/modules/shared/services';

@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})

export class RestaurantMenuComponent implements OnInit, OnDestroy {
  @Input() restaurantId: number;
  categoryList: Category[];
  subCategoryList: SubCategory[];
  translatePosition: number = 0;
  selectedCategory = new Category;
  selectedSubCategory = new SubCategory;
  searchedProduct: string = '';
  productList$: Observable<ProductList[]>;
  productList: ProductList[];
  cartProductList: any;
  imgPath: string = 'https://admin.foodnet.ro/';
  counts: number = 1;
  requiredExtraList$: Observable<[]>;
  requiredExtraData: any;
  minRequired$: Observable<number>;
  optionalExtraList$: Observable<[]>;
  optionalExtraData: any;
  isExtra: boolean = true;
  selectedProduct: ProductList;
  isShownExtra: boolean = false;
  productImg: string;
  isEnableAddCart: boolean = false;
  isSpinner: boolean = true;
  private _unsubscribeAll: Subject<any>;

  @Output() addCartEventEmitter = new EventEmitter<any>();

  constructor(
    public cookieService: CookieService,
    private restaurantMenuService: RestaurantMenuService,
    private cartCountService: CartCountService
  ) {
    this._unsubscribeAll = new Subject();
    this.productImg = "./assets/images/banner.svg";
  }

  ngOnInit(): void {
    const body = { "restaurantId": this.restaurantId, "lang": this.cookieService.get('change_lang') };
    this.restaurantMenuService.getRestaurantCategory(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.categoryList = [...res.result];
      if (isEmpty(this.categoryList)) {
        this.isSpinner = false;
        return;
      }

      this.categoryList.map(item => { item.name = item.category_name; return item; });
      this.selectedCategory = this.categoryList[0];
      this.getSubCategory(this.categoryList[0].category_id);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectedItem(event): void {
    this.isSpinner = true;
    if (event.type === 'category') {
      this.selectedCategory = { ...event.param }
      this.getSubCategory(this.selectedCategory.category_id);
      this.translatePosition = 0;
    } else if (event.type === 'subcategory') {
      this.selectedSubCategory = { ...event.param };
      this.getProducts(this.selectedSubCategory);
    }
  }

  getSubCategory(categoryId: number): void {
    const body = {
      lang: this.cookieService.get('change_lang'),
      restaurantId: this.restaurantId,
      categoryId: categoryId
    }

    this.restaurantMenuService.getRestaurantSubCategory(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.subCategoryList = [...res.result];
      if (isEmpty(this.subCategoryList)) {
        this.isSpinner = false;
        return;
      }

      this.subCategoryList.map(item => { item.name = item.subcategories_name; return item; });
      this.selectedSubCategory = this.subCategoryList[0];
      this.getProducts(this.subCategoryList[0]);
    });
  }

  getProducts(subCategory: any) {
    const body = {
      restaurantId: this.restaurantId,
      lang: this.cookieService.get('change_lang'),
      categoryId: subCategory.categoryId,
      subcategoryId: subCategory.subcategoryId,
      propertyValTransId: subCategory.propertyValTransId,
      searchedProduct: this.searchedProduct,
    };

    this.restaurantMenuService.getRestaurantProducts(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.isSpinner = false;
      if (isEmpty(res.result)) {
        this.productList = [];
        this.productList$ = of(this.productList);
        return;
      } else {
        this.productList = [...res.result];
        this.productList.map(item => {
          return this.checkProductIsCart(item);
        });

        this.productList$ = of(this.productList);
      }
    });
  }

  checkProductIsCart(product): any {
    this.cartProductList = this.cookieService.get('cartProducts') ? JSON.parse(this.cookieService.get('cartProducts')).cartList : [];
    if (this.cartProductList.length > 0) {
      const index = this.cartProductList.findIndex(item => item.product.product_id === product.product_id);
      if (index > -1) {
        product.isCart = true;
        product.count = this.cartProductList[index].product.count;
      } else {
        product.isCart = false;
        product.count = 1;
      }
    } else {
      product.isCart = false;
      product.count = 1;
    }
    return product;
  }

  counterChange(event, id?): void {
    this.counts = event.counts;
    this.productList.map(item => {
      if (item.product_id == id) {
        item.count = this.counts;
      }
      return item;
    });
    this.productList$ = of(this.productList);
  }

  deleteFromCart(product, type: string): void {
    if (type === 'all') {
      this.productList.map(item => {
        item.count = 1;
        item.isCart = false;
      })
      this.cartProductList = [];
    } else if (type === 'current') {

      const index = this.productList.findIndex(item => item.product_id === product.product.product_id);
      if (index > -1) {
        this.productList[index].count = 1;
        this.productList[index].isCart = false;
      }

      this.cartProductList = this.cookieService.get('cartProducts') ? JSON.parse(this.cookieService.get('cartProducts')).cartList : [];
    }

    this.productList$ = of(this.productList);
  }

  onKeyUpSearch(): void {
    this.isSpinner = true;
    this.getProducts(this.selectedSubCategory);
  }

  showExtraPopup(productItem): void {

    this.isEnableAddCart = false;
    const body = { restaurantId: this.restaurantId, lang: this.cookieService.get('change_lang'), variantId: productItem.variant_id }
    const requiredExtra = this.restaurantMenuService.getRestaurantRequiredExtra(body);
    const optionalExtra = this.restaurantMenuService.getRestaurantOptionalExtra(body);
    forkJoin([requiredExtra, optionalExtra]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([requiredExtraData, optionalExtraData]) => {
      this.requiredExtraData = requiredExtraData;
      this.optionalExtraData = optionalExtraData;
      this.requiredExtraList$ = of(this.requiredExtraData.result.map(item => {
        item.checked = false;
        return item;
      }));
      this.optionalExtraList$ = of(this.optionalExtraData.result.map(item => {
        item.checked = false;
        return item;
      }));


      this.minRequired$ = of(requiredExtraData.minRequired);
      if (requiredExtraData.result.length == 0) {
        this.isEnableAddCart = true;
      }
      this.selectedProduct = productItem;
      if (requiredExtraData.result.length == 0 && optionalExtraData.result.length == 0) {
        this.isExtra = false;
      } else {
        this.isExtra = true;
      }
      this.isShownExtra = true;
    });
  }

  closeExtra(): void {
    this.productList.map(item => {
      if (item.product_id == this.selectedProduct.product_id) {
        item.isCart = true;
        this.selectedProduct.isCart = true;
      }
      return item;
    });

    this.productList$ = of(this.productList);

    let cartProduct: CartProduct = {
      product: this.selectedProduct,
      requiredExtra: this.requiredExtraData.result.filter(item => item.checked === true) || [],
      optionalExtra: this.optionalExtraData.result.filter(item => item.checked === true) || [],
    }

    const totalPrice = this.countProductTotalPrice(cartProduct);
    cartProduct.totalPrice = totalPrice;
    this.cartProductList.push(cartProduct);

    const cartTotalPrice = this.countCartTotalPrice(this.cartProductList);
    this.cookieService.put('cartProducts', JSON.stringify({ cartList: this.cartProductList, totalPrice: cartTotalPrice }));
    this.addCartEventEmitter.emit({ cartList: this.cartProductList, totalPrice: cartTotalPrice });
    this.cartCountService.getCartNumber();
    this.isShownExtra = false;
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

    return Number(total.toFixed(2));
  }

  countCartTotalPrice(cartList: Array<any>): number {
    let totalPrice = 0;
    cartList.map(item => {
      totalPrice = totalPrice + item.totalPrice;
    });

    return totalPrice;
  }

  openExtraPopUp(event, product) {
    if (event) {

      this.showExtraPopup(product);
    }
  }

  requiredExtraCounterChange(event, id): void {
    this.requiredExtraData.result.map(item => {
      if (item.extra_id === id) {
        item.count = event.counts;
      }
      return item;
    });
  }

  optionalExtraCounterChange(event, id): void {
    this.optionalExtraData.result.map(item => {
      if (item.extra_id === id) {
        item.count = event.counts;
      }
      return item;
    });
  }

  onRequiredExtraChange(event, id) {

    this.requiredExtraData.result.map(item => {
      if (item.extra_id === id) {
        item.checked = event.target.checked;
      }
      return item;
    });

    this.isEnableAddCart = true;

    this.requiredExtraList$ = of(this.requiredExtraData.result);
  }

  onOptionalExtraChange(event, id) {

    this.optionalExtraData.result.map(item => {
      if (item.extra_id === id) {
        item.checked = event.target.checked;
      }
      return item;
    });

    this.optionalExtraList$ = of(this.optionalExtraData.result);
  }
}

export interface CartProduct {
  product?: ProductList,
  requiredExtra?: Array<any>,
  optionalExtra?: Array<any>,
  totalPrice?: number
}
