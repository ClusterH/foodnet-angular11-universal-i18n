import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { isEmpty } from 'lodash';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, ProductList, SubCategory } from '../../models';
import { RestaurantMenuService } from '../../services';

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
  counts: number;
  imgPath: string = 'https://admin.foodnet.ro/';

  requiredExtraList$: Observable<[]>;
  minRequired$: Observable<number>;
  optionalExtraList$: Observable<[]>;
  isExtra: boolean = true;
  selectedProduct: ProductList;
  isShownExtra: boolean = false;
  productImg: string;

  isSpinner: boolean = true;
  private _unsubscribeAll: Subject<any>;

  constructor(
    public cookieService: CookieService,
    private restaurantMenuService: RestaurantMenuService
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

  counterChange(event): void {
    this.counts = event.counts;
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
      this.productList$ = of(res.result);
      if (isEmpty(this.productList$)) {
        return;
      }
    });
  }

  onKeyUpSearch(): void {
    this.isSpinner = true;
    this.getProducts(this.selectedSubCategory);
  }

  showExtraPopup(productItem): void {
    const body = { restaurantId: this.restaurantId, lang: this.cookieService.get('change_lang'), variantId: productItem.variant_id }
    const requiredExtra = this.restaurantMenuService.getRestaurantRequiredExtra(body);
    const optionalExtra = this.restaurantMenuService.getRestaurantOptionalExtra(body);
    forkJoin([requiredExtra, optionalExtra]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([requiredExtraData, optionalExtraData]) => {
      this.requiredExtraList$ = of(requiredExtraData.result);
      this.optionalExtraList$ = of(optionalExtraData.result);
      console.log(requiredExtraData.minRequired);
      this.minRequired$ = of(requiredExtraData.minRequired);
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
    this.isShownExtra = false;
  }
}
