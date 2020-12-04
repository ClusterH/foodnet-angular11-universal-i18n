import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileType: string;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute
  ) {
    this.activatedroute.paramMap.subscribe(params => {
      console.log(params);

      this.profileType = params.get('id');
      console.log(this.profileType);
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {

  }
}
