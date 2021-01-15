import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeliveryAddress } from '../../../../models';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-restaurant-order-delivery-logout',
  templateUrl: './restaurant-order-delivery-logout.component.html',
  styleUrls: ['./restaurant-order-delivery-logout.component.scss']
})
export class RestaurantOrderDeliveryLogoutComponent implements OnInit {
  addressForm: FormGroup;
  locationList: any[];
  selectedCity: any;
  lang: string;
  private _unsubscribeAll: Subject<any>;

  @Output() logoutDeliveryAddressEmitter = new EventEmitter<DeliveryAddress>();

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
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required,
      Validators.pattern('^[A-zĂÂÎȘȚăâîșțÁÉÍÓÖŐÚÜŰáéíóöőúüű ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$')]],
      phone: ['', [Validators.required,
      Validators.minLength(5), Validators.maxLength(30)]],
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
    return this.addressForm.controls[fieldName].invalid &&
      (this.addressForm.controls[fieldName].dirty || this.addressForm.controls[fieldName].touched);
  }

  formChange(): void {
    if (this.addressForm.valid && !isEmpty(this.selectedCity)) {
      this.logoutDeliveryAddressEmitter.emit(this.generateDeliveryAddress());
    } else {
      return;
    }
  }
  changeSelectedCity(): void {
    this.formChange();
  }

  generateDeliveryAddress(): DeliveryAddress {
    let deliveryAddress: DeliveryAddress = this.addressForm.value;
    deliveryAddress.locationId = this.selectedCity.id;

    return deliveryAddress;
  }
}
