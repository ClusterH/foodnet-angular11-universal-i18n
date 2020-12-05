import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-menulist',
  templateUrl: './profile-menulist.component.html',
  styleUrls: ['./profile-menulist.component.scss']
})
export class ProfileMenulistComponent implements OnInit {
  profileType: string;
  userName: string;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
  ) {
    this.activatedroute.paramMap.subscribe(params => {
      this.profileType = params.get('id');
    });
  }

  ngOnInit(): void {
  }

  loadComponent(component): void {
    this.router.navigate(['/profile/' + component]);
    // this.profileType = component;
  }

}
