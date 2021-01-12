import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DeleteProfileService } from '../../services';
import { AuthService } from '../../../auth/services';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.scss']
})
export class DeleteProfileComponent implements OnInit {
  id: number;
  title: string;
  isShown: boolean;
  isSpinner: boolean = false;
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private deleteProfileService: DeleteProfileService,
    private authService: AuthService
  ) {
    this._unsubscribeAll = new Subject();
    this.isBrowser = isPlatformBrowser(platformId);
    this.isShown = false;
  }

  ngOnInit(): void {
  }

  closeMsg(isDelete: boolean): void {
    if (isDelete) {
      this.isSpinner = true;
      this.deleteProfileService.deleteProfile().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

        this.isShown = false;
        this.isSpinner = false;
        this.authService.logout();
        this.router.navigate(['']);
      },
        (errorResponse) => {
          this.isShown = false;
          this.isSpinner = false;
        });;
    } else {
      this.isShown = false;
    }
  }

  deleteProfile(): void {
    this.isShown = true;
  }
}
