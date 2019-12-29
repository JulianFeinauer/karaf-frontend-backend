import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Product } from '../product';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  spinner: HTMLIonLoadingElement;
  product: Product;
  id: number;

  constructor(private route: ActivatedRoute, private dataService: DataService, private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.spinner = await this.loadingCtrl.create({ message: 'Please wait' });
    this.spinner.present();
    this.dataService.getSingle<Product>(this.id).subscribe(
      async (value: Product) => {
        this.spinner.dismiss();
        this.product = value;
      },
      async (e: Error) => {
        this.spinner.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Something went wrong: ' + e.message,
          header: 'Damn'
        });
        toast.present();
      }
    );
  }

}
