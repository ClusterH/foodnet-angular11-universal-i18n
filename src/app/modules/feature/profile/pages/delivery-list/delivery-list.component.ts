import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryAddressService } from '../../services';

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
  isSpinner: boolean = true;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private deliveryAddressService: DeliveryAddressService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.deliveryAddressService.getDeliveryAddress().pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.deliveryList = res.result;
        this.isSpinner = false;
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

  deleteDeliveryList(id: number) {
    this.isSpinner = true;
    this.deliveryAddressService.deleteDeliveryAddress(id).pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        console.log(res);
        this.deliveryList = this.deliveryList.filter(list => list.id !== res.result.id);
        this.isSpinner = false;
      }, (errorResponse) => {
        console.log(errorResponse);
        this.isSpinner = false;
      });
  }
}
