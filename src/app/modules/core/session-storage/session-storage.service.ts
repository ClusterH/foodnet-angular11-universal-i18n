import { Injectable, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class SessionStorageService {
  paramStore = new BehaviorSubject<any>(null);
  $params = this.paramStore.asObservable();

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

  setParams(param) {
    this.paramStore.next(param);
  }

  getParams() {
    return this.paramStore;
  }
}
