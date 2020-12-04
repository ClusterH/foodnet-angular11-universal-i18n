import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  deliveryList: any;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute
  ) { 
    this._unsubscribeAll = new Subject();
    this.deliveryList = [
      {
        title: "2464 Royal Ln. Mesa, New Jersey 45463",
        id: "1"
      },
      {
        title: "2464 Royal Ln. Mesa, New Jersey 45463",
        id: "2"
      },
      {
        title: "2464 Royal Ln. Mesa, New Jersey 45463",
        id: "3"
      },
      {
        title: "2464 Royal Ln. Mesa, New Jersey 45463",
        id: "4"
      },
    ]
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  loadComponent(component, id = null): void {
    if(id != null){
      this.router.navigate(['/profile/' + component], { queryParams: { id: id } });
    }
    else{
      this.router.navigate(['/profile/' + component]);
    }
    // this.profileType = component;
  }


}
