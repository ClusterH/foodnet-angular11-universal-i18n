import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {
  usefulActive: string;
  foodActive: string;
  payoptionActive: string;
  usefulList: any[];
  foodList: any[];
  payoptionList: any[];
  filters: any;
  categoryList: any[];


  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
    this.categoryList = [
      {name: "Hamburger", value: "hamburger"},
      {name: "Pizza", value: "pizza"},
      {name: "Soup", value: "soup"},
      {name: "Daily menu", value: "dailyMenu"},
      {name: "Salad", value: "salad"},
      {name: "Hamburger", value: "hamburger"},
      {name: "Pizza", value: "pizza"},
      {name: "Soup", value: "soup"},
      {name: "Daily menu", value: "dailyMenu"},
      {name: "Salad", value: "salad"},
      {name: "Hamburger", value: "hamburger"},
      {name: "Pizza", value: "pizza"},
      {name: "Soup", value: "soup"},
      {name: "Daily menu", value: "dailyMenu"},
      {name: "Salad", value: "salad"},
      {name: "Hamburger", value: "hamburger"},
      {name: "Pizza", value: "pizza"},
      {name: "Soup", value: "soup"},
      {name: "Daily menu", value: "dailyMenu"},
      {name: "Salad", value: "salad"}
    ];
  }

  ngOnInit(): void {
  }


}
