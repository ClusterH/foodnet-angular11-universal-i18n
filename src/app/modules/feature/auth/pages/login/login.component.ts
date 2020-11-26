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
  errors: any = [];
  notify: string;

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
    this.route.queryParams.subscribe((params) => {
      const key1 = 'registered';
      const key2 = 'loggedOut';
      if (params[key1] === 'success') {
        this.notify = 'You have been successfully registered. Please Log in';
      }
      if (params[key2] === 'success') {
        this.notify = 'You have been loggedout successfully';
      }
      this.notifyService.success(this.notify);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
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
    console.log(this.loginForm.value);
    this.errors = [];
    this.authService.logIn(this.loginForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
      console.log(token);
      this.router.navigate(['/'], { queryParams: { loggedin: 'success' } });
    },
      (errorResponse) => {
        this.errors.push(errorResponse.error.error);
        this.notifyService.error(this.errors);
      });
  }

}
