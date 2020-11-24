import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
// import { environment } from '../../../../environments/environment';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HomeService } from '../services/home.service';
import { CookieService } from '@gorniv/ngx-universal';

import { Restaurants } from '../models/home.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})

export class HomeComponent implements OnInit {
  bigCityRestaurant_1: Restaurants;
  bigCityRestaurant_2: Restaurants;
  bigCityRestaurant_3: Restaurants;

  bigCityNameAccordingToLang = {
    en: ['targu-mures-en', 'miercurea-ciuc-en', 'odorheiu-secuiesc-en'],
    ro: ['targu-mures', 'miercurea-ciuc', 'odorheiu-secuiesc'],
    hu: ['marosvasarhely', 'csikszereda', 'szekelyudvarhely'],
  }

  features: any;
  strengths: any;
  slides: any;
  locations: any;
  texts: string[];
  results: string[];
  display: boolean = true;
  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private homeService: HomeService,
    private cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();

    this.features = [
      [
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_1.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_2.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_3.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_4.svg',
          link: 'bootstrap-prototype'
        },
      ],
      [
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_2.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_3.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_4.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_1.svg',
          link: 'bootstrap-prototype'
        },
      ],
      [
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_3.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_4.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_1.svg',
          link: 'bootstrap-prototype'
        },
        {
          type: 'Étterem neve',
          description: 'Étterem leírása leírása leírása leírása 2 sorban, hogy legyen helye',
          image: 'product_2.svg',
          link: 'bootstrap-prototype'
        },
      ]
    ];
    this.strengths = [
      {
        type: $localize`:@@home-section4-b:Strength #1`,
        description: $localize`:@@home-section4-f:Here will be the strength 1`,
      },
      {
        type: 'Erősség #2',
        description: 'Ide kibontanánk 1-2 mondatban, hogy miért is erősségünk ez.',
      },
      {
        type: 'Erősség #3',
        description: 'Ide kibontanánk 1-2 mondatban, hogy miért is erősségünk ez.',
      },
      {
        type: 'Erősség #4',
        description: 'Ide kibontanánk 1-2 mondatban, hogy miért is erősségünk ez.',
      },
    ];
    this.slides = [
      {
        description: "“Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.”",
        name: "evapizza21",
        image: './assets/icons/user-avatar1.svg',
      },
      {
        description: "“Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.”",
        name: "evapizza21",
        image: './assets/icons/user-avatar2.svg',
      },
      {
        description: "“Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.”",
        name: "evapizza21",
        image: './assets/icons/user-avatar3.svg',
      },
    ]
  }

  ngOnInit(): void {
    const lang = this.cookieService.get('language') || 'en';

    const bigCity1 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][0], `${lang}/`);
    const bigCity2 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][1], `${lang}/`);
    const bigCity3 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][2], `${lang}/`);

    forkJoin([bigCity1, bigCity2, bigCity3]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([bigCity1, bigCity2, bigCity3]) => {
      this.bigCityRestaurant_1 = bigCity1.restaurants;
      this.bigCityRestaurant_2 = bigCity2.restaurants;
      this.bigCityRestaurant_3 = bigCity3.restaurants;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  searchCity(event) {
    this.results = [];
    this.locations.forEach(item => {
      if (item.cities.toLowerCase().includes(event.query)) {
        this.results.push(item.cities);
      }
    });
  }
}
