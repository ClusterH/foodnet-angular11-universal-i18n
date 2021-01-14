import { Component, OnInit } from '@angular/core';
import { OrderDetail } from '../../models';
import { OrderListService } from '../../services';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  lang: string;
  orderId: number;
  orderCreatedAt: string;
  deliveryAddress: DeliveryAddress;
  productList: OrderDetail[];
  imgPath: string = 'https://admin.foodnet.ro/';

  isSpinner: boolean = true;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private cookieService: CookieService,
    private orderListService: OrderListService
  ) {
    this._unsubscribeAll = new Subject();

    this.lang = this.cookieService.get('change_lang');
    this.orderId = Number(this.cookieService.get('orderId'));
  }

  ngOnInit(): void {
    this.orderListService.getOrderDetail(this.lang, this.orderId).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 200) {
        this.productList = [...res.result];
        this.deliveryAddress = res.deliveryAddress[0];
        this.orderCreatedAt = res.orderCreatedAt;
        this.isSpinner = false;
      } else {
        this.productList = [];
        this.isSpinner = false;
      }
    })
  }
}

export interface DeliveryAddress {
  door_number: string,
  floor: string,
  house_number: string,
  street: string,
  city: string
}
