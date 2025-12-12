import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../service/form-service';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, FormsModule, ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

    detailInfo : FormGroup;

    productForm = inject(FormService);

  constructor(){
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


}
