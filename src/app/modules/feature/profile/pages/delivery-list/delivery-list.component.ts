import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryAddressService } from '../../services';
import { CookieService } from '@gorniv/ngx-universal';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  deliveryList: any;
  currentListId: number;
  isShown: boolean;
  isSpinner: boolean = true;
  lang: string;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private deliveryAddressService: DeliveryAddressService,
    public cookieService: CookieService,
  ) {
    this._unsubscribeAll = new Subject();
    this.isShown = false;
  }

  ngOnInit(): void {
    this.lang = this.cookieService.get('change_lang') || 'ro';
    this.deliveryAddressService.getDeliveryAddress(this.lang).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        if (res.status == 200) {
          this.deliveryList = res.result;
          this.isSpinner = false;
        } else {
          this.deliveryList = res.result;
          this.isSpinner = false;
          this.router.navigate['/profile/update'];
        }
      }, (errorResponse) => {
        this.isSpinner = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadComponent(component, id = null): void {
    if (id != null) {
      this.router.navigate(['/profile/' + component], { queryParams: { id: id } });
    }
    else {
      this.router.navigate(['/profile/' + component]);
    }
  }

  closeMsg(isDelete: boolean): void {
    if (isDelete) {
      this.isSpinner = true;
      this.deliveryAddressService.deleteDeliveryAddress(this.currentListId).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(res => {

          this.deliveryList = this.deliveryList.filter(list => list.id !== res.result.id);
          this.isShown = false;
          this.isSpinner = false;
        }, (errorResponse) => {

          this.isShown = false;
          this.isSpinner = false;
        });
    } else {
      this.isShown = false;
    }
  }

  deleteDeliveryList(id: number) {
    this.isShown = true;
    this.currentListId = id;
  }
}
