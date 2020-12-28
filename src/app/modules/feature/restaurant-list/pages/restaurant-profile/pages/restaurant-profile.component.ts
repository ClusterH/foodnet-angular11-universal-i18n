import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Input } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from 'src/app/modules/core';
import { RestaurantMenuService } from './../services';
import { RestaurantList, FilterOption } from '../../../models';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

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
  isSpinner: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
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
  }

  ngOnInit(): void {
    if (this.cookieService.get('filter_option')) {
      const filterOption = JSON.parse(this.cookieService.get('filter_option'));
      for (let option in filterOption) {
        if (filterOption[option] == 1) {
          this.filterOption.push(this.filters.filter(item => item.value === option)[0].name);
        }
      }
    }
  }

  ngOnDestroy(): void {
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

  counterChange(event): void {
    this.counts = event.counts;
  }
}
