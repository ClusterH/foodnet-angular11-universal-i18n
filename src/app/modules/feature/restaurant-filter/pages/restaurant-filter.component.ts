import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RestaurantList } from '../models/restaurant.model';

@Component({
  selector: 'app-restaurant-filter',
  templateUrl: './restaurant-filter.component.html',
  styleUrls: ['./restaurant-filter.component.scss'],
})

export class RestaurantFilterComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurantList: RestaurantList[];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurantList = [
      {
        restaurant_Id: 1,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_1.svg",
        restaurant_rating: 4,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 10,
        restaurant_active: true
      },
      {
        restaurant_Id: 2,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_2.svg",
        restaurant_rating: 3,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 10,
        restaurant_active: true
      },
      {
        restaurant_Id: 3,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_3.svg",
        restaurant_rating: 5,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 0,
        restaurant_active: false
      },
      {
        restaurant_Id: 4,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_4.svg",
        restaurant_rating: 5,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 10,
        restaurant_active: true
      },
      {
        restaurant_Id: 5,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_1.svg",
        restaurant_rating: 4,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 0,
        restaurant_active: true
      },
      {
        restaurant_Id: 6,
        restaurant_name: "Étterem neve",
        restaurant_image: "./assets/images/product_2.svg",
        restaurant_rating: 4,
        restaurant_summary: "Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye",
        restaurant_discount: 10,
        restaurant_active: true
      },
    ]
  }

  ngOnInit(): void { }

  ngOnDestroy(): void { }
}
