import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '@gorniv/ngx-universal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  lostPWForm: FormGroup;
  errors: any = [];
  notify: string;
  isShown: boolean;
  statusIcon: string;
  statusMsg: string;
  public isBrowser: boolean;
  isSpinner: boolean = false;

  private _unsubscribeAll: Subject<any>;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
    this.isBrowser = isPlatformBrowser(platformId);
    this.isShown = false;
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
    this.lostPWForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$')]]
    });
  }

  isValidInput(fieldName): boolean {
    return this.lostPWForm.controls[fieldName].invalid &&
      (this.lostPWForm.controls[fieldName].dirty || this.lostPWForm.controls[fieldName].touched);
  }

  sendMsg(): void {
    this.isSpinner = true;
    const lang = this.cookieService.get('change_lang');
    this.authService.reset(this.lostPWForm.value, lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      if (res.status == 200) {
        this.statusIcon = "./assets/icons/success_icon.svg";
        this.statusMsg = $localize`:@@forgotten-check-email-a:Check your email account`;
      }
      else {
        this.statusIcon = "./assets/icons/fail_icon.svg";
        this.statusMsg = $localize`:@@forgotten-server-b:A server error has occurred`;
      }
      this.isShown = true;
      this.isSpinner = false;
    });
  }

  closeMsg(): void {
    this.isShown = !this.isShown;
  }
}
