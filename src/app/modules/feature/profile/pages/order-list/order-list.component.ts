import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { OrderList } from '../../models';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  isSpinner: boolean = false;
  orderListAll: OrderList[];
  orderList: OrderList[];
  totalRecords: number;
  firstRecord: number;
  linkSize: number = 3;
  showLinkSize: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.orderListAll = [
      {
        order_Id: 1,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 2,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 3,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 4,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 5,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 6,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 7,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 8,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 9,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 10,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 11,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 12,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 13,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 14,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 15,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 16,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 17,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 18,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 19,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 20,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 21,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 22,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 23,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 24,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 25,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 26,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 27,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 28,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 29,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 30,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 31,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 32,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 33,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
      {
        order_Id: 34,
        order_amount: 7891,
        order_created: "2020.09.25. - 18:32",
        order_location: "Restaurant Name"
      },
    ];
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
  }

  ngOnInit(): void {
    this.orderList = this.orderListAll.slice(0, 10);
    this.firstRecord = 0;

  }

  onPageChange(event): void {
    this.firstRecord = event.first;

    this.orderList = this.orderListAll.slice(this.firstRecord, this.firstRecord + 10);
  }

  takeLook(orderId): void {
    this.router.navigate(['/profile/order-detail']);
  }

}
