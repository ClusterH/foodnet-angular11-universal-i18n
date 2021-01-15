import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MustMatch } from '../../services/auth.validators';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPWDForm: FormGroup;
  errors: any = [];
  notify: string;
  isShown: boolean;
  isShownConfirm: boolean;
  currentToken: string;
  isInvalidErrors: boolean = false;
  isSpinner: boolean = false;
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private fb: FormBuilder, private authService: AuthService, private router: Router, private activatedroute: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.isShown = false;
    this.isShownConfirm = false;

    this.activatedroute.paramMap.subscribe(params => {
      this.currentToken = params.get('token');
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.resetPWDForm = this.fb.group({
      password: ['', [Validators.required,
      Validators.minLength(6), Validators.maxLength(30)]],
      passwordAgain: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'passwordAgain')
    });
  }

  isValidInput(fieldName): boolean {
    return this.resetPWDForm.controls[fieldName].invalid &&
      (this.resetPWDForm.controls[fieldName].dirty || this.resetPWDForm.controls[fieldName].touched);
  }

  resetPWD(): void {
    this.isSpinner = true;
    this.errors = [];

    this.authService.resetPWD(this.resetPWDForm.value, this.currentToken).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {

      this.isSpinner = false;

      this.router.navigate(['/auth/login']);
    },
      (errorResponse) => {
        this.isInvalidErrors = true;
        this.isSpinner = false;
      });
  }

  toggleEye(type: string): void {
    if (type == 'origin') {
      this.isShown = !this.isShown;
    }
    else {
      this.isShownConfirm = !this.isShownConfirm;
    }
  }


}
