import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '@gorniv/ngx-universal';
import { NotificationService } from 'src/app/modules/core/notifications/notification.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isInvalidErrors: boolean = false;
  notify: string;
  isShown: boolean;
  isStay: boolean;
  isSpinner: boolean = false;
  public isBrowser: boolean;

  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.isInvalidErrors = false;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$')]],
      password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  login(): void {
    this.isSpinner = true;
    const lang = this.cookieService.get('change_lang');
    this.authService.logIn(this.loginForm.value, this.isStay, lang).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
      this.isSpinner = false;
      this.router.navigate(['']);
    },
      (errorResponse) => {
        this.isInvalidErrors = true;
        this.isSpinner = false;
      });
  }

  toggleEye(): void {
    this.isShown = !this.isShown;
  }
}
