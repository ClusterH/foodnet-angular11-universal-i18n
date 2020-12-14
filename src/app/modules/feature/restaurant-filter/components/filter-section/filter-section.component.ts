import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent implements OnInit {
  usefulActive: string;
  foodActive: string;
  payoptionActive: string;
  usefulList: any[];
  foodList: any[];
  payoptionList: any[];
  filters: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
    this.usefulActive = "";
    this.foodActive = "";
    this.payoptionActive = "";
    this.usefulList = [
      { name: "No shipping costs", value: "freeDelivery" },
      { name: "News", value: "Newest" },
      { name: "Within 1 hour", value: "withinOneHour" }
    ];
    this.foodList = [
      {name: "Hamburger", value: "hamburger"},
      {name: "Pizza", value: "pizza"},
      {name: "Soup", value: "soup"},
      {name: "Daily menu", value: "dailyMenu"},
      {name: "Salad", value: "salad"}
    ];
    this.payoptionList = [
      {name: "Cash", value: "money"},
      {name: "Card", value: "card"}
    ];
    this.filters = {
      "freeDelivery": 0,
      "newest": 0,
      "pizza": 0,
      "hamburger": 0,
      "dailyMenu": 0,
      "soup": 0,
      "salad": 0,
      "money": 0,
      "card": 0,
      "withinOneHour": 0
    }
  }

  ngOnInit(): void {
  }

  selectFilter(item): void {
    if(this.filters[item] == 1)
      this.filters[item] = 0;
    else
      this.filters[item] = 1;
  }

}
