import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Payment } from '../../../../models';

@Component({
  selector: 'app-restaurant-order-payment',
  templateUrl: './restaurant-order-payment.component.html',
  styleUrls: ['./restaurant-order-payment.component.scss']
})
export class RestaurantOrderPaymentComponent implements OnInit {
  take: boolean = false;
  cutlery: boolean = false;
  comment: string = '';

  @Output() paymentEventEmitter = new EventEmitter<Payment>()

  constructor() { }

  ngOnInit(): void {
  }

  onChangeInputs(): void {
    const paymentOptions = {
      take: this.take ? 1 : 0,
      cutlery: this.cutlery ? 0 : 1,
      messageCourier: this.comment
    }



    this.paymentEventEmitter.emit(paymentOptions);
  }
}
