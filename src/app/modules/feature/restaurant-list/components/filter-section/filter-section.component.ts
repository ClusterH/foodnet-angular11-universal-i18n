import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';

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

  filters = {
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
  };

  @Input() filterShow: boolean = true;

  @Output() selectedFilterOptions = new EventEmitter<{}>();
  @Output() showFilterOptions = new EventEmitter<{}>();

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    public cookieService: CookieService,
  ) {
    this.usefulActive = "";
    this.foodActive = "";
    this.payoptionActive = "";
    this.usefulList = [
      { name: $localize`:@@filter-component-btn-a:No shipping costs`, value: "freeDelivery" },
      { name: $localize`:@@filter-component-btn-b:News`, value: "Newest" },
      { name: $localize`:@@filter-component-btn-c:Within 1 hour`, value: "withinOneHour" }
    ];
    this.foodList = [
      { name: $localize`:@@filter-component-btn-d:Hamburger`, value: "hamburger" },
      { name: $localize`:@@filter-component-btn-e:Pizza`, value: "pizza" },
      { name: $localize`:@@filter-component-btn-f:Soup`, value: "soup" },
      { name: $localize`:@@filter-component-btn-g:Daily Menu`, value: "dailyMenu" },
      { name: $localize`:@@filter-component-btn-h:Salad`, value: "salad" }
    ];
    this.payoptionList = [
      { name: $localize`:@@filter-component-btn-i:Cash`, value: "money" },
      { name: $localize`:@@filter-component-btn-j:Card`, value: "card" }
    ];
  }

  ngOnInit(): void {
    if (this.cookieService.get('filter_option')) {
      this.filters = JSON.parse(this.cookieService.get('filter_option'));
    }
  }

  selectFilter(item): void {
    if (this.filters[item] == 1)
      this.filters[item] = 0;
    else
      this.filters[item] = 1;
    this.cookieService.put('filter_option', JSON.stringify(this.filters));

    this.selectedFilterOptions.emit(this.filters);
  }

  showFilter(): void {
    this.filterShow = !this.filterShow;
    this.showFilterOptions.emit(this.filterShow);
  }
}
