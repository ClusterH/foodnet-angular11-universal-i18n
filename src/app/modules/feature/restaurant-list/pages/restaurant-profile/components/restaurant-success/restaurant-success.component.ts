import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantList } from '../../../../models';
import * as moment from 'moment';
import { AuthService } from 'src/app/modules/feature/auth/services';

@Component({
  selector: 'app-restaurant-success',
  templateUrl: './restaurant-success.component.html',
  styleUrls: ['./restaurant-success.component.scss']
})
export class RestaurantSuccessComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  restaurant: RestaurantList;
  isAuth: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.restaurant = JSON.parse(this.cookieService.get('restaurant'));
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthenticated();
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

  goToOrderDetail(): void {
    this.router.navigate(['/profile/order-detail']);
  }

  goToRestaurant(): void {
    const location = JSON.parse(this.cookieService.get('currentLocation')).location;
    const restaurant_name = this.cookieService.get('restaurant') ? JSON.parse(this.cookieService.get('restaurant')).restaurant_name : null;

    this.router.navigate([`${location.replace(/\s/g, '-')}/${restaurant_name.replace(/\s/g, '-')}`]);
  }

}
