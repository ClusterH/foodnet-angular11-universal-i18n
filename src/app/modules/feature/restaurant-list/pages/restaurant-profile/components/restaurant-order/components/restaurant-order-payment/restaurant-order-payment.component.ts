import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-order-payment',
  templateUrl: './restaurant-order-payment.component.html',
  styleUrls: ['./restaurant-order-payment.component.scss']
})
export class RestaurantOrderPaymentComponent implements OnInit {
  take: boolean = false;
  cutlery: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
