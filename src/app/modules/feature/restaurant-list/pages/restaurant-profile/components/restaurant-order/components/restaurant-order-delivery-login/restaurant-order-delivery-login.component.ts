import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-restaurant-order-delivery-login',
  templateUrl: './restaurant-order-delivery-login.component.html',
  styleUrls: ['./restaurant-order-delivery-login.component.scss']
})
export class RestaurantOrderDeliveryLoginComponent implements OnInit {
  deliveryAddressList$: Observable<Array<any>>;
  selectedDeliveryAddress: any;

  @Input() deliveryAddressList: Array<any>;
  @Output() loginDeliveryAddressEmitter = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  selectDeliveryAddress(address): void {
    console.log(address);
    this.selectedDeliveryAddress = address;
  }
}
