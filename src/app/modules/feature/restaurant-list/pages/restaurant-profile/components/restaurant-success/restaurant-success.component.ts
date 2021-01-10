import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantList } from '../../../../models';
import * as moment from 'moment';

@Component({
  selector: 'app-restaurant-success',
  templateUrl: './restaurant-success.component.html',
  styleUrls: ['./restaurant-success.component.scss']
})
export class RestaurantSuccessComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurant: RestaurantList;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
  }

  ngOnInit(): void {
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

  goToHome(): void {
    this.router.navigate(['/']);
  }

}
