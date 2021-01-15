import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';
import { DeliveryAddressService } from '../../services';

import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-edit',
  templateUrl: './delivery-edit.component.html',
  styleUrls: ['./delivery-edit.component.scss']
})
export class DeliveryEditComponent implements OnInit, OnDestroy {
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;
  addressForm: FormGroup;
  deliveryAddress: any[];
  selectedCity: any;
  id: number = -1;
  title: string;
  isSpinner: boolean = true;
  isInvalidErrors: boolean;
  isShown: boolean;
  isCreate: boolean;
  statusIcon: string;
  statusMsg: string;
  lang: string;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private deliveryAddressService: DeliveryAddressService,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.lang = this.cookieService.get('change_lang') || 'ro';
    this.deliveryAddressService.getLocations(this.lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.deliveryAddress = [...res.locations];
      this.initForm();
      this.activatedroute.queryParams.subscribe(params => {
        if (params.id) {
          this.id = params.id;
          this.title = $localize`:@@profile-delivery-update-title:Update delivery address`;
          this.deliveryAddressService.getCurrentAddress(params.id, this.lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.status !== 200) {
              this.isSpinner = false;
              this.router.navigate['/profile/update'];
              return
            }

            this.selectedCity = { id: this.deliveryAddress.filter(address => address.cities == res.result[0].city)[0].id, cities: res.result[0].city };

            this.setForm(res.result[0]);
            this.isSpinner = false;
            this.isCreate = false;
          },
            (errorResponse) => {
              this.isSpinner = false;
            });
        } else {
          this.title = $localize`:@@profile-delivery-create-title:Create delivery address`;
          this.selectedCity = res.locations[0];
          this.isSpinner = false;
          this.isCreate = true;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      houseNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      floor: [''],
      doorNumber: ['']
    });
  }

  setForm(address): void {
    this.addressForm.patchValue({
      street: address.street,
      houseNumber: address.houseNumber,
      floor: address.floor,
      doorNumber: address.doorNumber,
    });
  }

  isValidInput(fieldName): boolean {
    return this.addressForm.controls[fieldName].invalid &&
      (this.addressForm.controls[fieldName].dirty || this.addressForm.controls[fieldName].touched);
  }

  onChangeCity(e: any) {
    this.selectedCity = e.value.cities;
  }

  update(): void {
    this.isSpinner = true;
    const delivery_address = {
      city: this.selectedCity.cities,
      locationNameId: this.selectedCity.id,
      street: this.addressForm.value.street,
      houseNumber: this.addressForm.value.houseNumber,
      floor: this.addressForm.value.floor || "",
      doorNumber: this.addressForm.value.doorNumber || "",
    }

    this.deliveryAddressService.createDeliveryAddress(delivery_address, this.id).pipe(
      takeUntil(this._unsubscribeAll),
      finalize(() => {
        this.isSpinner = false;
      }))
      .subscribe(res => {
        if (res.status == 200 || res.status == 201) {
          this.isInvalidErrors = false;
          this.showMsg(true);
        } else {
          this.isInvalidErrors = true;
          this.showMsg(false);
        }
      },
        (errorResponse) => {
          this.isInvalidErrors = true;
          this.isSpinner = false;
          this.showMsg(false);
        });
  }

  showMsg(status): void {
    if (status) {
      this.statusIcon = "./assets/icons/success_icon.svg";
      this.statusMsg = $localize`:@@profile-delivery-edit-success-message:Successful data modification`;
    }
    else {
      this.statusIcon = "./assets/icons/fail_icon.svg";
      this.statusMsg = $localize`:@@profile-delivery-edit-failed-message:A server error has occurred`;
    }
    this.isShown = true;
  }

  closeMsg(): void {
    this.isShown = !this.isShown;
    if (!this.isInvalidErrors) {
      this.router.navigate(['/profile/delivery-list']);
    }
  }
}
