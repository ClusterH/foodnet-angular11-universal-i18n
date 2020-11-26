import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from 'src/app/modules/core/notifications/notification.service'

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  errors: any = [];
  notify: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifyService: NotificationService,
  ) {
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
    this.registerForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    });
  }

  isValidInput(fieldName): boolean {
    return this.registerForm.controls[fieldName].invalid &&
      (this.registerForm.controls[fieldName].dirty || this.registerForm.controls[fieldName].touched);
  }

  register(): void {
    console.log(this.registerForm.value);
    this.errors = [];
    const test_registerData = {
      name: 'test', email: 'test@test.com', password: '!23456', newsletter: ''
    }
    this.authService.register(test_registerData).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
      console.log(token);
      this.router.navigate(['/auth/login'], { queryParams: { registered: 'success' } });
    },
      (errorResponse) => {
        this.errors.push(errorResponse.error.error);
      });
  }
}
