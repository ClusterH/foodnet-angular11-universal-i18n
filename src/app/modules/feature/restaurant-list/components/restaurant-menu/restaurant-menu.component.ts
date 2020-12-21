import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Category, SubCategory, ProductList } from '../../models';
import { CookieService } from '@gorniv/ngx-universal';
import { RestaurantMenuService } from '../../services';

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
  productList: ProductList[];
  counts: number;
  imgPath: string = 'http://admin.foodnet.ro/';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private restaurantMenuService: RestaurantMenuService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    console.log(this.restaurantId);
    const body = { "restaurantId": this.restaurantId, "lang": this.cookieService.get('change_lang') };
    this.restaurantMenuService.getRestaurantCategory(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      this.categoryList = [...res.result];
      this.categoryList.map(item => { item.name = item.category_name; return item; });
      console.log(this.categoryList);
      this.selectedCategory = this.categoryList[0];
      this.getSubCategory(this.categoryList[0].category_id);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectedItem(event): void {
    console.log('selectedCategory====>', event.param);
    if (event.type === 'category') {
      this.selectedCategory = { ...event.param }
      this.getSubCategory(this.selectedCategory.category_id);
    } else if (event.type === 'subcategory') {
      this.selectedSubCategory = { ...event.param };
      this.getProducts(this.selectedSubCategory, '');
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
      console.log(res);
      this.subCategoryList = [...res.result];
      this.subCategoryList.map(item => { item.name = item.subcategories_name; return item; });
      this.selectedSubCategory = this.subCategoryList[0];
      this.getProducts(this.subCategoryList[0], '');
    });
  }

  getProducts(subCategory: any, searchedProduct: string = '') {
    const body = {
      restaurantId: this.restaurantId,
      lang: this.cookieService.get('change_lang'),
      categoryId: subCategory.categoryId,
      subcategoryId: subCategory.subcategoryId,
      propertyValTransId: subCategory.propertyValTransId,
      searchedProduct: searchedProduct,
    };

    this.restaurantMenuService.getRestaurantProducts(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      this.productList = [...res.result];
    })
  }
}
