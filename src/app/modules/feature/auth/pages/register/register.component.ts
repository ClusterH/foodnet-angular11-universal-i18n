import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '@gorniv/ngx-universal';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MustMatch } from '../../services/auth.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errors: any = [];
  notify: string;
  isShown: boolean;
  isShownConfirm: boolean;
  isAcceptTerms: boolean;
  isNewsletter: boolean;
  isInvalidErrors: boolean;
  isSpinner: boolean = false;
  private _unsubscribeAll: Subject<any>;
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.isShown = false;
    this.isShownConfirm = false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // [A - zÀ - ú] // accepts lowercase and uppercase characters
  // [A - zÀ - ÿ] // as above but including letters with an umlaut (includes [ ] ^ \ × ÷)
  // [A - Za - zÀ - ÿ] // as above but not including [ ] ^ \
  // [A - Za - zØ - öø - ÿ]
  // ĂÂÎȘȚăâîșțÁÉÍÓÖŐÚÜŰáéíóöőúüű
  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.pattern('^[A-zĂÂÎȘȚăâîșțÁÉÍÓÖŐÚÜŰáéíóöőúüű ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required,
      Validators.minLength(6), Validators.maxLength(30)]],
      passwordConfirm: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'passwordConfirm')
    });
  }

  isValidInput(fieldName): boolean {
    return this.registerForm.controls[fieldName].invalid &&
      (this.registerForm.controls[fieldName].dirty || this.registerForm.controls[fieldName].touched);
  }

  register(): void {
    this.isSpinner = true;
    this.errors = [];
    const registerData = {
      lang: this.cookieService.get('change_lang'), name: this.registerForm.value.name, email: this.registerForm.value.email, password: this.registerForm.value.password, newsletter: this.isNewsletter ? 1 : 0
    }
    this.authService.register(registerData)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.isSpinner = false;
        }))
      .subscribe(token => {
        this.router.navigate(['']);
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
