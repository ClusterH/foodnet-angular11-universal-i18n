import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-edit',
  templateUrl: './delivery-edit.component.html',
  styleUrls: ['./delivery-edit.component.scss']
})
export class DeliveryEditComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  addressForm: FormGroup;
  cities: any[];
  selectedCity: string;
  id: number;
  title: string;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.cities = [
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
    this.activatedroute.queryParams.subscribe(params => {
      if(params.id){
        this.title = "Update delivery address";
        console.log(params); // { id: 2 }

        this.id = params.id;
        console.log(this.id); // popular
      }
      else{
        this.title = "Create delivery address";
      }
    });
    this.initForm();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      floor: [''],
      door: ['']
    });
  }

  isValidInput(fieldName): boolean {
    return this.addressForm.controls[fieldName].invalid &&
      (this.addressForm.controls[fieldName].dirty || this.addressForm.controls[fieldName].touched);
  }

  update(): void {

  }


}
