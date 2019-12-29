import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../product';
import {DataService} from '../data.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input('products')
  private products: Product[];

  p: number = 1;
  spinner: HTMLIonLoadingElement;

  constructor(
    private dataService: DataService, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.dataService.getAll<any>();
  }

  async ngOnInit() {
    console.log('Starting Spinner...');
    this.spinner = await this.loadingCtrl.create({message: 'Please wait'});
    this.spinner.present();
    this.dataService.getAll<Product[]>().subscribe((value: Product[]) => {
        this.products = value;
        console.log(value);
      },
      async (e: Error) => {
        this.spinner.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Something went wrong: ' + e.message,
          header: 'Damn'
        });
        toast.present();
      },
      async () => {
        this.spinner.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Getting all values complete',
          header: 'Complete',
          duration: 5000
        });
        toast.present();
      });
  }

  public getProducts(): Product[] {
    return this.products;
  }
}
