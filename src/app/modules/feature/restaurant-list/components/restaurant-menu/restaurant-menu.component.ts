import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Category, SubCategory, ProductList } from '../../models';
import { CookieService } from '@gorniv/ngx-universal';
import { RestaurantMenuService } from '../../services';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})

export class RestaurantMenuComponent implements OnInit, OnDestroy {
  @Input() restaurantId: number;
  categoryList: Array<Category>;
  subCategoryList: Array<SubCategory>;
  selectedCategory = new Category;
  selectedSubCategory = new SubCategory;
  searchedProduct: string = '';
  productList: ProductList[];
  counts: number;
  imgPath: string = 'http://admin.foodnet.ro/';

  requiredExtraList: Array<any>;
  optionalExtraList: Array<any>;
  selectedProduct: number;
  isShownExtra: boolean = false;
  productImg: string;

  isSpinner: boolean = false;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private restaurantMenuService: RestaurantMenuService
  ) {
    this._unsubscribeAll = new Subject();
    this.productImg = "./assets/images/banner.svg";
    this.requiredExtraList = [
      {
        id: 1,
        extra_content: "Coca-Cola carbonated soft drink 0.33l"
      },
      {
        id: 2,
        extra_content: "Coca-Cola Zero carbonated soft drink 0.33l"
      },
      {
        id: 3,
        extra_content: "Fanta Orange carbonated soft drink 0.33l"
      },
      {
        id: 4,
        extra_content: "Sprite Lemon-Lime carbonated soft drink 0.33l"
      },

    ]
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

  points(i: number) {
    return new Array(i);
  }

  selectedItem(event): void {
    this.isSpinner = true;
    if (event.type === 'category') {
      this.selectedCategory = { ...event.param }
      this.getSubCategory(this.selectedCategory.category_id);
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
      this.productList = [...res.result];
      if (isEmpty(this.productList)) {
        return;
      }
    })
  }

  onKeyUpSearch(): void {
    this.isSpinner = true;
    this.getProducts(this.selectedSubCategory);
  }

  showExtraPopup(productItem): void {
    this.selectedProduct = productItem;
    this.isShownExtra = true;
  }

  closeExtra(): void {
    this.isShownExtra = false;
  }
}
