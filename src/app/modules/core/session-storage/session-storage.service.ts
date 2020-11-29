import { Injectable, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })

export class SessionStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
    }
  }

  setItem(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, value);
    }
  }

  getItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(key);
    }
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(key);
    }
  }

  key(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.key(index);
    }
  }

  length() {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.length;
    }
  }
}
