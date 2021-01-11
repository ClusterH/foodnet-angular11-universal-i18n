import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DeliveryAddress } from '../../../../models';

@Component({
  selector: 'app-restaurant-order-delivery-login',
  templateUrl: './restaurant-order-delivery-login.component.html',
  styleUrls: ['./restaurant-order-delivery-login.component.scss']
})
export class RestaurantOrderDeliveryLoginComponent implements OnInit {
  deliveryAddressList$: Observable<Array<any>>;
  selectedDeliveryAddress: any;

  @Input() deliveryAddressList: Array<any>;
  @Output() loginDeliveryAddressIdEmitter = new EventEmitter<DeliveryAddress>();

  constructor() { }

  ngOnInit(): void {
    this.deliveryAddressList$ = of(this.deliveryAddressList);
    this.selectDeliveryAddress(this.deliveryAddressList[0]);
  }

  selectDeliveryAddress(address): void {
    this.selectedDeliveryAddress = address;
    this.loginDeliveryAddressIdEmitter.emit(address.id);
  }
}
