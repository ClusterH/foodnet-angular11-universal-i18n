import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { DeliveryAddress } from '../../../../models';

@Component({
  selector: 'app-restaurant-order-no-delivery-list',
  templateUrl: './restaurant-order-no-delivery-list.component.html',
  styleUrls: ['./restaurant-order-no-delivery-list.component.scss']
})

export class RestaurantOrderNoDeliveryListComponent implements OnInit {
  addressFormLoggedIn: FormGroup;

  locationList: any[];
  selectedCity: any;
  lang: string;
  private _unsubscribeAll: Subject<any>;
  @Output() noDeliveryAddressEmitter = new EventEmitter<DeliveryAddress>();

  constructor(
    private fb: FormBuilder,
    public cookieService: CookieService,
    private deliveryAddressService: DeliveryAddressService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.lang = this.cookieService.get('change_lang') || 'ro';
    this.getLocations();
    this.initForm();
  }

  initForm(): void {
    this.addressFormLoggedIn = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      houseNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      floor: [''],
      doorNumber: ['']
    });
  }

  getLocations(): void {
    this.deliveryAddressService.getLocations(this.lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.locationList = [...res.locations];
      this.selectedCity = res.locations[0];
    });
  }

  isValidInput(fieldName): boolean {
    return this.addressFormLoggedIn.controls[fieldName].invalid &&
      (this.addressFormLoggedIn.controls[fieldName].dirty || this.addressFormLoggedIn.controls[fieldName].touched);
  }

  formChange(): void {
    if (this.addressFormLoggedIn.valid && !isEmpty(this.selectedCity)) {
      this.noDeliveryAddressEmitter.emit(this.generateDeliveryAddress());
    } else {
      return;
    }
  }

  changeSelectedCity(): void {
    this.formChange();
  }

  generateDeliveryAddress(): DeliveryAddress {
    let deliveryAddress: DeliveryAddress = this.addressFormLoggedIn.value;
    deliveryAddress.locationId = this.selectedCity.id;
    return deliveryAddress;
  }
}
