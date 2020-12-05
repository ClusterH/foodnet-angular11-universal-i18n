import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileType: string;
  userName: string;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private cookieService: CookieService,
  ) {
    this.userName = this.cookieService.get('auth_name');
    this.activatedroute.paramMap.subscribe(params => {
      this.profileType = params.get('id');
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}
