import {Component} from '@angular/core';
import {Product} from './product';
import {ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 10000,
      animation: 'fade'
    });

  title = 'test-cli';
  message = 'this is a message';
  products: Product[] = [new Product('Julian Produkt 1'), new Product('Julian Produkt 2')];

}
