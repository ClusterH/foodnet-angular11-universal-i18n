import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RestaurantList } from '../../../../models';
import * as moment from 'moment';

@Component({
  selector: 'app-restaurant-order',
  templateUrl: './restaurant-order.component.html',
  styleUrls: ['./restaurant-order.component.scss']
})
export class RestaurantOrderComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurant: RestaurantList;
  counts: number;

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

  counterChange(event): void {
    this.counts = event.counts;
  }

  orderSuccess(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    this.router.navigate([`${location.replace(/\s/g, '-')}/${this.restaurant.restaurant_name.replace(/\s/g, '-')}/success`]);
  }


}
