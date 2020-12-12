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
  usefulList: string[];
  foodList: string[];
  payoptionList: string[];

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
    this.usefulActive = "";
    this.foodActive = "";
    this.payoptionActive = "";
    this.usefulList = [
      "No shipping costs",
      "News",
      "Within 1 hour"
    ];
    this.foodList = [
      "Hamburger",
      "Pizza",
      "Hungarian",
      "Japan",
      "Italian"
    ];
    this.payoptionList = [
      "Cash",
      "Credit card"
    ];
  }

  ngOnInit(): void {
  }

  usefulFilter(item): void {
    this.usefulActive = item;
  }

  foodFilter(item): void {
    this.foodActive = item;
  }
  
  payFilter(item): void {
    this.payoptionActive = item;
  }
}
