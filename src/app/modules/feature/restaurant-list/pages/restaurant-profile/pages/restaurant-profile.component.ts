import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Input } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from 'src/app/modules/core';
import { RestaurantMenuService } from './../services';
import { RestaurantList, FilterOption } from '../../../models';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
  filterOption: Array<string> = [];
  header_menu: string = '';
  header_info: string = '';
  header_review: string = '';
  isSpinner: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private sessionStorageService: SessionStorageService,
    private restaurantMenuService: RestaurantMenuService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
    this.header_menu = $localize`:@@restaurant-profile-tab-menu:Menu`;
    this.header_info = $localize`:@@restaurant-profile-tab-info:INFO & PROMOTIONS`;
    this.header_review = $localize`:@@restaurant-profile-tab-review:Evaluation`;
  }

  ngOnInit(): void {
    const filterOption = JSON.parse(this.cookieService.get('filter_option')).filters;
    console.log(filterOption);
    for (let option in filterOption) {
      console.log(option)
      if (filterOption[option] == 1) {
        this.filterOption.push(option);
      }
    }
  }

  ngOnDestroy(): void {

  }

  counterChange(event): void {
    this.counts = event.counts;
  }
}
