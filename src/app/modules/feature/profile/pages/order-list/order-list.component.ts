import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OrderList } from '../../models';
import { OrderListService } from '../../services';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  isSpinner: boolean = true;
  orderListAll: OrderList[];
  orderList: OrderList[];
  totalRecords: number;
  firstRecord: number;
  linkSize: number = 3;
  showLinkSize: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private orderListService: OrderListService,
    public cookieService: CookieService,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.orderListService.getOrderList().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 200) {
        this.orderListAll = [...res.result];
        this.totalRecords = this.orderListAll.length;
        if (this.totalRecords > 10) {
          this.showLinkSize = true;
        }
        if (this.totalRecords > 20) {
          this.linkSize = 3;
        }
        else if (this.totalRecords > 10 && this.totalRecords <= 20) {
          this.linkSize = 2;
        }
        this.orderList = this.orderListAll.slice(0, 10);
        this.firstRecord = 0;
        this.isSpinner = false;
      } else {
        this.isSpinner = false;
      }
    })
  }

  onPageChange(event): void {
    this.firstRecord = event.first;
    this.orderList = this.orderListAll.slice(this.firstRecord, this.firstRecord + 10);
  }

  takeLook(orderId): void {
    this.cookieService.put('orderId', orderId);
    this.router.navigate(['/profile/order-detail']);
  }
}
