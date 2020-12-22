import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Input } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { SessionStorageService } from 'src/app/modules/core';
import { RestaurantMenuService } from '../../../services';
import { RestaurantList } from '../../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private sessionStorageService: SessionStorageService,
    private restaurantMenuService: RestaurantMenuService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void { }

  counterChange(event): void {
    this.counts = event.counts;
  }
}
