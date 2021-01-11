import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { RestaurantInfo } from '../../models';
import { CookieService } from '@gorniv/ngx-universal';
import { RestaurantInfoService } from '../../services';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss']
})
export class RestaurantInfoComponent implements OnInit {
  @Input() restaurantId: number;
  restaurantInfo: RestaurantInfo;
  timeList: Array<{}>;
  isSpinner: boolean = true;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
    private restaurantInfoService: RestaurantInfoService
  ) {
    this._unsubscribeAll = new Subject();
    this, this.isSpinner = true;
  }

  ngOnInit(): void {
    this.restaurantInfoService.getRestaurantInfo(this.cookieService.get('change_lang'), this.restaurantId).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.restaurantInfo = { ...res.result[0] };
      this.cookieService.put('restaurant_minOrder', this.restaurantInfo.minOrder.toString());
      this.isSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
