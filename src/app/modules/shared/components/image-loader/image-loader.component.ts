import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-with-loading',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent {
  @Input() loader: string = './assets/images/loading_spinner1.svg';
  @Input() height: number = 200;
  @Input() width: number = 200;
  @Input() imageUrl: string;

  isLoading: boolean;

  constructor() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
}
