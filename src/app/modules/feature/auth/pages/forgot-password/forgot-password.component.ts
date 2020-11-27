import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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

  private _unsubscribeAll: Subject<any>;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder, private authService: AuthService,
    private router: Router, private route: ActivatedRoute) {
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
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]]
    });
  }

  isValidInput(fieldName): boolean {
    return this.lostPWForm.controls[fieldName].invalid &&
      (this.lostPWForm.controls[fieldName].dirty || this.lostPWForm.controls[fieldName].touched);
  }

  // login(): void {
  //   this.isShown = true;
  //   let status = true;
  //   if (status) {
  //     console.log(this.lostPWForm.value);
  //     this.statusIcon = "./assets/icons/success_icon.svg";
  //     this.statusMsg = "Check your email account";
  //   }
  //   else {
  //     this.statusIcon = "./assets/icons/fail_icon.svg";
  //     this.statusMsg = "A server error has occurred";
  //   }
  //   // this.errors = [];
  //   // this.authService.logIn(this.lostPWForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
  //   //   console.log(token);
  //   //   this.router.navigate(['/'], { queryParams: { loggedin: 'success' } });
  //   // },
  //   //   (errorResponse) => {
  //   //     this.errors.push(errorResponse.error.error);
  //   //   });

  // }

  sendMsg(): void {
    this.isShown = true;
    console.log(this.lostPWForm.value);
    this.authService.reset(this.lostPWForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.statusIcon = "./assets/icons/success_icon.svg";
        this.statusMsg = "Check your email account";
      }
      else {
        this.statusIcon = "./assets/icons/fail_icon.svg";
        this.statusMsg = "A server error has occurred";
      }

      // this.router.navigate(['/'], { queryParams: { loggedin: 'success' } });
    });


    // this.errors = [];
    // this.authService.logIn(this.lostPWForm.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(token => {
    //   console.log(token);
    //   this.router.navigate(['/'], { queryParams: { loggedin: 'success' } });
    // },
    //   (errorResponse) => {
    //     this.errors.push(errorResponse.error.error);
    //   });

  }

  closeMsg(): void {
    this.isShown = !this.isShown;
  }

}
