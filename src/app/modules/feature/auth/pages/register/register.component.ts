import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from 'src/app/modules/core/notifications/notification.service'

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifyService: NotificationService,
  ) {
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
  // [A - Za - zÀ - ÖØ - öø - ÿ]
  initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.pattern('^[A-zÀ-ÖØ-öø-ÿ ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
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
      name: this.registerForm.value.name, email: this.registerForm.value.email, password: this.registerForm.value.password, newsletter: this.isNewsletter ? 1 : 0
    }
    this.authService.register(registerData)
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => {
          this.isSpinner = false;
        }))
      .subscribe(token => {
        this.router.navigate(['/'], { queryParams: { registered: 'success' } });
      },
        (errorResponse) => {
          this.isInvalidErrors = true;
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
