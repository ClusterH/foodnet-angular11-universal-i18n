import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss']
})
export class RestaurantInfoComponent implements OnInit {
  timeList: Array<{}>;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
    this.timeList = [
      { week: 'monday', time: '10:30 - 21:00' },
      { week: 'tuesday', time: '10:30 - 21:00' },
      { week: 'wednesday', time: '10:30 - 21:00' },
      { week: 'thursday', time: '10:30 - 21:00' },
      { week: 'friday', time: '10:30 - 21:00' },
      { week: 'saturday', time: '10:30 - 21:00' },
      { week: 'sunday', time: '10:30 - 21:00' },
    ]
  }

  ngOnInit(): void {
  }


}
