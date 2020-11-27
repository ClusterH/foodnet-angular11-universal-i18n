import { Component, OnInit, HostListener } from '@angular/core';
import { CookieService } from '@gorniv/ngx-universal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'foodnet';
  @HostListener("window:beforeunload", ["$event"])
  clearCookie(event) {
    if (!this.cookieService.get('stay_login')) {
      this.cookieService.removeAll();
    }
  }
  constructor(public cookieService: CookieService) { }

  ngOnInit(): void { }

}
