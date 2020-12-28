import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';
import { FileDetector } from 'protractor';

export class CounterOption {
  checkRequire?: boolean = false;
  statusOption?: string = 'check';
  extra_minQuantity?: number;
  extra_maxQuantity?: number;
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})

export class CounterComponent implements OnInit {
  display: boolean;
  public isBrowser: boolean;
  counter: number = 1;

  // @Input() checkRequire: boolean = false;
  // @Input() statusOption: string = "check";
  @Input() counterOption: CounterOption;
  @Output() counterEmitter = new EventEmitter<{}>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.counterOption.extra_minQuantity) {
      this.counter = this.counterOption.extra_minQuantity;
    }
  }

  counterChange(event, direct): void {
    event.stopPropagation();
    if (direct == 'increase') {
      if (this.counterOption.extra_maxQuantity && this.counter == this.counterOption.extra_maxQuantity) { return; }
      this.counter++;
    }
    else if (direct == 'decrease' && this.counter > 1) {
      if (this.counterOption.extra_minQuantity && this.counter == this.counterOption.extra_minQuantity) { return; }
      this.counter--;
    }
    this.counterEmitter.emit({
      counts: this.counter
    });
  }

}

