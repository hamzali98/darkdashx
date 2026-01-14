import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, FormsModule,],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  url : string = environment.PRODUCTS_URL;

  detailInfo: FormGroup;
  productFormSubmit: FormGroup;

  prodcutFormService = inject(FormService);
  routerRef = inject(Router);
  loaderService = inject(Loaderservice);
  httpService = inject(Httpservice);


  constructor() {
    this.productFormSubmit = this.prodcutFormService.getForm();
    this.detailInfo = this.prodcutFormService.getForm().get('detail_info') as FormGroup;
    this.detailInfo.markAllAsTouched();
  }

  get product_expiry() {
    return this.detailInfo.get("product_expiry");
  }

  get product_regno() {
    return this.detailInfo.get("product_regno");
  }

  get product_mfg() {
    return this.detailInfo.get("product_mfg");
  }

  get product_stock() {
    return this.detailInfo.get("product_stock");
  }

  onFormSubmit() {
    if (this.prodcutFormService.editing()) {
      this.loaderService.showLoader();
      console.log("Id for previous data", this.prodcutFormService.editingId());
      const id = this.prodcutFormService.editingId();
      console.log("ID : ", id);
      console.log("Whole Form", this.productFormSubmit.value);
      this.httpService.editApi(this.url, id, this.productFormSubmit.value).subscribe({
        next: (res) => {
          console.log(res);
          this.prodcutFormService.resetForm();
          this.routerRef.navigate(['/home/products']);
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hideLoader();
        }
      })
    } else {
      this.loaderService.showLoader();
      console.log("Whole Form", this.productFormSubmit.value);
      this.httpService.addApi(this.url, this.productFormSubmit.value).subscribe({
        next: (res) => {
          console.log(res);
          this.prodcutFormService.resetForm();
          this.routerRef.navigate(['/home/products']);
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hideLoader();
        }
      })
    }
  }

}
