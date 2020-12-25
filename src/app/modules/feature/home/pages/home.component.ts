import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '@gorniv/ngx-universal';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Locations, Restaurants } from '../models/home.model';
import { HomeService } from '../services/home.service';
import { SessionStorageService } from '../../../core';

const BigCityNameAccordingToLang = {
  en: ['targu-mures-en', 'miercurea-ciuc-en', 'odorheiu-secuiesc-en'],
  ro: ['targu-mures', 'miercurea-ciuc', 'odorheiu-secuiesc'],
  hu: ['marosvasarhely', 'csikszereda', 'szekelyudvarhely'],
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})

export class HomeComponent implements OnInit, OnDestroy {
  lang: string;
  bigCityRestaurant_1: Restaurants[];
  bigCityRestaurant_2: Restaurants[];
  bigCityRestaurant_3: Restaurants[];

  strengths: any;
  slides: any;
  locations: Locations[];
  texts: string;
  results: string[];
  display: boolean = true;
  isSpinner: boolean = false;

  public isBrowser: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private homeService: HomeService,
    private sessionStorageService: SessionStorageService,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    this.isSpinner = true;

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
    if (this.cookieService.get('change_lang')) {
      this.lang = this.cookieService.get('change_lang');
    } else {
      this.lang = window.location.pathname.split('/')[1] || 'ro';
    }

    const location_list = this.homeService.getLocations(this.lang);
    const imgPath = 'https://admin.foodnet.ro/'
    const bigCity1 = this.homeService.getBiggerCityRestaurants(1, `${this.lang}/`);
    const bigCity2 = this.homeService.getBiggerCityRestaurants(2, `${this.lang}/`);
    const bigCity3 = this.homeService.getBiggerCityRestaurants(3, `${this.lang}/`);

    forkJoin([location_list, bigCity1, bigCity2, bigCity3]).pipe(takeUntil(this._unsubscribeAll)).subscribe(([location_list, bigCity1, bigCity2, bigCity3]) => {
      this.locations = location_list.locations;

      this.bigCityRestaurant_1 = bigCity1.result;
      this.bigCityRestaurant_1.map(item => {
        item.restaurant_coverImage_new = imgPath + item.restaurant_coverImage;
        return item;
      });

      this.bigCityRestaurant_2 = bigCity2.result;
      this.bigCityRestaurant_2.map(item => {
        item.restaurant_coverImage_new = imgPath + item.restaurant_coverImage;
        return item;
      });

      this.bigCityRestaurant_3 = bigCity3.result;
      this.bigCityRestaurant_3.map(item => {
        item.restaurant_coverImage_new = imgPath + item.restaurant_coverImage;
        return item;
      });

      this.isSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  searchCity(event) {
    this.results = [];
    this.locations.forEach(item => {
      if (item.cities.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(event.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
        this.results.push(item.cities);
      }
    });
  }

  acceptCookie() {
    if (this.display) {
      this.display = false;
      this.cookieService.put('authInfo', "accepted");
    }
  }

  getRestaurantsByLocation(id: number = 0): void {
    if (id == 0) {
      const location = this.locations.find(item => item.cities === this.texts);

      this.cookieService.put('currentLocationId', location.id.toString());

      this.router.navigate([`/${location.cities}`]);

    } else {
      const cityList = {
        en: ['Târgu Mureș en', 'Miercurea Ciuc en', 'Odorheiu Secuiesc en'],
        ro: ['Târgu Mureș', 'Miercurea Ciuc', 'Odorheiu Secuiesc'],
        hu: ['Marosvásárhely', 'Csíkszereda', 'Székelyudvarhely'],
      }

      this.cookieService.put('currentLocationId', id.toString());

      this.router.navigate([`${cityList[this.cookieService.get('change_lang')][id - 1]}`]);
      // this.router.navigate([`restaurant/Targu-Mures`]);
      // this.router.navigate([`list/${id}`]);
    }
  }
}
