import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
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

export class InlineCarouselComponent implements OnInit {
  display: boolean;
  public isBrowser: boolean;
  showIndex: any = 0;
  translateWidth: any = 0;

  @ViewChild('carouselContainer', { static: true }) carouselContainer: ElementRef;
  @ViewChild('carouselItems', { static: true }) carouselItems: ElementRef;
  @ViewChild('prevCarousel', { static: true }) prevCarousel: ElementRef;
  @ViewChild('nextCarousel', { static: true }) nextCarousel: ElementRef;

  @Input() itemList: Array<Category>;
  @Input() disabledOption: Boolean = true;
  @Input() optionType: string;
  @Output() selectedItemEmitter = new EventEmitter<{}>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
  }

  nextShowCarousel(e): void {
    const btn = Array.from(document.getElementsByClassName('inline-carousel-item') as HTMLCollectionOf<HTMLElement>);

    if (this.carouselItems.nativeElement.clientWidth > this.carouselContainer.nativeElement.clientWidth - 100) {
      const diff = this.carouselItems.nativeElement.clientWidth - this.carouselContainer.nativeElement.clientWidth + 100;
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

  selectItem(item): void {
    this.selectedItemEmitter.emit({
      type: this.optionType,
      param: item
    })
  }

}

