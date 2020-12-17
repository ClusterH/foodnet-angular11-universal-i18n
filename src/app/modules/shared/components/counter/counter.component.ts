import { Component, Input, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@gorniv/ngx-universal';
import { FileDetector } from 'protractor';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})

export class CounterComponent implements OnInit {
  display: boolean;
  public isBrowser: boolean;
  counter: number = 1;

  @Input() checkRequire: boolean = false;
  @Input() statusOption: string = "check";
  @Output() counterEmitter = new EventEmitter<{}>();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public cookieService: CookieService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
  }

  counterChange(direct): void {
    if(direct == 'increase') {
      this.counter++;
    }
    else if(direct == 'decrease' && this.counter > 1) {
      this.counter--;
    }
    this.counterEmitter.emit({
      counts: this.counter
    });
  }

}

