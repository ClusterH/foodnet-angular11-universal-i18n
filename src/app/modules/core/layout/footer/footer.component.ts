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
      ["FoodNet", "Álláshirdetések", "Ügyfélszolgálat", "Kapcsolat", "Céginformáció"],
      ["Egyéb", "Koronavírus Tájékoztató", "Blog", "Allergének", "GY.I.K"],
      ["Kövess Minket", "Facebook", "Instagram", "Twitter", "TikTok"],
      ["Legal", "Weboldal használati Feltételek", "Cookie", "ÁSZF", "Adatkezelési Tájékoztató"]
    ]
  }

  ngOnInit(): void {
  }

}
