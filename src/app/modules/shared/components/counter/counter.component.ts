import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';
import { FileDetector } from 'protractor';
import { Observable, of } from 'rxjs';

export class CounterOption {
  checkRequire?: boolean = false;
  statusOption?: string = 'check';
  extra_minQuantity?: number;
  extra_maxQuantity?: number;
  count?: number;
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})

export class CounterComponent implements OnInit {
  display: boolean;
  public isBrowser: boolean;
  counter$: Observable<number>;
  counter: number = 1;

  // @Input() checkRequire: boolean = false;
  // @Input() statusOption: string = "check";
  @Input() counterOption: CounterOption;
  @Output() counterEmitter = new EventEmitter<{}>();
  @Output() openExtraEmitter = new EventEmitter<boolean>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.counter$ = of(this.counter);
  }

  ngOnInit(): void {
    if (this.counterOption.extra_minQuantity) {
      this.counter = this.counterOption.extra_minQuantity;
      this.counter$ = of(this.counter);
    }

    if (this.counterOption.count) {
      this.counter = this.counterOption.count;

      this.counter$ = of(this.counter);
    }
  }

  ngOnChanges(): void {
    if (this.counterOption.count) {
      this.counter = this.counterOption.count;

      this.counter$ = of(this.counter);
    }
  }

  counterChange(event, direct): void {
    event.stopPropagation();
    if (direct == 'increase') {
      if (this.counterOption.extra_maxQuantity && this.counter == this.counterOption.extra_maxQuantity) { return; }
      this.counter++;
      this.counter$ = of(this.counter);
    }
    else if (direct == 'decrease' && this.counter > 1) {
      if (this.counterOption.extra_minQuantity && this.counter == this.counterOption.extra_minQuantity) { return; }
      this.counter--;
      this.counter$ = of(this.counter);
    }

    this.counterEmitter.emit({
      counts: this.counter
    });
  }

  openExtraPopUpEmitter(): void {
    this.openExtraEmitter.emit(true);
  }
}
