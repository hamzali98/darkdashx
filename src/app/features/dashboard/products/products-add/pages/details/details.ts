import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../service/form-service';
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, FormsModule, ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  url = "products";

    detailInfo : FormGroup;
    productFormSubmit : FormGroup;

    productForm = inject(FormService);
    routerRef = inject(Router);
  loaderService = inject(Loaderservice); 
  httpService = inject(Httpservice);


  constructor(){
    this.productFormSubmit = this.productForm.getForm();
    this.detailInfo = this.productForm.getForm().get('detail_info') as FormGroup;
    this.detailInfo.markAllAsTouched();
  }

  get product_expiry(){
    return this.detailInfo.get("product_expiry");
  }

  get product_regno(){
    return this.detailInfo.get("product_regno");
  }

  get product_mfg(){
    return this.detailInfo.get("product_mfg");
  }

  get product_stock(){
    return this.detailInfo.get("product_stock");
  }

  onFormSubmit(){
    this.loaderService.showLoader();
        console.log("Whole Form", this.productFormSubmit.value);
        this.httpService.addApi(this.url, this.productFormSubmit.value).pipe(
          finalize(() => {
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1200);
            this.productForm.resetForm();
            this.routerRef.navigate(['/home/products']);
          })
        ).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
            this.loaderService.hideLoader();
          },
          complete: () => {
            this.loaderService.hideLoader();
          }
        })
  }

}
