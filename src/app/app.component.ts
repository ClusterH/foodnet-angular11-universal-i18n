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
    // const temp_token = this.cookieService.get('auth_tkn_temp') || null;
    // const temp_lang = this.cookieService.get('change_lang') || null;

    if (!this.cookieService.get('stay_login') && !this.cookieService.get('change_lang')) {
      this.cookieService.removeAll();
    }
    // this.cookieService.put('change_lang', temp_lang);
    // if (this.cookieService.get('change_lang')) {
    //   this.cookieService.put('auth_tkn_temp', temp_token);
    // }
  }
  constructor(public cookieService: CookieService) { }

  ngOnInit(): void { }

}
