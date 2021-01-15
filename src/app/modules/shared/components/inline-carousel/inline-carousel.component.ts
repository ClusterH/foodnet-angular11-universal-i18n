import { Component, Input, Output, OnInit, OnChanges, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';

export interface Category {
  value?: string;
  name?: string;
}

@Component({
  selector: 'app-inline-carousel',
  templateUrl: './inline-carousel.component.html',
  styleUrls: ['./inline-carousel.component.scss'],
})

export class InlineCarouselComponent implements OnInit, OnChanges {
  display: boolean;
  public isBrowser: boolean;
  showIndex: number = 0;
  translateWidth: number = 0;
  isDaily: boolean = false;
  weekIndex: number = 0;

  @ViewChild('carouselContainer', { static: true }) carouselContainer: ElementRef;
  @ViewChild('carouselItems', { static: true }) carouselItems: ElementRef;
  @ViewChild('prevCarousel', { static: true }) prevCarousel: ElementRef;
  @ViewChild('nextCarousel', { static: true }) nextCarousel: ElementRef;

  @Input() itemList: Array<Category>;
  @Input() disabledOption: Boolean = true;
  @Input() optionType: string;
  @Input() translatePosition: number = -1;
  @Output() selectedItemEmitter = new EventEmitter<{}>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.translateWidth = 0;
  }

  ngOnChanges(): void {
    if (this.translatePosition != -1) {
      this.translateWidth = this.translatePosition;
      this.carouselItems.nativeElement.style.transform = 'translate3d(' + this.translateWidth + 'px, 0px ,0px)';
    }

    if (this.itemList[0].name == "Sunday" || this.itemList[0].name == "Duminică" || this.itemList[0].name == "Vasárnap") {
      this.isDaily = true;
      this.weekIndex = new Date().getDay();
    } else {
      this.isDaily = false;
      this.weekIndex = 0;
    }
  }

  nextShowCarousel(e): void {
    const btn = Array.from(document.getElementsByClassName('inline-carousel-item') as HTMLCollectionOf<HTMLElement>);

    if (this.carouselItems.nativeElement.clientWidth > this.carouselContainer.nativeElement.clientWidth - 20) {
      const diff = this.carouselItems.nativeElement.clientWidth - this.carouselContainer.nativeElement.clientWidth + 20;
      if (diff > Math.abs(this.translateWidth)) {
        this.translateWidth += Number(-1) * Number(btn[this.showIndex].clientWidth) - 20;
      }
    }
    else {
      this.showIndex = -1;
      this.translateWidth = 0;
    }
    this.carouselItems.nativeElement.style.transform = 'translate3d(' + this.translateWidth + 'px, 0px ,0px)';

    this.showIndex++;
  }

  prevShowCarousel(e): void {
    const btn = Array.from(document.getElementsByClassName('inline-carousel-item') as HTMLCollectionOf<HTMLElement>);
    if (this.showIndex >= 1) {
      this.translateWidth += Number(btn[this.showIndex - 1].clientWidth) + 20;
    }
    if (0 == this.showIndex || this.translateWidth > 0) {
      this.showIndex = 1;
      this.translateWidth = 0;
    }
    this.carouselItems.nativeElement.style.transform = 'translate3d(' + this.translateWidth + 'px, 0px ,0px)';
    this.showIndex--;
  }

  selectItem(event, item): void {
    let parentElement = event.target.parentElement;
    for (let i = 0; i < parentElement.children.length; i++) {
      parentElement.children[i].classList.remove("active");
    }
    event.target.classList.add("active");
    this.selectedItemEmitter.emit({
      type: this.optionType,
      param: item
    })
  }
}
