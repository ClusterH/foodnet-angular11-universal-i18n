import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RestaurantList } from '../models/restaurant.model';
import { RestaurantFilterService } from '../services';

@Component({
  selector: 'app-restaurant-filter',
  templateUrl: './restaurant-filter.component.html',
  styleUrls: ['./restaurant-filter.component.scss'],
})

export class RestaurantFilterComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  isSpinner: boolean = false;
  filterShow: boolean = false;

  lang: string;
  location: string;
  restaurantList: RestaurantList[];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private restaurantFilterService: RestaurantFilterService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.lang = this.cookieService.get('change_lang');
    this.isSpinner = true;
  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(params => {
      this.location = params.location.toString();
      this.restaurantFilterService.getRestaurantsByLocation(this.lang, this.location).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
        this.restaurantList = [...res.result];
        this.isSpinner = false;
      },
        (errorResponse) => {
          this.isSpinner = false;
        });
    });
  }

  ngOnDestroy(): void { }

  getRestaurantsByLocation(): void {

  }

  filterShown(): void {
    this.filterShow = !this.filterShow;
  }
}
