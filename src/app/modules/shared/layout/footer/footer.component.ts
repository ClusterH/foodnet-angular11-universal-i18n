import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerList: any;

  constructor() {
    this.footerList = [
      ["FoodNet", $localize`:@@footer-a:Job advertisement`, $localize`:@@footer-b:Customer service`, $localize`:@@footer-c:Contact`, $localize`:@@footer-d:Company information`],
      ["Egyéb", $localize`:@@footer-e:Coronavirus information`, $localize`:@@footer-f:Blog`, $localize`:@@footer-g:Allergens`, $localize`:@@footer-h:FAQ`],
      ["Kövess Minket", "Facebook", "Instagram", "Twitter", "TikTok"],
      ["Legal", $localize`:@@footer-i:Website Terms of Use`, $localize`:@@footer-j:Cookie`, $localize`:@@footer-k:ÁSZF EN`, $localize`:@@footer-l:Adatkezelési tájékoztató EN`]
    ]
  }

  ngOnInit(): void {
  }

}
