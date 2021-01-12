import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordService, MustMatch } from '../../services';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePwdForm: FormGroup;
  errors: any = [];
  isInvalidErrors: boolean;
  isSpinner: boolean = false;
  isShownOld: boolean;
  isShownNew: boolean;
  isShownConfirm: boolean;
  isShownDig: boolean;
  statusIcon: string;
  statusMsg: string;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private changePwdService: ChangePasswordService,
  ) {
    this._unsubscribeAll = new Subject();
    this.isShownOld = false;
    this.isShownNew = false;
    this.isShownConfirm = false;
    this.isShownDig = false;
    this.statusIcon = "./assets/icons/success_icon.svg";
    this.statusMsg = "Check your email account"
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.changePwdForm = this.fb.group({
      oldPassword: ['', [Validators.required,
      Validators.minLength(6), Validators.maxLength(30)]],
      newPassword: ['', [Validators.required,
      Validators.minLength(6), Validators.maxLength(30)]],
      passwordConfirm: ['', Validators.required],
    }, {
      validator: MustMatch('newPassword', 'passwordConfirm')
    });
  }

  isValidInput(fieldName): boolean {
    return this.changePwdForm.controls[fieldName].invalid &&
      (this.changePwdForm.controls[fieldName].dirty || this.changePwdForm.controls[fieldName].touched);
  }
  toggleEye(type: string): void {
    if (type == 'origin') {
      this.isShownOld = !this.isShownOld;
    }
    else if (type == 'new') {
      this.isShownNew = !this.isShownNew;
    } else {
      this.isShownConfirm = !this.isShownConfirm;
    }
  }

  save(): void {
    this.isSpinner = true;
    this.errors = [];
    const changedData = {
      "oldPassword": this.changePwdForm.value.oldPassword, "newPassword": this.changePwdForm.value.newPassword, "newPasswordAgain": this.changePwdForm.value.passwordConfirm
    }

    this.changePwdService.changePwd(changedData)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.isSpinner = false;
        }))
      .subscribe(res => {
        if (res.status == 400) {
          this.isInvalidErrors = true;
          this.isSpinner = false;
          this.showMsg(false);
        } else if (res.status == 200) {
          this.isInvalidErrors = false;
          this.showMsg(true);
        }
      });
  }

  showMsg(status): void {
    if (status) {
      this.statusIcon = "./assets/icons/success_icon.svg";
      this.statusMsg = $localize`:@@update-profile-success-message:Successful data modification`;
    }
    else {
      this.statusIcon = "./assets/icons/fail_icon.svg";
      this.statusMsg = $localize`:@@update-profile-failed-message:A server error has occurred`;
    }
    this.isShownDig = true;
  }

  closeMsg(): void {
    if (!this.isInvalidErrors) {
      this.initForm();
    }
    this.isShownDig = !this.isShownDig;
  }
}
