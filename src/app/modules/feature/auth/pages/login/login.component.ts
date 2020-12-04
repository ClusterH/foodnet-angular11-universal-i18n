import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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


  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifyService: NotificationService,
    private router: Router,
    private route: ActivatedRoute) {
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
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
      (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched);
  }

  login(): void {
    this.isSpinner = true;
    this.authService.logIn(this.loginForm.value, this.isStay).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
      this.isSpinner = false;
      this.router.navigate(['/profile/update']);
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
