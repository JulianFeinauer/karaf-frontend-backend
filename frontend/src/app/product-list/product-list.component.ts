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
    this.dataService.getAll<Product[]>().subscribe((value: Product[]) => {
        this.products = value;
        console.log(value);
      },
      (e: Error) => {
        this.spinner.hide();
        this.toasterService.pop('error', 'Damn', 'Something went wrong: ' + e.message);
      },
      () => {
        this.spinner.hide();
        this.toasterService.pop('success', 'Complete', 'Getting all values complete');
      });
  }

  public getProducts(): Product[] {
    return this.products;
  }

  popup(id: number) {
    this.dataService.getSingle<Product>(id).subscribe(
      (value:Product) => this.toasterService.pop('info', 'Fetch', 'Hallo ' + value.employee_name),
      (e: Error) => {
        this.toasterService.pop('error', 'Damn', 'Something went wrong: ' + e.message);
      }
    )
  }

}
