import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateService } from '../../services';
import { CookieService } from '@gorniv/ngx-universal';
import { AuthService } from '../../../auth/services';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  updateForm: FormGroup;
  errors: any = [];
  isInvalidErrors: boolean;
  isSpinner: boolean = false;
  isShown: boolean;
  statusIcon: string;
  statusMsg: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private updateService: UpdateService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this._unsubscribeAll = new Subject();
    this.isShown = false;
    this.statusIcon = "./assets/icons/success_icon.svg";
    this.statusMsg = "Check your email account"
  }

  ngOnInit(): void {
    this.initForm();
    this.setValue();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.pattern('^[A-zĂÂÎȘȚăâîșțÁÉÍÓÖŐÚÜŰáéíóöőúüű ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      phonenumber: ['', [Validators.required,
      Validators.minLength(5), Validators.maxLength(30)]],
    });
  }

  setValue(): void {
    this.updateForm.patchValue({
      name: this.cookieService.get('auth_name'),
      email: this.cookieService.get('auth_email'),
    });
  }

  isValidInput(fieldName): boolean {
    return this.updateForm.controls[fieldName].invalid &&
      (this.updateForm.controls[fieldName].dirty || this.updateForm.controls[fieldName].touched);
  }

  save(): void {
    this.isSpinner = true;
    this.errors = [];
    const registerData = {
      email: this.updateForm.value.email, fullName: this.updateForm.value.name, phoneNumber: this.updateForm.value.phonenumber
    }
    this.updateService.update(registerData)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.isSpinner = false;
        }))
      .subscribe(res => {
        this.isInvalidErrors = false;
        this.showMsg(true);
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
      this.statusMsg = $localize`:@@profile-update-success-message:Successful data modification`;
      this.cookieService.put('auth_name', this.updateForm.controls['name'].value);
    }
    else {
      this.statusIcon = "./assets/icons/fail_icon.svg";
      this.statusMsg = $localize`:profile-update-failed-message:A server error has occurred`;
    }
    this.isShown = true;
  }

  closeMsg(): void {
    this.isShown = !this.isShown;
  }
}
