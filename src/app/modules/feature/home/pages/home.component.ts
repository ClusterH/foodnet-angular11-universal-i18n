import { Component, OnDestroy, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HomeService } from '../services/home.service';
import { CookieService } from '@gorniv/ngx-universal';

import { Restaurants, Locations } from '../models/home.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})

export class HomeComponent implements OnInit, OnDestroy {
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
  locations: Locations[];
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
        type: $localize`:@@home-section4-c:Strength #2`,
        description: $localize`:@@home-section4-g:Here will be the strength 2`,
      },
      {
        type: $localize`:@@home-section4-d:Strength #3`,
        description: $localize`:@@home-section4-h:Here will be the strength 3`,
      },
      {
        type: $localize`:@@home-section4-e:Strength #4`,
        description: $localize`:@@home-section4-i:Here will be the strength 4`,
      },
    ];
    this.slides = [
      {
        description: $localize`:@@home-section5-b-1:“is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.”`,
        name: "evapizza21",
        image: './assets/icons/user-avatar1.svg',
      },
      {
        description: $localize`:@@home-section5-b-2:“is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.”`,
        name: "evapizza21",
        image: './assets/icons/user-avatar2.svg',
      },
      {
        description: $localize`:@@home-section5-b-3:“is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.”`,
        name: "evapizza21",
        image: './assets/icons/user-avatar3.svg',
      },
    ]
  }

  ngOnInit(): void {
    const lang = this.cookieService.get('language') || 'en';

    const location_list = this.homeService.getLocations(lang);

    const bigCity1 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][0], `${lang}/`);
    const bigCity2 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][1], `${lang}/`);
    const bigCity3 = this.homeService.getBiggerCityRestaurants(this.bigCityNameAccordingToLang[lang][2], `${lang}/`);

    forkJoin([location_list, bigCity1, bigCity2, bigCity3]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([location_list, bigCity1, bigCity2, bigCity3]) => {
      this.locations = location_list.locations;

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

