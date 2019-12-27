import {Component, Input, OnInit} from '@angular/core';
import {ToasterConfig, ToasterService} from 'angular2-toaster';
import {Product} from '../product';
import {DataService} from '../data.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input('products')
  private products: Product[];

  p: number = 1;

  constructor(
    private dataService: DataService,
    private toasterService: ToasterService,
    private spinner: NgxSpinnerService) {
    this.dataService.getAll<any>();
  }

  ngOnInit() {
    console.log('Starting Spinner...')
    let promise = this.spinner.show();
    console.log(promise)
    this.dataService.getAll<any[]>().subscribe((value: any[]) => {
        this.products = value;
        console.log(value);
      },
      () => {
        this.spinner.hide();
        this.toasterService.pop('error', 'Damn', 'Something went wrong...');
      },
      () => {
        this.spinner.hide();
        this.toasterService.pop('success', 'Complete', 'Getting all values complete');
      });
  }

}
